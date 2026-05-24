import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../../styles/Sidebar.css";

const navConfig = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: "⊞", end: true },
    { to: "/admin/staff", label: "Manage Staff", icon: "👥" },
    { to: "/admin/patients", label: "Patients", icon: "👤" },
    { to: "/admin/appointments", label: "Appointments", icon: "📅" },
  ],
  doctor: [
    { to: "/doctor", label: "My Appointments", icon: "📅", end: true },
  ],
  receptionist: [
    { to: "/receptionist", label: "Patients", icon: "👤", end: true },
    { to: "/receptionist/appointments", label: "Appointments", icon: "📅" },
  ],
};

const roleColors = {
  admin: "#2563eb",
  doctor: "#16a34a",
  receptionist: "#7c3aed",
};

const roleLabels = {
  admin: "Administrator",
  doctor: "Doctor",
  receptionist: "Receptionist",
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = navConfig[user?.role] || [];
  const color = roleColors[user?.role] || "#2563eb";

  return (
    <aside className={`sidebar role-${user?.role || "admin"}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">✚</div>
        <div className="logo-text">
          <span className="logo-main">PK Das</span>
          <span className="logo-sub">Hospital System</span>
        </div>
      </div>

      <div className="user-badge">
        <div className="user-avatar">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{roleLabels[user?.role]}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MENU</p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}