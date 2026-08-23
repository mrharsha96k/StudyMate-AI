function DashboardCard({ title, description }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-lg hover:scale-105 hover:bg-slate-800 transition duration-300 cursor-pointer">

      <h2 className="text-2xl font-bold text-blue-400">
        {title}
      </h2>

      <p className="text-gray-400 mt-3">
        {description}
      </p>

    </div>
  );
}

export default DashboardCard;