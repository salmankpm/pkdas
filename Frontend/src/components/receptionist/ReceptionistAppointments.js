import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Pages.css";
import "../../../styles/Appointments.css";

const empty = { patientName: "", doctorName: "", date: "" };
const STATUS_META = {
  pending:  { cls: "badge-pending",  icon: "⏳", label: "Pending"  },
  approved: { cls: "badge-approved", icon: "✅", label: "Approved" },
  rejected: { cls: "badge-rejected", icon: "❌", label: "Rejected" },
};

export default function ReceptionistAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors]           = useState([]);
  const [patients, setPatients]         = useState([]);
  const [form, setForm]                 = useState(empty);
  const [editId, setEditId]             = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [fetchError, setFetchError]     = useState("");

  const fetchAll = () => {
    setFetching(true);
    setFetchError("");
    Promise.all([
      api.get("/appointments"),
      api.get("/auth/users"),
      api.get("/patients"),
    ])
      .then(([a, u, p]) => {
        setAppointments(a.data);
        setDoctors(u.data.filter((x) => x.role === "doctor"));
        setPatients(p.data);
      })
      .catch((err) => {
        setFetchError(err.response?.data?.message || err.message || "Failed to load appointments");
      })
      .finally(() => setFetching(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      editId
        ? await api.put(`/appointments/update/${editId}`, form)
        : await api.post("/appointments/add", form);
      setForm(empty); setEditId(null); setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving appointment");
    } finally { setLoading(false); }
  };

  const handleEdit   = (a) => { setForm({ patientName: a.patientName, doctorName: a.doctorName, date: a.date?.substring(0, 10) }); setEditId(a._id); setShowForm(true); };
  const handleCancel = () => { setForm(empty); setEditId(null); setShowForm(false); };

  return (
    <div className="page">

      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-count">{appointments.length} Appointments</div>
        <button className="btn-primary" onClick={() => { handleCancel(); setShowForm(true); }}>
          ➕ Book Appointment
        </button>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="form-card">
          <h3>{editId ? "✏️ Edit Appointment" : "➕ Book New Appointment"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name</label>
                <select value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required>
                  <option value="">Select Patient</option>
                  {patients.map((p) => <option key={p._id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} required>
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d.name}>Dr. {d.name} — {d.specialty}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : editId ? "Update" : "Book Appointment"}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Error ── */}
      {fetchError && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          ⚠️ {fetchError}
          <button onClick={fetchAll} style={{ marginLeft: "auto", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "4px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
            Retry
          </button>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {fetching && (
        <div className="cards-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="data-card-skeleton" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!fetching && !fetchError && appointments.length === 0 && (
        <div className="empty-state"><span>📅</span><p>No appointments booked yet.</p></div>
      )}

      {/* ── Cards grid ── */}
      {!fetching && appointments.length > 0 && (
        <div className="cards-grid">
          {appointments.map((a, i) => {
            const dateObj = new Date(a.date);
            const day     = dateObj.getDate();
            const month   = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
            const full    = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
            const s       = STATUS_META[a.status] || STATUS_META.pending;

            return (
              <div key={a._id} className="data-card appt-card" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="data-card__header appt-card__header">
                  <div className="appt-card__date">
                    <span className="appt-card__day">{day}</span>
                    <span className="appt-card__month">{month}</span>
                  </div>
                  <span className={`status-badge ${s.cls}`}>{s.icon} {s.label}</span>
                </div>
                <div className="data-card__body">
                  <h3 className="data-card__name">👤 {a.patientName}</h3>
                  <div className="data-card__meta">
                    <span className="data-card__meta-item">⚕️ Dr. {a.doctorName}</span>
                    <span className="data-card__meta-item">📅 {full}</span>
                  </div>
                </div>
                <div className="data-card__footer">
                  <button className="data-card__btn data-card__btn--edit" onClick={() => handleEdit(a)}>✏️ Edit</button>
                  <span className="data-card__note">Admin only delete</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}