import { useEffect, useState } from "react";
import { getRoutes, updateRoute, deleteRoute } from "../services/routes";
import { getPackages } from "../services/packages";
import RouteForm from "../components/RouteForm";
import RouteDetails from "../components/RouteDetails";

function RoutesPage() {
  const [routes, setRoutes]       = useState([]);
  const [packages, setPackages]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [error, setError]         = useState(null);
  const [editId, setEditId]       = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving]       = useState(false);

  async function fetchAll() {
    try {
      const [r, p] = await Promise.all([getRoutes(), getPackages()]);
      setRoutes(r);
      setPackages(p);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  // ── Row click (details) ───────────────────────────
  function handleRowClick(route) {
    if (editId === route.route_id || confirmId === route.route_id) return;
    setSelected((prev) => (prev?.route_id === route.route_id ? null : route));
  }

  // ── Edit ──────────────────────────────────────────
  function startEdit(r) {
    setEditId(r.route_id);
    setEditForm({ service_zone: r.service_zone });
    setConfirmId(null);
    setSelected(null);
  }

  function cancelEdit() { setEditId(null); setEditForm({}); }

  async function saveEdit(id) {
    if (!editForm.service_zone?.trim()) return;
    setSaving(true);
    try {
      await updateRoute(id, editForm);
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
      await deleteRoute(id);
      setConfirmId(null);
      if (selected?.route_id === id) setSelected(null);
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-navy mb-4">Delivery Routes</h2>

      <RouteForm onRouteCreated={fetchAll} />

      {selected && (
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <RouteDetails route={selected} packages={packages} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm table-card-navy">
            <div className="card-header text-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold text-uppercase">All Routes</h6>
              <small className="text-white-50">Click a row to view packages</small>
            </div>

            <div className="card-body p-0">
              {error && <div className="alert alert-danger m-3 mb-0">{error}</div>}

              {routes.length === 0 ? (
                <p className="text-muted p-3 mb-0 small">No routes found.</p>
              ) : (
                <table className="table table-hover table-striped mb-0 small align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Service Zone</th>
                      <th>Driver ID</th>
                      <th className="text-center">Pkgs</th>
                      <th className="text-end pe-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((r) => {
                      const pkgCount  = packages.filter((p) => p.route_id === r.route_id).length;
                      const isEditing = editId    === r.route_id;
                      const isConfirm = confirmId === r.route_id;
                      const isActive  = selected?.route_id === r.route_id;

                      if (isEditing) return (
                        <tr key={r.route_id} className="table-warning">
                          <td>{r.route_id}</td>
                          <td>{r.date}</td>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              value={editForm.service_zone}
                              onChange={(e) => setEditForm({ service_zone: e.target.value })}
                            />
                          </td>
                          <td>{r.driver_id}</td>
                          <td className="text-center">
                            <span className={`badge ${pkgCount > 0 ? "badge-pkg" : "bg-secondary"}`}>{pkgCount}</span>
                          </td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-navy me-1" onClick={() => saveEdit(r.route_id)} disabled={saving}>
                              {saving ? "…" : "Save"}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
                          </td>
                        </tr>
                      );

                      if (isConfirm) return (
                        <tr key={r.route_id} className="table-danger">
                          <td colSpan={5}>
                            <small>Delete Route <strong>#{r.route_id} — {r.service_zone}</strong>? All linked packages will also be removed.</small>
                          </td>
                          <td className="text-end pe-3">
                            <button className="btn btn-sm btn-danger me-1" onClick={() => confirmDelete(r.route_id)} disabled={saving}>
                              {saving ? "…" : "Delete"}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmId(null)}>Cancel</button>
                          </td>
                        </tr>
                      );

                      return (
                        <tr
                          key={r.route_id}
                          className={isActive ? "table-active" : ""}
                          onClick={() => handleRowClick(r)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{r.route_id}</td>
                          <td>{r.date}</td>
                          <td>{r.service_zone}</td>
                          <td>{r.driver_id}</td>
                          <td className="text-center">
                            <span className={`badge ${pkgCount > 0 ? "badge-pkg" : "bg-secondary"}`}>{pkgCount}</span>
                          </td>
                          <td className="text-end pe-3" onClick={(e) => e.stopPropagation()}>
                            <button className="btn btn-sm btn-outline-navy me-1" onClick={() => startEdit(r)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger"    onClick={() => { setConfirmId(r.route_id); setEditId(null); }}>Delete</button>
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

export default RoutesPage;
