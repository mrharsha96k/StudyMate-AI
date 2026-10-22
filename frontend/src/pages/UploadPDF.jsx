import { useCallback, useEffect, useState } from "react";
import AppLayout from "../components/Layout/AppLayout";
import PageHeader from "../components/Layout/PageHeader";
import { FaFileUpload } from "react-icons/fa";
import { auth } from "../firebase";

import UploadBox from "../components/UploadPDF/UploadBox";
import PDFCard from "../components/UploadPDF/PDFCard";

const API_URL = "http://localhost:5000";

function UploadPDF() {
  const [uploadedPDFs, setUploadedPDFs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPDFs = useCallback(async () => {
    try {
      setErrorMessage("");

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setUploadedPDFs([]);
        setErrorMessage("Please log in to view your uploaded PDFs.");
        return;
      }

      // Get a Firebase ID token for the authenticated user.
      const idToken = await currentUser.getIdToken();

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.status === 401) {
        throw new Error(
          "Authentication failed. Please log in again."
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch uploaded PDFs.");
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.files)) {
        throw new Error("Invalid PDF list returned by the server.");
      }

      setUploadedPDFs(
        result.files.map((pdf) => ({
          id: pdf.id,
          name: pdf.originalName,
          size: pdf.size,
          uploadedAt: pdf.uploadedAt,
        }))
      );
    } catch (error) {
      console.error("Unable to load uploaded PDFs:", error);
      setErrorMessage(error.message || "Unable to load your PDFs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPDFs();

    // Refresh the list after a successful upload.
    const handlePDFUpdate = () => {
      loadPDFs();
    };

    window.addEventListener(
      "studymate-pdfs-updated",
      handlePDFUpdate
    );

    return () => {
      window.removeEventListener(
        "studymate-pdfs-updated",
        handlePDFUpdate
      );
    };
  }, [loadPDFs]);

  const formatSize = (bytes) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <AppLayout>
      <PageHeader
        title="Upload Study Material"
        description="Upload your PDFs and organize your study materials."
        icon={<FaFileUpload />}
      />

      <UploadBox />

      <div className="mt-8 space-y-4">
        {isLoading && (
          <p className="text-gray-400">
            Loading your uploaded PDFs...
          </p>
        )}

        {!isLoading && errorMessage && (
          <p className="text-red-400" role="alert">
            {errorMessage}
          </p>
        )}

        {!isLoading &&
          !errorMessage &&
          uploadedPDFs.map((pdf) => (
            <PDFCard
              key={pdf.id}
              name={pdf.name}
              size={formatSize(pdf.size)}
            />
          ))}

        {!isLoading &&
          !errorMessage &&
          uploadedPDFs.length === 0 && (
            <p className="text-gray-400">
              Your uploaded PDFs will appear here.
            </p>
          )}
      </div>
    </AppLayout>
  );
}

export default UploadPDF;
