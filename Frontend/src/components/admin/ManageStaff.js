import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Pages.css";
import "../../../styles/Staff.css";

const SPECIALTIES = [
  "Cardiology","Neurology","Orthopedics","Pediatrics",
  "Dermatology","Radiology","General Surgery","Oncology",
  "Ophthalmology","ENT","Psychiatry","General Medicine",
];

const empty = { name: "", email: "", password: "", role: "doctor", specialty: "" };

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStaff = () => api.get("/auth/users").then((r) => setStaff(r.data));

  useEffect(() => { fetchStaff(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (editId) {
        await api.put(`/auth/users/${editId}`, form);
      } else {
        await api.post("/auth/signup", form);
      }
      setForm(empty); setEditId(null); setShowForm(false);
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving staff");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    await api.delete(`/auth/users/${id}`);
    fetchStaff();
  };

  const handleEdit = (member) => {
    setForm({ name: member.name, email: member.email, password: "", role: member.role, specialty: member.specialty || "" });
    setEditId(member._id);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => { setForm(empty); setEditId(null); setShowForm(false); setError(""); };

  const doctors = staff.filter((s) => s.role === "doctor");
  const receptionists = staff.filter((s) => s.role === "receptionist");

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-count">{staff.length} Staff Members</div>
        <button className="btn-primary" onClick={() => { handleCancel(); setShowForm(true); }}>
          ➕ Add Staff
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editId ? "✏️ Edit Staff" : "➕ Create Account"}</h3>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Full name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="email@hospital.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password {editId && "(leave blank to keep)"}</label>
                <input type="password" placeholder="Password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editId} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required disabled={!!editId}>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
              {form.role === "doctor" && (
                <div className="form-group">
                  <label>Specialty</label>
                  <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required>
                    <option value="">Select Specialty</option>
                    {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : editId ? "Update" : "Create Account"}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="staff-sections">
        <div className="staff-section">
          <h3 className="section-title green">⚕ Doctors ({doctors.length})</h3>
          {doctors.length === 0
            ? <div className="empty-state"><span>⚕</span><p>No doctors added yet.</p></div>
            : doctors.map((m) => <StaffCard key={m._id} member={m} onEdit={handleEdit} onDelete={handleDelete} />)
          }
        </div>
        <div className="staff-section">
          <h3 className="section-title purple">🧾 Receptionists ({receptionists.length})</h3>
          {receptionists.length === 0
            ? <div className="empty-state"><span>🧾</span><p>No receptionists added yet.</p></div>
            : receptionists.map((m) => <StaffCard key={m._id} member={m} onEdit={handleEdit} onDelete={handleDelete} />)
          }
        </div>
      </div>
    </div>
  );
}

function StaffCard({ member, onEdit, onDelete }) {
  const initials = member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const color = member.role === "doctor" ? "green" : "purple";
  return (
    <div className="record-card">
      <div className={`card-avatar ${color}`}>{initials}</div>
      <div className="card-info">
        <h3>{member.name}</h3>
        <div className="card-meta">
          <span className="meta-tag">{member.email}</span>
          {member.specialty && <span className="meta-tag specialty">⚕ {member.specialty}</span>}
        </div>
      </div>
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(member)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(member._id)}>Delete</button>
      </div>
    </div>
  );
}