import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { AppointmentCard } from "../admin/AdminAppointments";
import "../../../styles/Pages.css";
import "../../../styles/Appointments.css";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetch = () =>
    api.get("/appointments").then((r) => {
      const mine = r.data.filter((a) => a.doctorName.toLowerCase() === user.name.toLowerCase());
      setAppointments(mine);
    });

  useEffect(() => { fetch(); }, []);

  const handleStatus = async (id, status) => { await api.patch(`/appointments/status/${id}`, { status }); fetch(); };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-count">{filtered.length} Appointments</div>
        <div className="filter-tabs">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><span>📅</span><p>No appointments found.</p></div>
      ) : (
        <div className="cards-grid">
          {filtered.map((a, i) => (
            <AppointmentCard key={a._id} appt={a} onStatus={handleStatus} onDelete={() => {}} isDoctor index={i} />
          ))}
        </div>
      )}
    </div>
  );
}