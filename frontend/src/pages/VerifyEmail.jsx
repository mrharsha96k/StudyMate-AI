import { useEffect, useState } from "react";
import {
  applyActionCode,
  checkActionCode,
  reload,
} from "firebase/auth";
import { Link, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Checking your email verification link..."
  );

  useEffect(() => {
    let cancelled = false;

    async function verifyEmail() {
      const mode = searchParams.get("mode");
      const oobCode = searchParams.get("oobCode");

      // Firebase email verification link.
      if (mode === "verifyEmail" && oobCode) {
        try {
          await checkActionCode(auth, oobCode);
          await applyActionCode(auth, oobCode);

          if (!cancelled) {
            setStatus("success");
            setMessage(
              "Your email has been verified successfully! You can now log in."
            );
          }
        } catch (error) {
          console.error("Firebase email verification error:", error);

          if (!cancelled) {
            setStatus("error");
            setMessage(
              "This verification link is invalid, expired, or has already been used. Try logging in or request a new verification email."
            );
          }
        }

        return;
      }

      // If the user returns to this page manually, check their
      // currently signed-in Firebase account.
      try {
        if (auth.currentUser) {
          await reload(auth.currentUser);

          if (auth.currentUser.emailVerified) {
            if (!cancelled) {
              setStatus("success");
              setMessage(
                "Your email is verified! You can now log in."
              );
            }
            return;
          }
        }

        if (!cancelled) {
          setStatus("error");
          setMessage(
            "Open the verification link from your email. If it has expired, log in and request another verification email."
          );
        }
      } catch (error) {
        console.error("Unable to check verification status:", error);

        if (!cancelled) {
          setStatus("error");
          setMessage(
            "Unable to check verification status. Please try again."
          );
        }
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-400">
          StudyMate AI
        </h1>

        <h2 className="text-xl font-semibold text-white mt-6">
          Email Verification
        </h2>

        <p
          role="status"
          className={`mt-4 text-sm ${
            status === "error"
              ? "text-red-400"
              : status === "success"
              ? "text-green-400"
              : "text-gray-300"
          }`}
        >
          {message}
        </p>

        {status === "verifying" && (
          <p className="text-gray-400 text-sm mt-3">
            Please wait...
          </p>
        )}

        {status === "success" && (
          <Link
            to="/login"
            className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-lg font-semibold text-white transition"
          >
            Go to Login
          </Link>
        )}

        {status === "error" && (
          <Link
            to="/login"
            className="inline-block mt-6 text-blue-400 hover:underline"
          >
            Return to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
