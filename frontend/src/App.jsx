import { Routes, Route } from "react-router-dom";
import Quiz from "./pages/Quiz";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadPDF from "./pages/UploadPDF";
import AIChat from "./pages/AIChat";
import SmartNotes from "./pages/SmartNotes";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload-pdf" element={<UploadPDF />} />
      <Route path="/ai-chat" element={<AIChat />} />
      <Route path="/smart-notes" element={<SmartNotes />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  );
}

export default App;