import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessage({ sender, message }) {
  const isAI = sender === "AI";

  // Some responses may contain escaped Markdown characters.
  const formattedMessage = isAI
    ? message.replace(/\\([*_`#[\]()])/g, "$1")
    : message;

  return (
    <div
      className={`flex w-full ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`flex flex-col gap-2 max-w-[95%] sm:max-w-[85%] lg:max-w-[80%] ${
          isAI ? "items-start" : "items-end"
        }`}
      >
        <span
          className={`px-1 text-xs font-semibold tracking-wide ${
            isAI ? "text-blue-400" : "text-sky-300"
          }`}
        >
          {isAI ? "🤖 StudyMate AI" : "You"}
        </span>

        <div
          className={`rounded-2xl px-5 py-4 text-sm sm:text-base leading-7 break-words shadow-md overflow-x-auto ${
            isAI
              ? "bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700"
              : "bg-blue-600 text-white rounded-tr-sm whitespace-pre-wrap"
          }`}
        >
          {isAI ? (
            <div className="study-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold mt-4 mb-2 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold mt-3 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-3 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-3 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-400 pl-4 my-3 text-slate-300">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="border-slate-600 my-4" />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-slate-600 bg-slate-700 px-3 py-2 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-slate-600 px-3 py-2 align-top">
                      {children}
                    </td>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-slate-950 rounded-lg p-3 my-3 overflow-x-auto text-sm">
                      {children}
                    </pre>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isBlock = Boolean(className);

                    return isBlock ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code
                        className="bg-slate-950 px-1.5 py-0.5 rounded text-sky-300 text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {formattedMessage}
              </ReactMarkdown>
            </div>
          ) : (
            message
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;