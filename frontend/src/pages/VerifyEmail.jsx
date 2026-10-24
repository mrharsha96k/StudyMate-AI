
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = "https://studymate-ai-backend-yq70.onrender.com";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your email address..."
  );

  useEffect(() => {
    let cancelled = false;

    async function verifyEmail() {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("This verification link is invalid or incomplete.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/register/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Email verification failed."
          );
        }

        if (!cancelled) {
          setStatus("success");
          setMessage(
            "Your email has been verified and your account has been created. You can now log in."
          );
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(
            error.message || "Unable to verify your email. Please try again."
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
            to="/register"
            className="inline-block mt-6 text-blue-400 hover:underline"
          >
            Return to Sign Up
          </Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
