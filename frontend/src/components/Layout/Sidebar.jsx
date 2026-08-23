import { NavLink } from "react-router-dom";
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
} from "react-icons/fa";

function Sidebar() {

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-xl transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-white hover:bg-slate-800"
    }`;

  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 p-6">

      {/* Learning */}
      <div className="mb-8">

        <p className="text-xs uppercase text-gray-500 mb-3">
          Learning
        </p>

        <div className="space-y-3">

          <NavLink to="/dashboard" className={navClass}>
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink to="/upload-pdf" className={navClass}>
            <FaFileUpload />
            Upload PDF
          </NavLink>

          <NavLink to="/ai-chat" className={navClass}>
            <FaRobot />
            AI Chat
          </NavLink>

          <NavLink to="/smart-notes" className={navClass}>
            <FaStickyNote />
            Smart Notes
          </NavLink>

          <NavLink to="/quiz" className={navClass}>
            <FaQuestionCircle />
            Quiz
          </NavLink>

        </div>

      </div>

      {/* Management */}
      <div className="mb-8">

        <p className="text-xs uppercase text-gray-500 mb-3">
          Management
        </p>

        <div className="space-y-3">

          <div className="flex items-center gap-3 p-3 rounded-xl text-gray-500 cursor-not-allowed">
            <FaCalendarAlt />
            Study Planner
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl text-gray-500 cursor-not-allowed">
            <FaChartBar />
            Progress
          </div>

        </div>

      </div>

      {/* Account */}
      <div>

        <p className="text-xs uppercase text-gray-500 mb-3">
          Account
        </p>

        <div className="space-y-3">

          <div className="flex items-center gap-3 p-3 rounded-xl text-gray-500 cursor-not-allowed">
            <FaCog />
            Settings
          </div>

          <button
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;