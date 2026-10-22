import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";

import {
  FaHome,
  FaFileUpload,
  FaRobot,
  FaStickyNote,
  FaQuestionCircle,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl p-3 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-white hover:bg-slate-800"
    }`;

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await signOut(auth);
      onClose();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  const handleNavigation = () => {
    onClose();
  };

  const navLinkClass = (props) => navClass(props);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="studymate-sidebar"
        className={`
          fixed inset-y-0 left-0 z-50 flex h-dvh w-72 shrink-0
          flex-col overflow-y-auto border-r border-slate-800
          bg-slate-900 p-6 transition-transform duration-300 ease-in-out
          md:sticky md:top-16 md:z-30 md:h-[calc(100vh-4rem)]
          md:translate-x-0 md:self-start
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
        aria-label="Main navigation"
        aria-hidden={!mobileOpen && typeof window !== "undefined" && window.innerWidth < 768}
      >
        {/* Mobile sidebar header */}
        <div className="mb-6 flex items-center justify-between md:hidden">
          <span className="text-lg font-bold text-white">
            StudyMate <span className="text-blue-400">AI</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Learning */}
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase text-gray-500">
            Learning
          </p>

          <div className="space-y-3">
            <NavLink to="/dashboard" className={navLinkClass} onClick={handleNavigation}>
              <FaHome />
              Dashboard
            </NavLink>

            <NavLink to="/upload-pdf" className={navLinkClass} onClick={handleNavigation}>
              <FaFileUpload />
              Upload PDF
            </NavLink>

            <NavLink to="/ai-chat" className={navLinkClass} onClick={handleNavigation}>
              <FaRobot />
              AI Chat
            </NavLink>

            <NavLink to="/smart-notes" className={navLinkClass} onClick={handleNavigation}>
              <FaStickyNote />
              Smart Notes
            </NavLink>

            <NavLink to="/quiz" className={navLinkClass} onClick={handleNavigation}>
              <FaQuestionCircle />
              Quiz
            </NavLink>
          </div>
        </div>

        {/* Management */}
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase text-gray-500">
            Management
          </p>

          <div className="space-y-3">
            <div className="flex cursor-not-allowed items-center gap-3 rounded-xl p-3 text-gray-500">
              <FaCalendarAlt />
              Study Planner
            </div>

            <div className="flex cursor-not-allowed items-center gap-3 rounded-xl p-3 text-gray-500">
              <FaChartBar />
              Progress
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="mb-4">
          <p className="mb-3 text-xs uppercase text-gray-500">
            Account
          </p>

          <div className="space-y-3">
            <NavLink
              to="/settings/profile"
              className={navLinkClass}
              onClick={handleNavigation}
            >
              <FaCog />
              <span className="flex-1">Settings</span>
              <FaChevronRight className="text-xs opacity-70" />
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
            >
              <FaSignOutAlt />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
