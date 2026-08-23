function SummaryCard() {
  return (
    <div className="bg-slate-800 rounded-2xl p-6">

      <h3 className="text-2xl font-bold text-blue-400 mb-4">
        📖 Chapter Summary
      </h3>

      <p className="text-gray-300 leading-8">
        Your AI-generated chapter summary will appear here after you
        generate Smart Notes from the selected PDF.

        This section will contain a simplified explanation of the
        complete chapter for quick understanding.
      </p>

    </div>
  );
}

export default SummaryCard;