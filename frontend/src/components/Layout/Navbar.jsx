import { FaUserCircle, FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Student";

  const firstName = displayName.trim().split(/\s+/)[0];

  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Brand */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-950/40">
          <FaGraduationCap className="text-lg text-white" />
        </div>

        <h1 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">
          StudyMate <span className="text-blue-400">AI</span>
        </h1>
      </div>

      {/* User Profile */}
      <div className="ml-4 flex shrink-0 items-center gap-3 sm:gap-5">
        <div className="h-8 w-px bg-slate-800" />

        <div
          className="flex max-w-44 items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-800/70 sm:gap-3 sm:px-3"
          title={user?.email || displayName}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
            <FaUserCircle className="text-xl text-blue-400" />
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Signed in as
            </p>

            <p className="max-w-32 truncate text-sm font-semibold text-slate-100">
              {firstName}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
