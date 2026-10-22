import { useCallback, useEffect, useRef, useState } from "react";
import { auth } from "../../firebase";
import {
  FaChevronDown,
  FaFilePdf,
  FaSearch,
} from "react-icons/fa";

const API_URL = "https://studymate-ai-backend-yq70.onrender.com";

function PdfSelector({ selectedPdf, setSelectedPdf }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectorRef = useRef(null);

  const selectedFile = pdfs.find(
    (pdf) => pdf.id === selectedPdf
  );

  const filteredPdfs = pdfs.filter((pdf) =>
    (pdf.originalName || "Untitled PDF")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const fetchPDFs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setPdfs([]);
        setSelectedPdf("");
        setError("Please log in to view your uploaded PDFs.");
        return;
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        throw new Error(
          "Authentication failed. Please log in again."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load PDFs.");
      }

      const files = data.files || [];
      setPdfs(files);

      // Clear selection if the selected PDF no longer exists.
      if (
        selectedPdf &&
        !files.some((pdf) => pdf.id === selectedPdf)
      ) {
        setSelectedPdf("");
      }
    } catch (err) {
      console.error("Failed to load PDFs:", err);
      setError(err.message || "Could not load your PDFs.");
    } finally {
      setLoading(false);
    }
  }, [selectedPdf, setSelectedPdf]);

  useEffect(() => {
    fetchPDFs();

    const handlePDFUpdate = () => {
      fetchPDFs();
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
  }, [fetchPDFs]);

  // Close the menu when the user clicks outside it.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const choosePdf = (pdfId) => {
    setSelectedPdf(pdfId);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="mt-6 w-full min-w-0 sm:mt-8">
      <label
        className="mb-3 block text-sm font-semibold text-gray-300"
        id="smart-notes-pdf-label"
      >
        Choose your study material
      </label>

      <div ref={selectorRef} className="relative w-full min-w-0">
        <button
          type="button"
          onClick={() => {
            setIsOpen((open) => !open);
            setSearch("");
          }}
          disabled={loading || pdfs.length === 0}
          aria-labelledby="smart-notes-pdf-label"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="
            flex w-full min-w-0 items-center justify-between gap-3
            rounded-xl border border-slate-700 bg-slate-800
            px-4 py-3 text-left text-white outline-none
            transition hover:border-blue-500 focus:border-blue-500
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          <span className="min-w-0 flex-1 truncate text-sm sm:text-base">
            {selectedFile?.originalName ||
              (loading ? "Loading PDFs..." : "Select an uploaded PDF")}
          </span>

          <FaChevronDown
            className={`shrink-0 text-sm text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 w-full min-w-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
            {/* Search box */}
            <div className="border-b border-slate-700 p-2">
              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3">
                <FaSearch className="shrink-0 text-slate-500" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search uploaded PDFs..."
                  aria-label="Search uploaded PDFs"
                  className="w-full min-w-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Scrollable PDF list */}
            <div
              role="listbox"
              aria-label="Uploaded study PDFs"
              className="max-h-56 overflow-y-auto overflow-x-hidden overscroll-contain p-1"
            >
              {filteredPdfs.map((pdf) => (
                <button
                  key={pdf.id}
                  type="button"
                  role="option"
                  aria-selected={selectedPdf === pdf.id}
                  onClick={() => choosePdf(pdf.id)}
                  className={`flex w-full min-w-0 items-start gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                    selectedPdf === pdf.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <FaFilePdf className="mt-1 shrink-0 text-blue-400" />

                  <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                    {pdf.originalName || "Untitled PDF"}
                  </span>
                </button>
              ))}

              {filteredPdfs.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-slate-400">
                  No matching PDFs found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <p className="mt-3 text-sm text-blue-400">
          Loading your uploaded PDFs...
        </p>
      )}

      {error && (
        <p className="mt-3 break-words text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && pdfs.length === 0 && (
        <p className="mt-3 text-sm text-yellow-400">
          No uploaded PDFs found. Upload a PDF first.
        </p>
      )}
    </div>
  );
}

export default PdfSelector;
