import { NavLink } from "react-router-dom";

const links = [
  { to: "/app/secretary", label: "Overview", end: true },
  { to: "/app/secretary/company-dna", label: "Company DNA", end: false },
];

export function SecretarySidebar() {
  return (
    <nav className="sidebar-nav">
      {links.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
