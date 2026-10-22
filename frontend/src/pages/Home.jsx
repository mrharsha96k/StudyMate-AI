
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] items-center justify-center overflow-x-hidden bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto w-full max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-400 sm:text-6xl md:text-7xl lg:text-8xl">
          StudyMate AI
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400 sm:mt-5 sm:text-xl md:text-2xl">
          AI-Powered Smart Learning Assistant
        </p>

        <Link
          to="/login"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:mt-9"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Home;
