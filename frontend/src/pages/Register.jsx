
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://studymate-ai-backend-yq70.onrender.com";

function Register() {
  const navigate = useNavigate();

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

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/register/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to start registration.");
      }

      setMessage(
        data.message ||
          "Verification email sent. Check your inbox to complete registration."
      );

    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
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
