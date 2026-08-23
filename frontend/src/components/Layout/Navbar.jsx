import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-slate-900 h-16 flex items-center justify-between px-8 border-b border-slate-800">

      <h1 className="text-2xl font-bold text-blue-400">
        StudyMate AI
      </h1>

      <div className="flex items-center gap-6">

        <FaBell className="text-xl text-gray-300 cursor-pointer hover:text-blue-400 transition" />

        <div className="flex items-center gap-2">

          <FaUserCircle className="text-3xl text-blue-400" />

          <span className="text-gray-300">
            Harshad
          </span>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;