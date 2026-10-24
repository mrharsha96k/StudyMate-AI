
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import PendingRegistration from "../models/PendingRegistration.js";
import { firebaseAuth } from "../config/firebaseAdmin.js";

const disposableDomains = new Set([
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "mailinator.com",
  "10minutemail.com",
  "yopmail.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
]);

function getEncryptionKey() {
  const key = process.env.REGISTRATION_ENCRYPTION_KEY;

  if (!key || !/^[a-f0-9]{64}$/i.test(key)) {
    throw new Error("Invalid REGISTRATION_ENCRYPTION_KEY");
  }

  return Buffer.from(key, "hex");
}

function encryptPassword(password) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);

  return [
    iv.toString("hex"),
    cipher.getAuthTag().toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

function decryptPassword(value) {
  const [ivHex, tagHex, encryptedHex] = value.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}

function createMailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function startRegistration(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const name = typeof fullName === "string" ? fullName.trim() : "";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!name || !normalizedEmail || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6 || Buffer.byteLength(password, "utf8") > 1024) {
      return res.status(400).json({
        success: false,
        message: "Please choose a valid password.",
      });
    }

    const domain = normalizedEmail.split("@").pop();

    if (disposableDomains.has(domain)) {
      return res.status(400).json({
        success: false,
        message: "Temporary email addresses are not allowed.",
      });
    }

    try {
      await firebaseAuth.getUserByEmail(normalizedEmail);

      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please log in.",
      });
    } catch (error) {
      if (error.code !== "auth/user-not-found") throw error;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Replace any previous unverified registration for this email.
    await PendingRegistration.deleteOne({ email: normalizedEmail });

    await PendingRegistration.create({
      fullName: name,
      email: normalizedEmail,
      encryptedPassword: encryptPassword(password),
      verificationTokenHash: tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is not configured");
    }

    const verificationUrl =
      `${frontendUrl}/verify-email?token=${token}`;

    try {
      await createMailer().sendMail({
        from: `"StudyMate AI" <${process.env.SMTP_USER}>`,
        to: normalizedEmail,
        subject: "Verify your StudyMate AI registration",
        text:
          `Hello ${name},\n\n` +
          `Click this link within 15 minutes to complete registration:\n` +
          `${verificationUrl}\n\n` +
          "If you did not request this, ignore this email.",
      });
    } catch (mailError) {
      await PendingRegistration.deleteOne({ email: normalizedEmail });
      throw mailError;
    }

    return res.status(200).json({
      success: true,
      message: "Check your email and click the verification link to complete registration.",
    });
  } catch (error) {
    console.error("Start registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to start registration. Please try again.",
    });
  }
}

export async function verifyRegistration(req, res) {
  try {
    const { token } = req.body;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const pending = await PendingRegistration.findOne({
      verificationTokenHash: tokenHash,
      expiresAt: { $gt: new Date() },
    }).select("+encryptedPassword +verificationTokenHash");

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "This verification link is invalid or has expired. Please sign up again.",
      });
    }

    const password = decryptPassword(pending.encryptedPassword);

    try {
      await firebaseAuth.createUser({
        email: pending.email,
        password,
        displayName: pending.fullName,
        emailVerified: true,
      });
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        await PendingRegistration.deleteOne({ _id: pending._id });

        return res.status(409).json({
          success: false,
          message: "This email is already registered. Please log in.",
        });
      }

      throw error;
    }

    await PendingRegistration.deleteOne({ _id: pending._id });

    return res.status(200).json({
      success: true,
      message: "Email verified and registration completed. You can now log in.",
    });
  } catch (error) {
    console.error("Verify registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify your registration. Please try again.",
    });
  }
}
