import { useEffect, useState } from "react";
import { getPackages, updatePackage, deletePackage } from "../services/packages";
import { getRoutes } from "../services/routes";
import PackageForm from "../components/PackageForm";

function PackagesPage() {
  const [packages, setPackages]   = useState([]);
  const [routes, setRoutes]       = useState([]);
  const [error, setError]         = useState(null);
  const [editId, setEditId]       = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving]       = useState(false);

  async function fetchAll() {
    try {
      const [p, r] = await Promise.all([getPackages(), getRoutes()]);
      setPackages(p);
      setRoutes(r);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  const routeMap = Object.fromEntries(routes.map((r) => [r.route_id, r]));

  // ── Edit ──────────────────────────────────────────
  function startEdit(p) {
    setEditId(p.package_id);
    setEditForm({ description: p.description, weight: p.weight });
    setConfirmId(null);
  }

  function cancelEdit() { setEditId(null); setEditForm({}); }

  async function saveEdit(id) {
    if (!editForm.description?.trim() || !editForm.weight) return;
    if (parseFloat(editForm.weight) <= 0) return;
    setSaving(true);
    try {
      await updatePackage(id, {
        description: editForm.description.trim(),
        weight:      parseFloat(editForm.weight),
      });
      setEditId(null);
      await fetchAll();
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
      await deletePackage(id);
      setConfirmId(null);
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-green mb-4">Package Management</h2>

      <PackageForm routes={routes} onPackageCreated={fetchAll} />

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm table-card-green">
            <div className="card-header text-white py-3">
              <h6 className="mb-0 fw-semibold text-uppercase">All Packages</h6>
            </div>

            <div className="card-body p-0">
              {error && <div className="alert alert-danger m-3 mb-0">{error}</div>}

              {packages.length === 0 ? (
                <p className="text-muted p-3 mb-0 small">No packages found.</p>
              ) : (
                <table className="table table-hover table-striped mb-0 small align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>ID</th>
                      <th>Description</th>
                      <th>Weight (kg)</th>
                      <th>Route</th>
                      <th>Zone</th>
                      <th className="text-end pe-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((p) => {
                      const route     = routeMap[p.route_id];
                      const isEditing = editId    === p.package_id;
                      const isConfirm = confirmId === p.package_id;

                      if (isEditing) return (
                        <tr key={p.package_id} className="table-warning">
                          <td>{p.package_id}</td>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              type="number" min="0.01" step="0.01"
                              className="form-control form-control-sm"
                              value={editForm.weight}
                              onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                              style={{ width: 90 }}
                            />
                          </td>
                          <td>{p.route_id}</td>
                          <td>{route ? route.service_zone : "—"}</td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-green me-1" onClick={() => saveEdit(p.package_id)} disabled={saving}>
                              {saving ? "…" : "Save"}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
                          </td>
                        </tr>
                      );

                      if (isConfirm) return (
                        <tr key={p.package_id} className="table-danger">
                          <td colSpan={5}>
                            <small>Delete package <strong>#{p.package_id} — {p.description}</strong>? This cannot be undone.</small>
                          </td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-danger me-1" onClick={() => confirmDelete(p.package_id)} disabled={saving}>
                              {saving ? "…" : "Delete"}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmId(null)}>Cancel</button>
                          </td>
                        </tr>
                      );

                      return (
                        <tr key={p.package_id}>
                          <td>{p.package_id}</td>
                          <td>{p.description}</td>
                          <td>{p.weight}</td>
                          <td>{p.route_id}</td>
                          <td>{route ? route.service_zone : <span className="text-muted">—</span>}</td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-outline-green me-1" onClick={() => startEdit(p)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger"     onClick={() => { setConfirmId(p.package_id); setEditId(null); }}>Delete</button>
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

export default PackagesPage;
