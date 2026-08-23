function QuizSettings() {
  return (
    <div className="space-y-6">

      {/* PDF Selection */}
      <div>
        <label className="block text-white font-medium mb-2">
          Select PDF
        </label>

        <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white">
          <option>Operating System.pdf</option>
          <option>Java Notes.pdf</option>
          <option>DBMS.pdf</option>
        </select>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-white font-medium mb-2">
          Difficulty
        </label>

        <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {/* Number of Questions */}
      <div>
        <label className="block text-white font-medium mb-2">
          Number of Questions
        </label>

        <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white">
          <option>5 Questions</option>
          <option>10 Questions</option>
          <option>20 Questions</option>
          <option>30 Questions</option>
        </select>
      </div>

    </div>
  );
}

export default QuizSettings;
