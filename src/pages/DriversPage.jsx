import { useEffect, useState } from "react";
import { getDrivers, updateDriver, deleteDriver } from "../services/drivers";
import DriverForm from "../components/DriverForm";

function DriversPage() {
  const [drivers, setDrivers]       = useState([]);
  const [error, setError]           = useState(null);
  const [editId, setEditId]         = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [confirmId, setConfirmId]   = useState(null);
  const [saving, setSaving]         = useState(false);

  async function fetchDrivers() {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { fetchDrivers(); }, []);

  // ── Edit ──────────────────────────────────────────
  function startEdit(d) {
    setEditId(d.driver_id);
    setEditForm({ name: d.name, license_type: d.license_type });
    setConfirmId(null);
  }

  function cancelEdit() { setEditId(null); setEditForm({}); }

  async function saveEdit(id) {
    if (!editForm.name?.trim() || !editForm.license_type?.trim()) return;
    setSaving(true);
    try {
      await updateDriver(id, editForm);
      setEditId(null);
      await fetchDrivers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────
  async function confirmDelete(id) {
    setSaving(true);
    try {
      await deleteDriver(id);
      setConfirmId(null);
      await fetchDrivers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-navy mb-4">Drivers</h2>

      <DriverForm onDriverCreated={fetchDrivers} />

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow-sm table-card-navy">
            <div className="card-header text-white py-3">
              <h6 className="mb-0 fw-semibold text-uppercase">All Drivers</h6>
            </div>

            <div className="card-body p-0">
              {error && <div className="alert alert-danger m-3 mb-0">{error}</div>}

              {drivers.length === 0 ? (
                <p className="text-muted p-3 mb-0 small">No drivers found.</p>
              ) : (
                <table className="table table-hover table-striped mb-0 small align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>License Type</th>
                      <th className="text-end pe-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((d) => {
                      const isEditing   = editId    === d.driver_id;
                      const isConfirm   = confirmId === d.driver_id;

                      if (isEditing) return (
                        <tr key={d.driver_id} className="table-warning">
                          <td>{d.driver_id}</td>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              value={editForm.license_type}
                              onChange={(e) => setEditForm({ ...editForm, license_type: e.target.value })}
                            />
                          </td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-navy me-1" onClick={() => saveEdit(d.driver_id)} disabled={saving}>
                              {saving ? "…" : "Save"}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
                          </td>
                        </tr>
                      );

                      if (isConfirm) return (
                        <tr key={d.driver_id} className="table-danger">
                          <td colSpan={3}>
                            <small>Delete <strong>{d.name}</strong>? This cannot be undone.</small>
                          </td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-danger me-1" onClick={() => confirmDelete(d.driver_id)} disabled={saving}>
                              {saving ? "…" : "Delete"}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmId(null)}>Cancel</button>
                          </td>
                        </tr>
                      );

                      return (
                        <tr key={d.driver_id}>
                          <td>{d.driver_id}</td>
                          <td>{d.name}</td>
                          <td>{d.license_type}</td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-outline-navy me-1" onClick={() => startEdit(d)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger"    onClick={() => { setConfirmId(d.driver_id); setEditId(null); }}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriversPage;
