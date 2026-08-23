import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import PageHeader from "../components/Layout/PageHeader";

import { FaBrain } from "react-icons/fa";

import QuizGenerator from "../components/Quiz/QuizGenerator";
import QuestionCard from "../components/Quiz/QuestionCard";
import QuizNavigation from "../components/Quiz/QuizNavigation";
import QuizResult from "../components/Quiz/QuizResult";

function Quiz() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">

          <PageHeader
            title="AI Quiz Generator"
            description="Generate AI-powered quizzes from your uploaded study material."
            icon={<FaBrain />}
          />

          <QuizGenerator />

          <QuestionCard />

          <QuizNavigation />

          <QuizResult />

        </div>
      </div>
    </div>
  );
}

export default Quiz;