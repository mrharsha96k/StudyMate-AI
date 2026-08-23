import { FaPaperPlane } from "react-icons/fa";

function ChatInput() {
  return (
    <div className="mt-6 flex items-center gap-4">

      <input
        type="text"
        placeholder="Ask anything from your study notes..."
        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-white outline-none focus:border-blue-500"
      />

      <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl transition">

        <FaPaperPlane />

      </button>

    </div>
  );
}

export default ChatInput;