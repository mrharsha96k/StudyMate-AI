import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-400">
          StudyMate AI
        </h1>

        <p className="text-gray-400 mt-4 text-xl">
          AI-Powered Smart Learning Assistant
        </p>

        <Link to="/login">
          <button className="mt-8 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;