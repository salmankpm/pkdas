import { useAuth } from "../../context/AuthContext";
import "../../../styles/Topbar.css";

export default function Topbar({ title }) {
  const { user } = useAuth();
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-date">{date}</p>
      </div>
      <div className="topbar-right">
        <div className="status-dot"></div>
        <span className="status-text">Online</span>
      </div>
    </header>
  );
}