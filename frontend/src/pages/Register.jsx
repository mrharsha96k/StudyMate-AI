import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl w-96">

        <h1 className="text-4xl font-bold text-blue-400 text-center">
          StudyMate AI
        </h1>

        <p className="text-gray-400 text-center mt-3">
          Create Your Account 🚀
        </p>

        <div className="mt-6">
          <label className="text-gray-300">Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-5">
          <label className="text-gray-300">Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-5">
          <label className="text-gray-300">Password</label>

          <input
            type="password"
            placeholder="Create password"
            className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
          />
        </div>

        <button className="w-full mt-8 bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold transition">
          Create Account
        </button>

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