import { FaStickyNote } from "react-icons/fa";
import PageHeader from "../components/Layout/PageHeader";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";

import NotesGenerator from "../components/SmartNotes/NotesGenerator";
import NotesPreview from "../components/SmartNotes/NotesPreview";

function SmartNotes() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">

          <PageHeader
            title="Smart Notes"
            description="Generate AI summaries from your uploaded study material."
            icon={<FaStickyNote />}
          />

          <NotesGenerator />

          <NotesPreview />

        </div>
      </div>
    </div>
  );
}

export default SmartNotes;