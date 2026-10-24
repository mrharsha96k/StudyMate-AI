import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
      select: false,
    },
    verificationTokenHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);
