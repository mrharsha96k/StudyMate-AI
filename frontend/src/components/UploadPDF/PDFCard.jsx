function PDFCard({ name, size }) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <h3 className="min-w-0 break-words [overflow-wrap:anywhere] text-sm font-semibold leading-relaxed text-blue-400 sm:text-base">
        {name}
      </h3>

      <p className="mt-2 text-sm text-gray-400 sm:text-base">
        {size}
      </p>
    </div>
  );
}

export default PDFCard;
