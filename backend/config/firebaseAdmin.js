
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFile } from "node:fs/promises";

const getServiceAccount = async () => {
  if (process.env.NODE_ENV === "production") {
    const content = await readFile(
      "/etc/secrets/serviceAccountKey.json",
      "utf8"
    );

    return JSON.parse(content);
  }

  const { default: serviceAccount } = await import(
    "./serviceAccountKey.json",
    { with: { type: "json" } }
  );

  return serviceAccount;
};

const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(await getServiceAccount()),
      })
    : getApps()[0];

export const firebaseAuth = getAuth(firebaseApp);
export default firebaseApp;
