
import AppLayout from "../components/Layout/AppLayout";
import PageHeader from "../components/Layout/PageHeader";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaFilePdf,
  FaComments,
  FaBrain,
  FaArrowRight,
  FaBookOpen,
  FaBolt,
  FaGraduationCap,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Upload Study Material",
      description: "Upload your PDFs and organize your study materials.",
      icon: FaFilePdf,
      path: "/upload-pdf",
      color: "text-blue-400",
      background: "bg-blue-500/10",
    },
    {
      title: "AI Study Assistant",
      description: "Ask questions and understand difficult concepts.",
      icon: FaComments,
      path: "/ai-chat",
      color: "text-purple-400",
      background: "bg-purple-500/10",
    },
    {
      title: "Smart Notes",
      description: "Generate summaries and revision notes from your PDFs.",
      icon: FaBookOpen,
      path: "/smart-notes",
      color: "text-emerald-400",
      background: "bg-emerald-500/10",
    },
    {
      title: "Practice Quiz",
      description: "Test your knowledge with AI-generated questions.",
      icon: FaBrain,
      path: "/quiz",
      color: "text-orange-400",
      background: "bg-orange-500/10",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pb-8">
        {/* Dashboard Header */}
        <div className="min-w-0">
          <PageHeader
            title="Dashboard"
            description="Your personal space to learn smarter with AI."
            icon={<FaHome />}
          />
        </div>

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 shadow-xl shadow-blue-950/20 sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-44 w-44 rounded-full bg-purple-300/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-blue-50">
                <FaBolt className="text-yellow-300" />
                Your AI-powered learning space
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Learn smarter.
                <br className="hidden sm:block" />
                Achieve more. 🚀
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Turn your study materials into useful notes, get answers
                from AI, and prepare for exams with personalized quizzes.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/upload-pdf")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <FaFilePdf />
                  Upload Study Material
                  <FaArrowRight className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/ai-chat")}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <FaRobot />
                  Start AI Chat
                </button>
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center lg:flex">
              <div className="flex h-36 w-36 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
                <FaGraduationCap className="text-7xl text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* Learning Workspace */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">
              Your Learning Workspace
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Everything you need to study, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-950/20"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.background} ${action.color}`}
                    >
                      <Icon className="text-xl" />
                    </div>

                    <FaArrowRight className="mt-2 text-sm text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-white">
                    {action.title}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                    {action.description}
                  </p>

                  <span className="mt-4 inline-block text-sm font-medium text-blue-400">
                    Get started
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Study Workflow */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <FaChartLine className="text-lg" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Your Study Workflow
              </h2>

              <p className="text-sm text-slate-400">
                Follow these steps to make the most of StudyMate AI.
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-400">
                01
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Add your materials
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Upload lecture notes, textbooks, or other study PDFs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-sm font-bold text-purple-400">
                02
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Learn with AI
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Ask questions and generate concise revision notes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">
                03
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Test your knowledge
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Practice quizzes to check your understanding.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Dashboard;

