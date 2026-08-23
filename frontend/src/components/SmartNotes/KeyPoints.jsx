function KeyPoints() {
  const points = [
    "Important concept 1",
    "Important concept 2",
    "Important concept 3",
    "Important concept 4",
    "Important concept 5",
  ];

  return (
    <div className="bg-slate-800 rounded-2xl p-6">

      <h3 className="text-2xl font-bold text-blue-400 mb-4">
        ⭐ Key Points
      </h3>

      <ul className="space-y-3">
        {points.map((point, index) => (
          <li
            key={index}
            className="text-gray-300 flex items-center gap-3"
          >
            <span className="text-blue-400">•</span>
            {point}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default KeyPoints;