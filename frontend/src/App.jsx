import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadPDF from "./pages/UploadPDF";
import AIChat from "./pages/AIChat";
import SmartNotes from "./pages/SmartNotes";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Pages available only to authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-pdf" element={<UploadPDF />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/smart-notes" element={<SmartNotes />} />
        <Route path="/quiz" element={<Quiz />} />

        {/* Settings */}
        <Route path="/settings/profile" element={<Profile />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
