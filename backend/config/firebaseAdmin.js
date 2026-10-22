import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

// Initialize Firebase Admin only once.
const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

// Export Firebase Authentication for backend token verification.
export const firebaseAuth = getAuth(firebaseApp);

export default firebaseApp;
