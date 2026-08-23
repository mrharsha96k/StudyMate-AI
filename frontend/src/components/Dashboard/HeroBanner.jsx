function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl">

      <h1 className="text-4xl font-bold text-white">
        👋 Welcome Back,
      </h1>

      <p className="text-blue-100 mt-3 text-lg">
        Continue your learning journey with StudyMate AI.
      </p>

      <div className="flex gap-4 mt-8">

        <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
          Upload Notes
        </button>

        <button className="bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-900 transition">
          Start AI Chat
        </button>

      </div>

    </div>
  );
}

export default HeroBanner;