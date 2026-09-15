import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function DashboardLayout({
  title,
  badge,
  sidebar,
  children,
}: {
  title: string;
  badge: string;
  sidebar?: ReactNode;
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
      <div className="dashboard-body">
        {sidebar && <aside className="dashboard-sidebar">{sidebar}</aside>}
        <main>{children}</main>
      </div>
    </div>
  );
}
