import OptionCard from "./OptionCard";

function QuestionCard() {
  const options = [
    "Application Software",
    "Operating System",
    "Compiler",
    "Database",
  ];

  return (
    <div className="mt-10 bg-slate-900 border border-slate-700 rounded-3xl p-8">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Question 1
        </h2>

        <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
          1 / 10
        </span>
      </div>

      <p className="text-lg text-gray-300 mb-8">
        Which software acts as an interface between the user and computer hardware?
      </p>

      <div className="space-y-4">
        {options.map((option, index) => (
          <OptionCard
            key={index}
            option={option}
          />
        ))}
      </div>

    </div>
  );
}

export default QuestionCard;