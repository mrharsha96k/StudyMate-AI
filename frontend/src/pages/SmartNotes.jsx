import { useState } from "react";
import { FaStickyNote } from "react-icons/fa";
import { auth } from "../firebase";

import PageHeader from "../components/Layout/PageHeader";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";

import NotesGenerator from "../components/SmartNotes/NotesGenerator";
import NotesPreview from "../components/SmartNotes/NotesPreview";

const API_URL = "https://studymate-ai-backend-yq70.onrender.com/api/ai/notes";

function SmartNotes() {
  const [selectedPdf, setSelectedPdf] = useState("");
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateNotes = async () => {
    if (!selectedPdf) {
      setError("Please select a PDF first.");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError("Please log in to generate Smart Notes.");
      return;
    }

    setLoading(true);
    setError("");
    setNotes(null);

    try {
      // Get the Firebase ID token for the signed-in user.
      const idToken = await currentUser.getIdToken();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fileId: selectedPdf,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to generate Smart Notes."
        );
      }

      setNotes(data.notes);
    } catch (err) {
      console.error("Smart Notes error:", err);

      setError(
        err.message || "Something went wrong while generating notes."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-w-0 p-4 sm:p-8">
          <PageHeader
            title="Smart Notes"
            description="Generate AI summaries from your uploaded study material."
            icon={<FaStickyNote />}
          />

          <NotesGenerator
            selectedPdf={selectedPdf}
            setSelectedPdf={(id) => {
              setSelectedPdf(id);
              setNotes(null);
              setError("");
            }}
            onGenerate={generateNotes}
            loading={loading}
          />

          {error && (
            <div
              className="mt-5 rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-8 text-center text-blue-300" role="status">
              Generating your Smart Notes... Please wait.
            </div>
          )}

          <NotesPreview notes={notes} />
        </div>
      </div>
    </div>
  );
}

export default SmartNotes;