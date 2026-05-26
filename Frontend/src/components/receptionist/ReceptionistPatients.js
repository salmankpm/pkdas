import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../../styles/Pages.css";

const empty = { name: "", age: "", gender: "" };
const GENDER_ICONS = { Male: "👨", Female: "👩", Other: "🧑" };

export default function ReceptionistPatients() {
  const [patients, setPatients]         = useState([]);
  const [form, setForm]                 = useState(empty);
  const [editId, setEditId]             = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [fetchError, setFetchError]     = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchPatients = () => {
    setFetching(true);
    setFetchError("");
    api.get("/patients")
      .then((r) => setPatients(r.data))
      .catch((err) => setFetchError(err.response?.data?.message || err.message || "Failed to load patients"))
      .finally(() => setFetching(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      editId
        ? await api.put(`/patients/update/${editId}`, form)
        : await api.post("/patients/add", form);
      setForm(empty); setEditId(null); setShowForm(false);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving patient");
    } finally { setLoading(false); }
  };

  const handleEdit    = (p) => { setForm({ name: p.name, age: p.age, gender: p.gender }); setEditId(p._id); setShowForm(true); };
  const handleCancel  = () => { setForm(empty); setEditId(null); setShowForm(false); };
  const confirmDelete = (p) => setDeleteTarget({ id: p._id, name: p.name });
  const cancelDelete  = ()  => setDeleteTarget(null);
  const handleDelete  = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/patients/delete/${deleteTarget.id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting patient");
    }
    setDeleteTarget(null);
    fetchPatients();
  };

  return (
    <div className="page">

      {/* ── Delete Confirm Modal ── */}
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

      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-count">{patients.length} Patients</div>
        <button className="btn-primary" onClick={() => { handleCancel(); setShowForm(true); }}>
          ➕ Register Patient
        </button>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="form-card">
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
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : editId ? "Update Patient" : "Register Patient"}
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
          <button onClick={fetchPatients} style={{ marginLeft: "auto", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "4px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
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
      {!fetching && !fetchError && patients.length === 0 && (
        <div className="empty-state">
          <span>👤</span>
          <p>No patients registered yet. Click <strong>Register Patient</strong> to add one.</p>
        </div>
      )}

      {/* ── Cards grid ── */}
      {!fetching && patients.length > 0 && (
        <div className="cards-grid">
          {patients.map((p, i) => {
            const initials = p.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={p._id} className="data-card" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="data-card__header data-card__header--blue">
                  <div className="data-card__avatar">{initials}</div>
                  <span className="data-card__tag">{GENDER_ICONS[p.gender] || "🧑"} {p.gender}</span>
                </div>
                <div className="data-card__body">
                  <h3 className="data-card__name">{p.name}</h3>
                  <div className="data-card__meta">
                    <span className="data-card__meta-item">🎂 Age {p.age}</span>
                    <span className="data-card__meta-item">🆔 Registered Patient</span>
                  </div>
                </div>
                <div className="data-card__footer">
                  <button className="data-card__btn data-card__btn--edit"   onClick={() => handleEdit(p)}>✏️ Edit</button>
                  <button className="data-card__btn data-card__btn--delete" onClick={() => confirmDelete(p)}>🗑️ Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}