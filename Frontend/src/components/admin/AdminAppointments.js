import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Pages.css";
import "../../../styles/Appointments.css";

const STATUS_META = {
  pending:  { cls: "badge-pending",  icon: "⏳", label: "Pending"  },
  approved: { cls: "badge-approved", icon: "✅", label: "Approved" },
  rejected: { cls: "badge-rejected", icon: "❌", label: "Rejected" },
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetch = () => api.get("/appointments").then((r) => setAppointments(r.data));
  useEffect(() => { fetch(); }, []);

  const handleStatus = async (id, status) => { await api.patch(`/appointments/status/${id}`, { status }); fetch(); };
  const handleDelete = async (id) => { if (window.confirm("Delete appointment?")) { await api.delete(`/appointments/delete/${id}`); fetch(); } };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-count">{appointments.length} Appointments</div>
      </div>
      {appointments.length === 0 ? (
        <div className="empty-state"><span>📅</span><p>No appointments found.</p></div>
      ) : (
        <div className="cards-grid">
          {appointments.map((a, i) => (
            <AppointmentCard key={a._id} appt={a} onStatus={handleStatus} onDelete={handleDelete} isAdmin index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AppointmentCard({ appt, onStatus, onDelete, isAdmin, isDoctor, index = 0 }) {
  const dateObj = new Date(appt.date);
  const day     = dateObj.getDate();
  const month   = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
  const full    = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const s       = STATUS_META[appt.status] || STATUS_META.pending;

  return (
    <div className="data-card appt-card" style={{ animationDelay: `${index * 0.04}s` }}>
      <div className="data-card__header appt-card__header">
        <div className="appt-card__date">
          <span className="appt-card__day">{day}</span>
          <span className="appt-card__month">{month}</span>
        </div>
        <span className={`status-badge ${s.cls}`}>{s.icon} {s.label}</span>
      </div>
      <div className="data-card__body">
        <h3 className="data-card__name">👤 {appt.patientName}</h3>
        <div className="data-card__meta">
          <span className="data-card__meta-item">⚕️ Dr. {appt.doctorName}</span>
          <span className="data-card__meta-item">📅 {full}</span>
        </div>
      </div>
      <div className="data-card__footer">
        {(isAdmin || isDoctor) && appt.status === "pending" && (
          <>
            <button className="data-card__btn data-card__btn--approve" onClick={() => onStatus(appt._id, "approved")}>✅ Approve</button>
            <button className="data-card__btn data-card__btn--reject"  onClick={() => onStatus(appt._id, "rejected")}>❌ Reject</button>
          </>
        )}
        {isAdmin && (
          <button className="data-card__btn data-card__btn--delete" onClick={() => onDelete(appt._id)}>🗑️ Delete</button>
        )}
        {!isAdmin && !isDoctor && (
          <span className="data-card__note">Admin only delete</span>
        )}
      </div>
    </div>
  );
}

// Keep AppointmentRow as alias for DoctorAppointments compatibility
export function AppointmentRow(props) { return <AppointmentCard {...props} />; }