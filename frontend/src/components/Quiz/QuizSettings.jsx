import { useEffect, useState } from "react";

const API_URL = "https://studymate-ai-backend-yq70.onrender.com";

function QuizSettings({
  selectedPdf,
  setSelectedPdf,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount,
  disabled = false,
}) {
  const [pdfs, setPdfs] = useState([]);
  const [loadingPdfs, setLoadingPdfs] = useState(true);
  const [error, setError] = useState("");

  // Load uploaded PDFs from the backend
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setError("");

        const response = await fetch(`${API_URL}/api/upload`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load PDFs.");
        }

        const files = Array.isArray(data)
          ? data
          : data.files || data.uploads || [];

        setPdfs(files);

        // Automatically select the first available PDF
        if (files.length > 0) {
          const firstPdf = files[0]._id || files[0].id;

          setSelectedPdf((previous) => previous || firstPdf || "");
        }
      } catch (err) {
        setError(err.message || "Unable to load uploaded PDFs.");
      } finally {
        setLoadingPdfs(false);
      }
    };

    fetchPdfs();
  }, [setSelectedPdf]);

  return (
    <div className="space-y-6">
      {/* PDF Selection */}
      <div>
        <label
          htmlFor="quiz-pdf"
          className="mb-2 block font-medium text-white"
        >
          Select PDF
        </label>

        <select
          id="quiz-pdf"
          value={selectedPdf}
          onChange={(event) => setSelectedPdf(event.target.value)}
          disabled={disabled || loadingPdfs}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-blue-500 disabled:opacity-50"
        >
          <option value="">
            {loadingPdfs ? "Loading PDFs..." : "Choose a PDF"}
          </option>

          {pdfs.map((pdf) => {
            const id = pdf._id || pdf.id;

            return (
              <option key={id} value={id}>
                {pdf.originalName || pdf.name || "Untitled PDF"}
              </option>
            );
          })}
        </select>

        {!loadingPdfs && pdfs.length === 0 && !error && (
          <p className="mt-2 text-sm text-amber-400">
            No PDFs found. Upload a PDF first.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {/* Difficulty Selection */}
      <div>
        <label
          htmlFor="quiz-difficulty"
          className="mb-2 block font-medium text-white"
        >
          Difficulty
        </label>

        <select
          id="quiz-difficulty"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-blue-500 disabled:opacity-50"
        >
          <option value="easy">🟢 Easy</option>
          <option value="medium">🟡 Medium</option>
          <option value="hard">🔴 Hard</option>
        </select>

        <p className="mt-2 text-sm text-slate-400">
          {difficulty === "easy" &&
            "Test fundamental concepts, definitions, and basic facts."}

          {difficulty === "medium" &&
            "Test understanding, relationships, and applications."}

          {difficulty === "hard" &&
            "Test deeper reasoning and complex applications."}
        </p>
      </div>

      {/* Number of Questions */}
      <div>
        <label
          htmlFor="quiz-question-count"
          className="mb-2 block font-medium text-white"
        >
          Number of Questions
        </label>

        <select
          id="quiz-question-count"
          value={questionCount}
          onChange={(event) =>
            setQuestionCount(Number(event.target.value))
          }
          disabled={disabled}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none transition focus:border-blue-500 disabled:opacity-50"
        >
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
          <option value={15}>15 Questions</option>
        </select>

        <p className="mt-2 text-sm text-slate-400">
          Choose between 5 and 15 questions for each quiz.
        </p>
      </div>
    </div>
  );
}

export default QuizSettings;