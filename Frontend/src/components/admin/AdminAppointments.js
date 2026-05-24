import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Pages.css";
import "../../../styles/Appointments.css";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetch = () => api.get("/appointments").then((r) => setAppointments(r.data));
  useEffect(() => { fetch(); }, []);

  const handleStatus = async (id, status) => {
    await api.patch(`/appointments/status/${id}`, { status });
    fetch();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete appointment?")) { await api.delete(`/appointments/delete/${id}`); fetch(); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-count">{appointments.length} Appointments</div>
      </div>
      <div className="records-list">
        {appointments.length === 0
          ? <div className="empty-state"><span>📅</span><p>No appointments found.</p></div>
          : appointments.map((a) => (
            <AppointmentRow key={a._id} appt={a} onStatus={handleStatus} onDelete={handleDelete} isAdmin />
          ))
        }
      </div>
    </div>
  );
}

export function AppointmentRow({ appt, onStatus, onDelete, isAdmin, isDoctor }) {
  const dateObj = new Date(appt.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
  const statusClass = { pending: "badge-pending", approved: "badge-approved", rejected: "badge-rejected" };

  return (
    <div className="record-card">
      <div className="card-avatar purple date-badge">
        <span className="date-day">{day}</span>
        <span className="date-month">{month}</span>
      </div>
      <div className="card-info">
        <h3>{appt.patientName}</h3>
        <div className="card-meta">
          <span className="meta-tag">⚕ Dr. {appt.doctorName}</span>
          <span className="meta-tag">{dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
          <span className={`status-badge ${statusClass[appt.status]}`}>{appt.status}</span>
        </div>
      </div>
      <div className="card-actions">
        {(isAdmin || isDoctor) && appt.status === "pending" && (
          <>
            <button className="btn-approve" onClick={() => onStatus(appt._id, "approved")}>✅ Approve</button>
            <button className="btn-reject" onClick={() => onStatus(appt._id, "rejected")}>❌ Reject</button>
          </>
        )}
        {isAdmin && (
          <button className="btn-delete" onClick={() => onDelete(appt._id)}>Delete</button>
        )}
      </div>
    </div>
  );
}