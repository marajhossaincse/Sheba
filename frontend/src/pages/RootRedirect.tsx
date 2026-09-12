import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { roleHome } from "../auth/roleHome";

// Landing on "/" sends you to your dashboard if logged in, or to /login otherwise.
export function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading…</div>;
  return <Navigate to={user ? roleHome(user.role) : "/login"} replace />;
}
