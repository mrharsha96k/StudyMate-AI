function StatCard({ title, value }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 hover:bg-slate-800 transition">
      <h3 className="text-gray-400 text-sm">{title}</h3>

      <h2 className="text-3xl font-bold text-blue-400 mt-2">
        {value}
      </h2>
    </div>
  );
}

export default StatCard;