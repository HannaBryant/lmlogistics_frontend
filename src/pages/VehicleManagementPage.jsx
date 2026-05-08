import { useEffect, useState } from "react";
import { getVehicles, updateVehicle, deleteVehicle } from "../services/vehicles";
import VehicleForm from "../components/VehicleForm";

function VehicleManagementPage() {
  const [vehicles, setVehicles]     = useState([]);
  const [error, setError]           = useState(null);
  const [editId, setEditId]         = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [confirmId, setConfirmId]   = useState(null);
  const [saving, setSaving]         = useState(false);

  async function fetchVehicles() {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { fetchVehicles(); }, []);

  // ── Edit ──────────────────────────────────────────
  function startEdit(v) {
    setEditId(v.vehicle_id);
    setEditForm({ license_plate: v.license_plate, model: v.model });
    setConfirmId(null);
  }

  function cancelEdit() { setEditId(null); setEditForm({}); }

  async function saveEdit(id) {
    if (!editForm.license_plate?.trim() || !editForm.model?.trim()) return;
    setSaving(true);
    try {
      await updateVehicle(id, editForm);
      setEditId(null);
      await fetchVehicles();
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
      await deleteVehicle(id);
      setConfirmId(null);
      await fetchVehicles();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-green mb-4">Vehicle Management</h2>

      <VehicleForm onVehicleCreated={fetchVehicles} />

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow-sm table-card-green">
            <div className="card-header text-white py-3">
              <h6 className="mb-0 fw-semibold text-uppercase">Fleet List</h6>
            </div>

            <div className="card-body p-0">
              {error && <div className="alert alert-danger m-3 mb-0">{error}</div>}

              {vehicles.length === 0 ? (
                <p className="text-muted p-3 mb-0 small">No vehicles found.</p>
              ) : (
                <table className="table table-hover table-striped mb-0 small align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>ID</th>
                      <th>License Plate</th>
                      <th>Model</th>
                      <th>Driver ID</th>
                      <th className="text-end pe-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => {
                      const isEditing = editId    === v.vehicle_id;
                      const isConfirm = confirmId === v.vehicle_id;

                      if (isEditing) return (
                        <tr key={v.vehicle_id} className="table-warning">
                          <td>{v.vehicle_id}</td>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              value={editForm.license_plate}
                              onChange={(e) => setEditForm({ ...editForm, license_plate: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              value={editForm.model}
                              onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                            />
                          </td>
                          <td>{v.driver_id}</td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-green me-1" onClick={() => saveEdit(v.vehicle_id)} disabled={saving}>
                              {saving ? "…" : "Save"}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
                          </td>
                        </tr>
                      );

                      if (isConfirm) return (
                        <tr key={v.vehicle_id} className="table-danger">
                          <td colSpan={4}>
                            <small>Delete <strong>{v.license_plate}</strong>? This cannot be undone.</small>
                          </td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-danger me-1" onClick={() => confirmDelete(v.vehicle_id)} disabled={saving}>
                              {saving ? "…" : "Delete"}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmId(null)}>Cancel</button>
                          </td>
                        </tr>
                      );

                      return (
                        <tr key={v.vehicle_id}>
                          <td>{v.vehicle_id}</td>
                          <td>{v.license_plate}</td>
                          <td>{v.model}</td>
                          <td>{v.driver_id}</td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-outline-green me-1" onClick={() => startEdit(v)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger"     onClick={() => { setConfirmId(v.vehicle_id); setEditId(null); }}>Delete</button>
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

export default VehicleManagementPage;
