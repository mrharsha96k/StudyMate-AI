import SummaryCard from "./SummaryCard";
import KeyPoints from "./KeyPoints";
import RevisionCard from "./RevisionCard";

function NotesPreview() {
  return (
    <div className="mt-10">

      <h2 className="text-3xl font-bold text-white mb-6">
        AI Generated Notes
      </h2>

      <div className="space-y-6">

        <SummaryCard />

        <KeyPoints />

        <RevisionCard />

      </div>

    </div>
  );
}

export default NotesPreview;