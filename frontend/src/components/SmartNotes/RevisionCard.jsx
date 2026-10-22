function RevisionCard({ questions = [] }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">
        ⚡ Quick Revision
      </h3>

      {questions.length > 0 ? (
        <ol className="space-y-4">
          {questions.map((question, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-300 leading-7"
            >
              <span className="flex-shrink-0 text-blue-400 font-bold">
                {index + 1}.
              </span>

              <span>{question}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-400 leading-8">
          Revision questions generated from your selected PDF will appear here.
        </p>
      )}
    </div>
  );
}

export default RevisionCard;