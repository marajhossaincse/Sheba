import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function DashboardLayout({
  title,
  badge,
  children,
}: {
  title: string;
  badge: string;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>{title}</h1>
          <span className="role-badge">{badge}</span>
        </div>
        <div className="dashboard-user">
          <span>{user?.name}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
