
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

    const idToken = authHeader.split(" ")[1];

    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: "Missing authentication token.",
      });
    }

    const decodedToken = await firebaseAuth.verifyIdToken(idToken);

    // UID comes from the verified Firebase token, never from client input.
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
    };

    next();
  } catch (error) {
    console.error("Authentication verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token. Please log in again.",
    });
  }
};
