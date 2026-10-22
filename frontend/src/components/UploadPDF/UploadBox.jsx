import { useState } from "react";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";
import { auth } from "../../firebase";

const API_URL = "https://studymate-ai-backend-yq70.onrender.com";

function UploadBox() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMessage("");

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setSelectedFile(null);
      setMessage("Please select a valid PDF file.");
      e.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setSelectedFile(null);
      setMessage("PDF size must be 20 MB or less.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a PDF first.");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      setMessage("Please log in before uploading a PDF.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      // Get a Firebase ID token for the signed-in user.
      const idToken = await currentUser.getIdToken();

      const formData = new FormData();

      // Must match upload.single("pdf") in the backend.
      formData.append("pdf", selectedFile);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "PDF upload failed.");
      }

      setMessage(result.message || "PDF uploaded successfully!");
      setSelectedFile(null);

      const input = document.getElementById("studymate-pdf-input");

      if (input) {
        input.value = "";
      }

      // Notify other components that a PDF was uploaded.
      window.dispatchEvent(
        new CustomEvent("studymate-pdfs-updated", {
          detail: result.file,
        })
      );
    } catch (error) {
      console.error("PDF upload error:", error);

      setMessage(
        error.message ||
          "Unable to upload PDF. Check whether the backend is running."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-blue-500 rounded-3xl p-12 text-center bg-slate-900 hover:bg-slate-800 transition">
      <FaCloudUploadAlt className="text-6xl text-blue-400 mx-auto mb-6" />

      <h2 className="text-2xl font-bold text-white">
        Drag & Drop PDF Here
      </h2>

      <p className="text-gray-400 mt-3">
        or click to browse your files
      </p>

      <label className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold cursor-pointer transition">
        Choose PDF

        <input
          id="studymate-pdf-input"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      {selectedFile && (
        <div className="mt-8 bg-slate-800 rounded-2xl p-6 max-w-md mx-auto">
          <div className="flex flex-col items-center text-center gap-3">
            <FaFilePdf className="text-red-500 text-5xl" />

            <div>
              <h3 className="text-white font-semibold break-all">
                {selectedFile.name}
              </h3>

              <p className="text-gray-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              <p className="text-green-400 mt-2">
                ✅ Ready to Upload
              </p>

              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition text-white"
              >
                {isUploading ? "Uploading..." : "Upload PDF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <p
          className="mt-5 text-white"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadBox;
