import { FaTrophy, FaRedo } from "react-icons/fa";
import Button from "../Common/Button";

function QuizResult() {
  return (
    <div className="mt-10 bg-slate-900 border border-slate-700 rounded-3xl p-10 text-center">

      <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-6" />

      <h2 className="text-3xl font-bold text-white">
        Quiz Completed!
      </h2>

      <p className="text-gray-400 mt-3">
        Great job! Here is your performance.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-10">

        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-gray-400">Score</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">
            8 / 10
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-gray-400">Accuracy</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            80%
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-gray-400">Time</h3>
          <p className="text-3xl font-bold text-orange-400 mt-2">
            12 min
          </p>
        </div>

      </div>

      <div className="mt-10">
        <Button className="flex items-center gap-2 mx-auto">
          <FaRedo />
          Retry Quiz
        </Button>
      </div>

    </div>
  );
}

export default QuizResult;