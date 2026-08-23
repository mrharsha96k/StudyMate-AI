function PDFCard({ name, size }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <h3 className="text-blue-400 font-semibold">{name}</h3>
      <p className="text-gray-400 mt-2">{size}</p>
    </div>
  );
}

export default PDFCard;