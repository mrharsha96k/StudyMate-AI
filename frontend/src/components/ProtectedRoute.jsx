
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // User must be logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User must verify their email
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
