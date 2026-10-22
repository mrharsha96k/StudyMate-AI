import AppLayout from "../components/Layout/AppLayout";
import PageHeader from "../components/Layout/PageHeader";
import { FaBrain } from "react-icons/fa";
import QuizGenerator from "../components/Quiz/QuizGenerator";

function Quiz() {
  return (
    <AppLayout>
      <main className="min-w-0 w-full">
        <PageHeader
          title="AI Quiz Generator"
          description="Generate AI-powered quizzes from your uploaded study material."
          icon={<FaBrain />}
        />

        <div className="min-w-0 w-full">
          <QuizGenerator />
        </div>
      </main>
    </AppLayout>
  );
}

export default Quiz;
