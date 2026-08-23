import Button from "../Common/Button";

function QuizNavigation() {
  return (
    <div className="mt-8 flex items-center justify-between">

      <Button className="bg-slate-700 hover:bg-slate-600">
        ← Previous
      </Button>

      <div className="text-gray-400 font-medium">
        Question <span className="text-blue-400">1</span> of <span className="text-blue-400">10</span>
      </div>

      <Button>
        Next →
      </Button>

    </div>
  );
}

export default QuizNavigation;