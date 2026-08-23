import { FaBrain } from "react-icons/fa";
import QuizSettings from "./QuizSettings";
import Button from "../Common/Button";

function QuizGenerator() {
  return (
    <div className="bg-slate-900 rounded-3xl p-10 border border-slate-700">

      <div className="flex items-center gap-3 mb-4">
        <FaBrain className="text-3xl text-blue-500" />
        <h2 className="text-3xl font-bold text-white">
          AI Quiz Generator
        </h2>
      </div>

      <p className="text-gray-400 mb-8">
        Generate AI-powered MCQs from your uploaded study material.
      </p>

      <QuizSettings />

      <div className="mt-8">
        <Button className="w-full">
          Generate Quiz
        </Button>
      </div>

    </div>
  );
}

export default QuizGenerator;