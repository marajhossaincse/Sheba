import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { roleHome } from "./roleHome";
import type { Role } from "../api/client";

// Wraps a set of routes. With no `role` prop, just requires being logged in.
// With `role` set, also redirects a logged-in user of the wrong role to
// their own dashboard instead of showing a 403 page.
export function ProtectedRoute({ role }: { role?: Role }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={roleHome(user.role)} replace />;

  return <Outlet />;
}
