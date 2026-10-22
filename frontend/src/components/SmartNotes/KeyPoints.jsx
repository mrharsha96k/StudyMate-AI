function KeyPoints({ points = [] }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">
        ⭐ Key Points
      </h3>

      {points.length > 0 ? (
        <ul className="space-y-3">
          {points.map((point, index) => (
            <li
              key={index}
              className="text-gray-300 flex items-start gap-3 leading-7"
            >
              <span className="text-blue-400 mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">
          Important concepts from your PDF will appear here after generating
          Smart Notes.
        </p>
      )}
    </div>
  );
}

export default KeyPoints;