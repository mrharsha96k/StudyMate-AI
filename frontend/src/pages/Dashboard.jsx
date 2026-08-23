import AppLayout from "../components/Layout/AppLayout";
import PageHeader from "../components/Layout/PageHeader";
import { FaHome } from "react-icons/fa";

// Import your Dashboard components
import HeroBanner from "../components/Dashboard/HeroBanner";
import DashboardCard from "../components/Dashboard/DashboardCard";
import StatCard from "../components/Dashboard/StatCard";

function Dashboard() {
  return (
    <AppLayout>

      <PageHeader
        title="Dashboard"
        description="Welcome back! Continue your learning journey."
        icon={<FaHome />}
      />

      <HeroBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <StatCard
          title="Uploaded PDFs"
          value="12"
        />

        <StatCard
          title="AI Chats"
          value="84"
        />

        <StatCard
          title="Quiz Score"
          value="92%"
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <DashboardCard
          title="Smart Notes"
          description="Generate AI-powered summaries from your uploaded PDFs."
        />

        <DashboardCard
          title="AI Quiz"
          description="Practice with AI-generated quizzes and improve your knowledge."
        />

      </div>

    </AppLayout>
  );
}

export default Dashboard;