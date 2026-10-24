import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const name = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    let createdUser = null;

    try {
      setLoading(true);

      const credential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      createdUser = credential.user;

      await updateProfile(createdUser, {
        displayName: name,
      });

      await sendEmailVerification(createdUser);

      // Leave no signed-in session while the email is unverified.
      await signOut(auth);

      setPassword("");
      setMessage(
        "Verification email sent! Check your inbox and spam folder, then click the link before logging in."
      );
    } catch (err) {
      console.error("Registration error:", err);

      if (createdUser && !createdUser.emailVerified) {
        try {
          await signOut(auth);
        } catch {
          // Keep the original registration error.
        }
      }

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Please log in.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Please choose a stronger password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError(
            "Registration or email delivery failed. If the account was created, try logging in to check or resend verification."
          );
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
          Create Your Account 🚀
        </p>

        <form onSubmit={handleRegister}>
          <div className="mt-6">
            <label htmlFor="fullName" className="text-gray-300">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mt-5">
            <label htmlFor="email" className="text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mt-5">
            <label htmlFor="password" className="text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password (minimum 6 characters)"
              className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="mt-4 text-sm text-green-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-lg font-semibold text-white transition"
          >
            {loading ? "Sending Verification..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-400 ml-2 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;