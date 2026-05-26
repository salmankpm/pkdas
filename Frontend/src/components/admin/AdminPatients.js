import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Pages.css";

const empty = { name: "", age: "", gender: "" };
const GENDER_ICONS = { Male: "👨", Female: "👩", Other: "🧑" };

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(false);

  const fetch = () => api.get("/patients").then((r) => setPatients(r.data));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      editId
        ? await api.put(`/patients/update/${editId}`, form)
        : await api.post("/patients/add", form);
      setForm(empty); setEditId(null); setShowForm(false); fetch();
    } finally { setLoading(false); }
  };

  const handleDelete  = async (id) => { if (window.confirm("Delete patient?")) { await api.delete(`/patients/delete/${id}`); fetch(); } };
  const handleEdit    = (p) => { setForm({ name: p.name, age: p.age, gender: p.gender }); setEditId(p._id); setShowForm(true); };
  const handleCancel  = () => { setForm(empty); setEditId(null); setShowForm(false); };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-count">{patients.length} Patients</div>
        <button className="btn-primary" onClick={() => { handleCancel(); setShowForm(true); }}>➕ Add Patient</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editId ? "✏️ Edit Patient" : "➕ New Patient"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Patient name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required min="0" />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : editId ? "Update" : "Save"}</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {patients.length === 0 ? (
        <div className="empty-state"><span>👤</span><p>No patients found.</p></div>
      ) : (
        <div className="cards-grid">
          {patients.map((p, i) => {
            const initials = p.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
            const icon = GENDER_ICONS[p.gender] || "🧑";
            return (
              <div key={p._id} className="data-card" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="data-card__header data-card__header--blue">
                  <div className="data-card__avatar">{initials}</div>
                  <div className="data-card__badge-row">
                    <span className="data-card__tag">{icon} {p.gender}</span>
                  </div>
                </div>
                <div className="data-card__body">
                  <h3 className="data-card__name">{p.name}</h3>
                  <div className="data-card__meta">
                    <span className="data-card__meta-item">🎂 Age {p.age}</span>
                    <span className="data-card__meta-item">🆔 Patient</span>
                  </div>
                </div>
                <div className="data-card__footer">
                  <button className="data-card__btn data-card__btn--edit" onClick={() => handleEdit(p)}>✏️ Edit</button>
                  <button className="data-card__btn data-card__btn--delete" onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}