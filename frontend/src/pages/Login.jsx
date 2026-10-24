import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      await credential.user.reload();

      if (!credential.user.emailVerified) {
        try {
          await sendEmailVerification(credential.user);
        } catch (emailError) {
          console.error("Verification email error:", emailError);
        }

        await signOut(auth);

        setError(
          "Please verify your email before logging in. Check your inbox and spam folder. We attempted to send a verification email."
        );
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Incorrect email or password.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;

        case "auth/network-request-failed":
          setError("Network error. Check your internet connection.");
          break;

        default:
          console.error("Login error:", err);
          setError("Unable to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-400 text-center">
          StudyMate AI
        </h1>

        <p className="text-gray-400 text-center mt-3">
          Welcome Back 👋
        </p>

        <form onSubmit={handleLogin}>
          <div className="mt-8">
            <label
              htmlFor="email"
              className="text-gray-300"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500"
              required
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="password"
              className="text-gray-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-lg font-semibold text-white transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="text-blue-400 ml-2 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

