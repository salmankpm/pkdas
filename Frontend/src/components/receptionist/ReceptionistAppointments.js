import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Pages.css";
import "../../../styles/Appointments.css";

const empty = { patientName: "", doctorName: "", date: "" };

export default function ReceptionistAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAll = () =>
    Promise.all([
      api.get("/appointments"),
      api.get("/auth/users"),
      api.get("/patients"),
    ]).then(([a, u, p]) => {
      setAppointments(a.data);
      setDoctors(u.data.filter((x) => x.role === "doctor"));
      setPatients(p.data);
    });

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      editId
        ? await api.put(`/appointments/update/${editId}`, form)
        : await api.post("/appointments/add", form);
      setForm(empty); setEditId(null); setShowForm(false);
      fetchAll();
    } finally { setLoading(false); }
  };

  const handleEdit = (a) => {
    setForm({ patientName: a.patientName, doctorName: a.doctorName, date: a.date?.substring(0, 10) });
    setEditId(a._id); setShowForm(true);
  };

  const handleCancel = () => { setForm(empty); setEditId(null); setShowForm(false); };

  const statusClass = { pending: "badge-pending", approved: "badge-approved", rejected: "badge-rejected" };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-count">{appointments.length} Appointments</div>
        <button className="btn-primary purple" onClick={() => { handleCancel(); setShowForm(true); }}>
          ➕ Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="form-card" style={{ borderTopColor: "#7c3aed" }}>
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
                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary purple" disabled={loading}>
                {loading ? "Saving..." : editId ? "Update" : "Book Appointment"}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="records-list">
        {appointments.length === 0
          ? <div className="empty-state"><span>📅</span><p>No appointments booked yet.</p></div>
          : appointments.map((a) => {
            const dateObj = new Date(a.date);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
            return (
              <div key={a._id} className="record-card">
                <div className="card-avatar purple date-badge">
                  <span className="date-day">{day}</span>
                  <span className="date-month">{month}</span>
                </div>
                <div className="card-info">
                  <h3>{a.patientName}</h3>
                  <div className="card-meta">
                    <span className="meta-tag">⚕ Dr. {a.doctorName}</span>
                    <span className="meta-tag">{dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                    <span className={`status-badge ${statusClass[a.status]}`}>{a.status}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => handleEdit(a)}>Edit</button>
                  <span className="no-delete-note">Admin only delete</span>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}