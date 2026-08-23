function OptionCard({ option }) {
  return (
    <button
      className="
        w-full
        text-left
        bg-slate-800
        hover:bg-blue-600
        border
        border-slate-700
        hover:border-blue-500
        rounded-2xl
        p-5
        transition
        duration-300
      "
    >
      {option}
    </button>
  );
}

export default OptionCard;