import { useState, useEffect, useRef } from "react";
import { auth } from "../../firebase";
import {
  FaChevronDown,
  FaFilePdf,
  FaSearch,
} from "react-icons/fa";

const API_URL = "https://studymate-ai-backend-yq70.onrender.com";

function QuizGenerator() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loadingPdfs, setLoadingPdfs] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Custom PDF dropdown state
  const [pdfDropdownOpen, setPdfDropdownOpen] = useState(false);
  const [pdfSearch, setPdfSearch] = useState("");
  const pdfDropdownRef = useRef(null);

  const selectedPdfDetails = pdfs.find(
    (pdf) => String(pdf._id || pdf.id) === String(selectedPdf)
  );

  const filteredPdfs = pdfs.filter((pdf) =>
    (pdf.originalName || pdf.name || "Untitled PDF")
      .toLowerCase()
      .includes(pdfSearch.trim().toLowerCase())
  );

  // Load uploaded PDFs
  useEffect(() => {
    let cancelled = false;

    const fetchPdfs = async () => {
      try {
        setLoadingPdfs(true);
        setError("");

        const user = auth.currentUser;

        if (!user) {
          throw new Error("Please log in to view your uploaded PDFs.");
        }

        const idToken = await user.getIdToken();

        const response = await fetch(`${API_URL}/api/upload`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Failed to load PDFs.");
        }

        const files = Array.isArray(data)
          ? data
          : data.files || data.uploads || [];

        if (cancelled) return;

        setPdfs(files);

        setSelectedPdf((previous) => {
          const stillExists = files.some(
            (pdf) =>
              String(pdf._id || pdf.id) === String(previous)
          );

          if (previous && stillExists) return previous;

          return files.length
            ? String(files[0]._id || files[0].id)
            : "";
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load PDFs:", err);
          setError(`Could not load PDFs: ${err.message}`);
        }
      } finally {
        if (!cancelled) {
          setLoadingPdfs(false);
        }
      }
    };

    fetchPdfs();

    const handlePDFUpdate = () => {
      fetchPdfs();
    };

    window.addEventListener(
      "studymate-pdfs-updated",
      handlePDFUpdate
    );

    return () => {
      cancelled = true;
      window.removeEventListener(
        "studymate-pdfs-updated",
        handlePDFUpdate
      );
    };
  }, []);

  // Close PDF dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        pdfDropdownRef.current &&
        !pdfDropdownRef.current.contains(event.target)
      ) {
        setPdfDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Generate quiz from selected PDF
  const generateQuiz = async () => {
    if (!selectedPdf) {
      setError("Please select a PDF first.");
      return;
    }

    setGenerating(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please log in to generate a quiz.");
      }

      const idToken = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/ai/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fileId: selectedPdf,
          questionCount: Number(questionCount),
          difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Quiz generation failed.");
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("The AI returned no questions.");
      }

      setQuestions(data.questions);
    } catch (err) {
      console.error("Quiz generation error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  // Select an answer
  const selectAnswer = (questionIndex, optionIndex) => {
    if (submitted) return;

    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: optionIndex,
    }));
  };

  // Calculate score
  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  // Restart quiz
  const restartQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setError("");
  };

  const current = questions[currentQuestion];

  return (
    <div className="w-full min-w-0 px-0 py-4 text-white sm:py-6">
      <div className="mx-auto w-full min-w-0 max-w-5xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            StudyMate AI
          </p>

          <h2 className="text-2xl font-bold sm:text-4xl">
            AI Quiz Generator
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Turn your study PDFs into interactive quizzes and test
            your understanding with AI-generated questions.
          </p>
        </div>

        {/* Quiz Setup */}
        {questions.length === 0 && (
          <section className="w-full min-w-0 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl sm:rounded-3xl sm:p-8">
            <h2 className="text-xl font-semibold">
              Create your quiz
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Select a study document and customize your quiz.
            </p>

            {/* Custom PDF Selector */}
            <div className="mt-7 min-w-0">
              <label
                htmlFor="quiz-pdf"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Select study PDF
              </label>

              <div
                ref={pdfDropdownRef}
                className="relative w-full min-w-0"
              >
                <button
                  id="quiz-pdf"
                  type="button"
                  onClick={() => {
                    setPdfDropdownOpen((open) => !open);
                    setPdfSearch("");
                  }}
                  disabled={
                    loadingPdfs || generating || pdfs.length === 0
                  }
                  aria-expanded={pdfDropdownOpen}
                  aria-haspopup="listbox"
                  className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left text-white outline-none transition hover:border-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="min-w-0 flex-1 truncate text-sm sm:text-base">
                    {selectedPdfDetails?.originalName ||
                      selectedPdfDetails?.name ||
                      (loadingPdfs ? "Loading PDFs..." : "Choose a PDF")}
                  </span>

                  <FaChevronDown
                    className={`shrink-0 text-slate-400 transition-transform ${
                      pdfDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {pdfDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 w-full min-w-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                    {/* Search */}
                    <div className="border-b border-slate-700 p-2">
                      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3">
                        <FaSearch className="shrink-0 text-slate-500" />

                        <input
                          type="search"
                          value={pdfSearch}
                          onChange={(event) =>
                            setPdfSearch(event.target.value)
                          }
                          placeholder="Search PDFs..."
                          aria-label="Search uploaded PDFs"
                          className="w-full min-w-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Scrollable options */}
                    <div
                      role="listbox"
                      aria-label="Uploaded study PDFs"
                      className="max-h-56 overflow-y-auto overflow-x-hidden overscroll-contain p-1"
                    >
                      {filteredPdfs.map((pdf) => {
                        const id = String(pdf._id || pdf.id);
                        const name =
                          pdf.originalName || pdf.name || "Untitled PDF";
                        const isSelected = String(selectedPdf) === id;

                        return (
                          <button
                            key={id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSelectedPdf(id);
                              setPdfDropdownOpen(false);
                              setPdfSearch("");
                              setError("");
                            }}
                            className={`flex w-full min-w-0 items-start gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "text-slate-200 hover:bg-slate-800"
                            }`}
                          >
                            <FaFilePdf className="mt-1 shrink-0 text-blue-400" />

                            <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                              {name}
                            </span>
                          </button>
                        );
                      })}

                      {filteredPdfs.length === 0 && (
                        <p className="px-3 py-4 text-center text-sm text-slate-400">
                          No matching PDFs found.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!loadingPdfs && pdfs.length === 0 && (
                <p className="mt-2 text-sm text-amber-400">
                  No PDFs found. Upload a PDF using the Upload section first.
                </p>
              )}
            </div>

            {/* Difficulty Selection */}
            <div className="mt-6 min-w-0">
              <label
                htmlFor="quiz-difficulty"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Difficulty Level
              </label>

              <select
                id="quiz-difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                disabled={generating}
                className="w-full min-w-0 max-w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-500 disabled:opacity-50 sm:px-4 sm:text-base"
              >
                <option value="easy">🟢 Easy — Basic concepts</option>
                <option value="medium">
                  🟡 Medium — Understanding and application
                </option>
                <option value="hard">🔴 Hard — Advanced reasoning</option>
              </select>

              <p className="mt-2 text-sm text-slate-500">
                Choose the difficulty level that matches your preparation.
              </p>
            </div>

            {/* Question Count */}
            <div className="mt-6 min-w-0">
              <label
                htmlFor="question-count"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Number of questions
              </label>

              <select
                id="question-count"
                value={questionCount}
                onChange={(event) =>
                  setQuestionCount(Number(event.target.value))
                }
                disabled={generating}
                className="w-full min-w-0 max-w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-500 sm:px-4 sm:text-base"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mt-5 break-words rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              type="button"
              onClick={generateQuiz}
              disabled={
                loadingPdfs ||
                generating ||
                !selectedPdf ||
                pdfs.length === 0
              }
              className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? "Generating Your Quiz..." : "Generate AI Quiz"}
            </button>

            {generating && (
              <p className="mt-4 text-center text-sm text-slate-400">
                AI is analyzing your PDF and preparing questions.
                Please wait...
              </p>
            )}
          </section>
        )}

        {/* Quiz Questions */}
        {questions.length > 0 && !submitted && current && (
          <section className="w-full min-w-0 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:rounded-3xl sm:p-8">
            {/* Progress */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-400">
                  Question {currentQuestion + 1} of {questions.length}
                </span>

                <span className="font-medium text-blue-400">
                  {Math.round(
                    ((currentQuestion + 1) / questions.length) * 100
                  )}
                  %
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <h2 className="break-words text-xl font-semibold leading-relaxed sm:text-2xl">
              {current.question}
            </h2>

            {/* Answer Options */}
            <div className="mt-7 space-y-3">
              {current.options.map((option, optionIndex) => {
                const isSelected =
                  answers[currentQuestion] === optionIndex;

                return (
                  <button
                    key={`${currentQuestion}-${optionIndex}`}
                    type="button"
                    onClick={() =>
                      selectAnswer(currentQuestion, optionIndex)
                    }
                    className={`flex w-full min-w-0 items-start gap-3 rounded-xl border p-3 text-left transition sm:gap-4 sm:p-4 ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-950/50 hover:border-slate-500"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {["A", "B", "C", "D"][optionIndex]}
                    </span>

                    <span className="min-w-0 flex-1 break-words pt-1 text-sm leading-relaxed text-slate-200 sm:text-base">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setCurrentQuestion((previous) => previous - 1)
                }
                disabled={currentQuestion === 0}
                className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestion((previous) => previous + 1)
                  }
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  disabled={
                    Object.keys(answers).length !== questions.length
                  }
                  className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit Quiz
                </button>
              )}
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Answer every question to submit your quiz.
            </p>
          </section>
        )}

        {/* Quiz Results */}
        {submitted && (
          <section className="w-full min-w-0 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:rounded-3xl sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-3xl">
                🏆
              </div>

              <h2 className="mt-5 text-3xl font-bold">
                Quiz Completed!
              </h2>

              <p className="mt-3 text-slate-400">
                Here is your performance summary.
              </p>

              <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-slate-700 bg-slate-950 p-6">
                <p className="text-sm text-slate-400">Your Score</p>

                <p className="mt-2 text-5xl font-bold text-emerald-400">
                  {calculateScore()}
                  <span className="text-2xl text-slate-500">
                    /{questions.length}
                  </span>
                </p>

                <p className="mt-3 text-lg font-semibold text-white">
                  {Math.round(
                    (calculateScore() / questions.length) * 100
                  )}
                  % Accuracy
                </p>
              </div>
            </div>

            {/* Answer Review */}
            <div className="mt-10 space-y-5">
              <h3 className="text-xl font-semibold">
                Review Your Answers
              </h3>

              {questions.map((question, index) => {
                const isCorrect =
                  answers[index] === question.correctAnswer;

                return (
                  <div
                    key={index}
                    className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4 className="min-w-0 flex-1 break-words font-semibold leading-relaxed">
                        {index + 1}. {question.question}
                      </h4>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          isCorrect
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <p className="mt-4 break-words text-sm text-slate-400">
                      Your answer:{" "}
                      <span className="text-slate-200">
                        {answers[index] !== undefined
                          ? question.options[answers[index]]
                          : "Not answered"}
                      </span>
                    </p>

                    {!isCorrect && (
                      <p className="mt-2 break-words text-sm text-emerald-400">
                        Correct answer:{" "}
                        {question.options[question.correctAnswer]}
                      </p>
                    )}

                    {question.explanation && (
                      <div className="mt-4 rounded-xl bg-slate-900 p-4">
                        <p className="text-sm font-semibold text-blue-400">
                          Explanation
                        </p>

                        <p className="mt-2 break-words text-sm leading-relaxed text-slate-300">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Restart */}
            <button
              type="button"
              onClick={restartQuiz}
              className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-500"
            >
              Create Another Quiz
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default QuizGenerator;
