import { useState, useRef, useEffect } from "react";
import AppLayout from "../components/Layout/AppLayout";
import PageHeader from "../components/Layout/PageHeader";
import ChatInput from "../components/AIChat/ChatInput";
import ChatMessage from "../components/AIChat/ChatMessage";

import {
  FaRobot,
  FaFilePdf,
  FaSyncAlt,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";

import { auth } from "../firebase";

const API_URL = "http://localhost:5000/api/ai";
const FILES_API_URL = "http://localhost:5000/api/upload";

function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "AI",
      message:
        "Hello! 👋 I'm StudyMate AI. Select a PDF to ask questions about your notes, or chat with me without selecting one.",
    },
  ]);

  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [filesError, setFilesError] = useState("");

  const [pdfSelectorOpen, setPdfSelectorOpen] = useState(false);
  const [pdfSearch, setPdfSearch] = useState("");

  const messagesEndRef = useRef(null);
  const pdfSelectorRef = useRef(null);

  const selectedFile = files.find(
    (file) => file.id === selectedFileId
  );

  const filteredFiles = files.filter((file) =>
    (file.originalName || "")
      .toLowerCase()
      .includes(pdfSearch.trim().toLowerCase())
  );

  // Close the selector when clicking outside it.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        pdfSelectorRef.current &&
        !pdfSelectorRef.current.contains(event.target)
      ) {
        setPdfSelectorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Fetch PDFs belonging to the authenticated user.
  const fetchUploadedFiles = async () => {
    setIsLoadingFiles(true);
    setFilesError("");

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setFiles([]);
        setSelectedFileId("");
        throw new Error("Please log in to load your PDFs.");
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch(FILES_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load uploaded PDFs."
        );
      }

      const uploadedFiles = data.files || [];

      setFiles(uploadedFiles);

      setSelectedFileId((currentId) => {
        if (
          currentId &&
          uploadedFiles.some((file) => file.id === currentId)
        ) {
          return currentId;
        }

        return "";
      });
    } catch (error) {
      console.error("Failed to load uploaded PDFs:", error);
      setFilesError(
        error.message || "Unable to load uploaded PDFs."
      );
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // Keep the latest chat message visible.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, isLoading]);

  // Handle PDF selection and reset document-specific conversation.
  const handleFileChange = (newFileId) => {
    setSelectedFileId(newFileId);

    const file = files.find((item) => item.id === newFileId);

    setMessages([
      {
        id: Date.now(),
        sender: "AI",
        message: newFileId
          ? `📚 **${file?.originalName || "PDF selected"}** is selected. Ask me a question about this document!`
          : "PDF selection cleared. You can now chat with StudyMate AI without document-specific context.",
      },
    ]);
  };

  // Send a message to StudyMate AI.
  const handleSendMessage = async (text) => {
    const trimmedText = text.trim();

    if (!trimmedText || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: "You",
      message: trimmedText,
    };

    const history = messages
      .filter((item) => item.id !== 1)
      .map((item) => ({
        role: item.sender === "You" ? "user" : "assistant",
        content: item.message,
      }));

    setMessages((previous) => [...previous, userMessage]);
    setIsLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error(
          "Please log in before chatting with StudyMate AI."
        );
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          message: trimmedText,
          history,
          fileId: selectedFileId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to get a response from StudyMate AI."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "AI",
          message: data.reply,
        },
      ]);
    } catch (error) {
      console.error("StudyMate AI chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "AI",
          message:
            error.message ||
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex min-w-0 flex-col pt-4 sm:pt-0">
        <PageHeader
          title="AI Study Assistant"
          description="Ask questions from your uploaded study material."
          icon={<FaRobot />}
        />

        {/* Main chat container */}
        <section
          className="
            mt-4 flex h-[calc(100dvh-205px)] min-h-[400px]
            min-w-0 flex-col overflow-hidden
            rounded-2xl border border-slate-800 bg-slate-900
            p-2 shadow-xl
            sm:mt-8 sm:h-[calc(100vh-230px)] sm:min-h-[450px]
            sm:max-h-[850px] sm:rounded-3xl sm:p-6
          "
          aria-label="AI chat"
        >
          {/* PDF selector panel */}
          <div className="mb-2 min-w-0 shrink-0 rounded-xl border border-slate-700 bg-slate-950/70 p-2 sm:mb-5 sm:rounded-2xl sm:p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="mt-1 shrink-0 rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <FaFilePdf size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="study-pdf-search"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Choose your study material
                  </label>

                  {/* Custom searchable PDF selector */}
                  <div
                    ref={pdfSelectorRef}
                    className="relative w-full min-w-0"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setPdfSelectorOpen((open) => !open);
                        setPdfSearch("");
                      }}
                      disabled={isLoadingFiles || isLoading}
                      aria-expanded={pdfSelectorOpen}
                      aria-haspopup="listbox"
                      className="
                        flex w-full min-w-0 items-center
                        justify-between gap-2 rounded-xl
                        border border-slate-700 bg-slate-900
                        px-3 py-3 text-left text-sm text-white
                        outline-none transition
                        hover:border-blue-500 focus:border-blue-500
                        disabled:opacity-60
                      "
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {selectedFile?.originalName ||
                          "Chat without a selected PDF"}
                      </span>

                      <FaChevronDown
                        className={`shrink-0 text-xs text-slate-400 transition-transform ${
                          pdfSelectorOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {pdfSelectorOpen && (
                      <div
                        className="
                          absolute left-0 right-0 top-full z-50 mt-2
                          w-full min-w-0 overflow-hidden rounded-xl
                          border border-slate-700 bg-slate-900
                          shadow-2xl
                        "
                      >
                        {/* Search */}
                        <div className="border-b border-slate-700 p-2">
                          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3">
                            <FaSearch className="shrink-0 text-slate-500" />

                            <input
                              id="study-pdf-search"
                              type="search"
                              value={pdfSearch}
                              onChange={(event) =>
                                setPdfSearch(event.target.value)
                              }
                              placeholder="Search PDFs..."
                              aria-label="Search uploaded PDFs"
                              className="
                                w-full min-w-0 bg-transparent
                                py-2.5 text-sm text-white
                                outline-none placeholder:text-slate-500
                              "
                            />
                          </div>
                        </div>

                        {/* Options */}
                        <div
                          role="listbox"
                          aria-label="Uploaded study PDFs"
                          className="
                            max-h-52 overflow-y-auto overflow-x-hidden
                            overscroll-contain p-1
                          "
                        >
                          <button
                            type="button"
                            role="option"
                            aria-selected={!selectedFileId}
                            onClick={() => {
                              handleFileChange("");
                              setPdfSelectorOpen(false);
                              setPdfSearch("");
                            }}
                            className={`w-full min-w-0 rounded-lg px-3 py-3 text-left text-sm transition ${
                              !selectedFileId
                                ? "bg-blue-600 text-white"
                                : "text-slate-200 hover:bg-slate-800"
                            }`}
                          >
                            <span className="block break-words [overflow-wrap:anywhere]">
                              Chat without a selected PDF
                            </span>
                          </button>

                          {filteredFiles.map((file) => (
                            <button
                              key={file.id}
                              type="button"
                              role="option"
                              aria-selected={
                                selectedFileId === file.id
                              }
                              onClick={() => {
                                handleFileChange(file.id);
                                setPdfSelectorOpen(false);
                                setPdfSearch("");
                              }}
                              className={`w-full min-w-0 rounded-lg px-3 py-3 text-left text-sm transition ${
                                selectedFileId === file.id
                                  ? "bg-blue-600 text-white"
                                  : "text-slate-200 hover:bg-slate-800"
                              }`}
                            >
                              <span className="block break-words [overflow-wrap:anywhere]">
                                {file.originalName || "Untitled PDF"}
                              </span>
                            </button>
                          ))}

                          {filteredFiles.length === 0 && (
                            <p className="px-3 py-4 text-center text-sm text-slate-400">
                              No matching PDFs found.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Refresh button */}
              <button
                type="button"
                onClick={fetchUploadedFiles}
                disabled={isLoadingFiles || isLoading}
                className="
                  inline-flex w-full shrink-0 items-center
                  justify-center gap-2 rounded-xl
                  border border-slate-700 px-4 py-3
                  text-sm text-slate-300 transition
                  hover:bg-slate-800
                  disabled:cursor-not-allowed disabled:opacity-50
                  sm:w-auto
                "
              >
                <FaSyncAlt
                  className={isLoadingFiles ? "animate-spin" : ""}
                />
                Refresh PDFs
              </button>
            </div>

            {isLoadingFiles && (
              <p className="mt-3 text-xs text-blue-400">
                Loading uploaded PDFs...
              </p>
            )}

            {!isLoadingFiles && filesError && (
              <p
                className="mt-3 break-words text-xs text-red-400"
                role="alert"
              >
                {filesError}
              </p>
            )}

            {!isLoadingFiles &&
              !filesError &&
              files.length === 0 && (
                <p className="mt-3 text-xs text-slate-400">
                  No PDFs found. Upload a PDF first, then refresh this
                  list.
                </p>
              )}

            {selectedFileId && (
              <p className="mt-3 break-words text-xs leading-relaxed text-emerald-400">
                ✓ PDF selected. Your questions will include this
                document&apos;s available extracted text.
              </p>
            )}
          </div>

          {/* Conversation messages */}
          <div
            className="
              flex-1 min-h-0 min-w-0 space-y-3
              overflow-y-auto overflow-x-hidden
              overscroll-contain break-words
              px-1 pb-3 sm:space-y-6 sm:px-2 sm:pb-4
            "
            aria-live="polite"
          >
            {messages.map((item) => (
              <ChatMessage
                key={item.id}
                sender={item.sender}
                message={item.message}
              />
            ))}

            {isLoading && (
              <p
                className="break-words text-sm text-blue-400"
                role="status"
              >
                StudyMate AI is preparing a response...
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="min-w-0 shrink-0 border-t border-slate-800 bg-slate-900 pt-3">
            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading}
            />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default AIChat;
