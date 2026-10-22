function SummaryCard({ summary }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">
        📖 Chapter Summary
      </h3>

      {summary ? (
        <p className="text-gray-300 leading-8 whitespace-pre-wrap">
          {summary}
        </p>
      ) : (
        <p className="text-gray-400 leading-8">
          Your AI-generated chapter summary will appear here after you
          generate Smart Notes from the selected PDF.
        </p>
      )}
    </div>
  );
}

export default SummaryCard;