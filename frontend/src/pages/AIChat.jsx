import PageHeader from "../components/Layout/PageHeader";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import ChatInput from "../components/AIChat/ChatInput";
import ChatMessage from "../components/AIChat/ChatMessage";
import { FaRobot } from "react-icons/fa";


function AIChat() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">

          <PageHeader
            title="AI Study Assistant"
            description="Ask questions from your uploaded study material."
            icon={<FaRobot />}
          />

          {/* Chat Area */}
          <div className="bg-slate-900 rounded-3xl p-6 mt-8 h-[500px] flex flex-col justify-between">

            <div className="space-y-4 overflow-y-auto">

              <ChatMessage
                sender="AI"
                message="Hello Harshad 👋 I'm StudyMate AI. Ask me anything about your uploaded notes."
              />

            </div>

            <ChatInput />

          </div>

        </div>
      </div>
    </div>
  );
}

export default AIChat;