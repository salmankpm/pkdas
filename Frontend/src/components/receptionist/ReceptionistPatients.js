import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Pages.css";

const empty = { name: "", age: "", gender: "" };

export default function ReceptionistPatients() {
  const [patients, setPatients]     = useState([]);
  const [form, setForm]             = useState(empty);
  const [editId, setEditId]         = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  const fetchPatients = () => api.get("/patients").then((r) => setPatients(r.data));
  useEffect(() => { fetchPatients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      editId
        ? await api.put(`/patients/update/${editId}`, form)
        : await api.post("/patients/add", form);
      setForm(empty); setEditId(null); setShowForm(false);
      fetchPatients();
    } finally { setLoading(false); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, age: p.age, gender: p.gender });
    setEditId(p._id); setShowForm(true);
  };

  const handleCancel = () => { setForm(empty); setEditId(null); setShowForm(false); };

  // Delete — show confirm modal first
  const confirmDelete = (p) => setDeleteTarget({ id: p._id, name: p.name });
  const cancelDelete  = ()  => setDeleteTarget(null);
  const handleDelete  = async () => {
    if (!deleteTarget) return;
    await api.delete(`/patients/delete/${deleteTarget.id}`);
    setDeleteTarget(null);
    fetchPatients();
  };

  return (
    <div className="page">

      {/* ── Confirm Delete Modal ── */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">🗑️</div>
            <h3 className="modal-title">Delete Patient?</h3>
            <p className="modal-body">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-delete-confirm" onClick={handleDelete}>Yes, Delete</button>
              <button className="btn-secondary" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="page-count">{patients.length} Patients</div>
        <button className="btn-primary purple" onClick={() => { handleCancel(); setShowForm(true); }}>
          ➕ Register Patient
        </button>
      </div>

      {showForm && (
        <div className="form-card" style={{ borderTopColor: "#e85d04" }}>
          <h3>{editId ? "✏️ Edit Patient" : "➕ Register New Patient"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text" placeholder="Patient full name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number" placeholder="Age" value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required min="0" max="150"
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary purple" disabled={loading}>
                {loading ? "Saving..." : editId ? "Update Patient" : "Register Patient"}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="records-list">
        {patients.length === 0 ? (
          <div className="empty-state">
            <span>👤</span>
            <p>No patients registered yet. Click "Register Patient" to add one.</p>
          </div>
        ) : (
          patients.map((p) => (
            <div key={p._id} className="record-card">
              <div className="card-avatar purple">
                {p.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="card-info">
                <h3>{p.name}</h3>
                <div className="card-meta">
                  <span className="meta-tag">Age: {p.age}</span>
                  <span className="meta-tag">{p.gender}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(p)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => confirmDelete(p)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}