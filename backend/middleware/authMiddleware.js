
import { firebaseAuth } from "../config/firebaseAdmin.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const idToken = authHeader.slice(7).trim();

    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: "Missing authentication token.",
      });
    }

    const decodedToken = await firebaseAuth.verifyIdToken(idToken);

    // Block accounts that haven't verified their email.
    if (decodedToken.email_verified !== true) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before accessing StudyMate AI.",
      });
    }

    // Identity is taken only from the verified Firebase token.
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
      emailVerified: decodedToken.email_verified === true,
    };

    return next();
  } catch (error) {
    console.error("Authentication verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token. Please log in again.",
    });
  }
};
