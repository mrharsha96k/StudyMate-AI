function ChatMessage({ sender, message }) {
  const isAI = sender === "AI";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[70%] p-4 rounded-2xl ${
          isAI
            ? "bg-slate-800 text-white"
            : "bg-blue-600 text-white"
        }`}
      >
        <p className="text-sm font-semibold mb-2">
          {sender}
        </p>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;