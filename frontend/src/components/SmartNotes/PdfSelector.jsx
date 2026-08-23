function PdfSelector() {
  return (
    <div className="mt-8">

      <select
        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
      >
        <option>Select Uploaded PDF</option>
        <option>Operating System.pdf</option>
        <option>Java Notes.pdf</option>
        <option>DBMS.pdf</option>
      </select>

    </div>
  );
}

export default PdfSelector;