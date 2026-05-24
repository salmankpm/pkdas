import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Dashboard.css";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ staff: 0, patients: 0, appointments: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/auth/users"),
      api.get("/patients"),
      api.get("/appointments"),
    ]).then(([u, p, a]) => {
      const pending = a.data.filter((x) => x.status === "pending").length;
      setCounts({ staff: u.data.length, patients: p.data.length, appointments: a.data.length, pending });
    }).catch(() => {});
  }, []);

  const stats = [
    { label: "Total Staff", value: counts.staff, icon: "👥", color: "blue" },
    { label: "Total Patients", value: counts.patients, icon: "👤", color: "green" },
    { label: "Appointments", value: counts.appointments, icon: "📅", color: "purple" },
    { label: "Pending Approval", value: counts.pending, icon: "⏳", color: "orange" },
  ];

  return (
    <div className="dashboard">
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card stat-${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <h2>{s.value}</h2>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}