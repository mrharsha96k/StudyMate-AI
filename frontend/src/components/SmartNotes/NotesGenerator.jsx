import PdfSelector from "./PdfSelector";

function NotesGenerator({
  selectedPdf,
  setSelectedPdf,
  onGenerate,
  loading,
}) {
  return (
    <div className="bg-slate-900 rounded-3xl p-10 border border-slate-700">
      <h2 className="text-3xl font-bold text-white">
        AI Note Generator
      </h2>

      <p className="text-gray-400 mt-2">
        Select one of your uploaded PDFs and generate clean,
        easy-to-understand notes.
      </p>

      <PdfSelector
        selectedPdf={selectedPdf}
        setSelectedPdf={setSelectedPdf}
      />

      <button
        type="button"
        onClick={onGenerate}
        disabled={loading || !selectedPdf}
        className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-semibold transition"
      >
        {loading ? "Generating Notes..." : "Generate Smart Notes"}
      </button>
    </div>
  );
}

export default NotesGenerator;