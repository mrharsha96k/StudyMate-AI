import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({ onSend, disabled = false }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex w-full min-w-0 items-center gap-2 sm:mt-6 sm:gap-4"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything from your study notes..."
        disabled={disabled}
        className="
          block min-w-0 flex-1
          rounded-xl border border-slate-700
          bg-slate-800 px-3 py-3
          text-sm text-white
          outline-none placeholder:text-slate-400
          focus:border-blue-500
          disabled:opacity-50
          sm:px-5 sm:text-base
        "
      />

      <button
        type="submit"
        disabled={disabled || !message.trim()}
        aria-label="Send message"
        className="
          flex h-12 w-12 shrink-0 items-center justify-center
          rounded-xl bg-blue-600 text-white
          transition hover:bg-blue-700
          disabled:cursor-not-allowed disabled:opacity-50
          sm:h-auto sm:w-auto sm:p-4
        "
      >
        <FaPaperPlane />
      </button>
    </form>
  );
}

export default ChatInput;
