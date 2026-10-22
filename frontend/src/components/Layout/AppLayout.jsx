import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-slate-950 text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="studymate-sidebar"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
        >
          <FaBars className="text-lg" />
        </button>

        {/* Existing navbar */}
        <div className="min-w-0 flex-1">
          <Navbar />
        </div>
      </div>

      {/* Sidebar and content */}
      <div className="flex min-w-0 flex-1">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={closeMobileMenu}
        />

        <main className="min-w-0 flex-1 p-3 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1800px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
