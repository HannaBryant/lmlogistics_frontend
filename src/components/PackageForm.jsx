import { useState } from "react";
import { createPackage } from "../services/packages";

function PackageForm({ routes, onPackageCreated }) {
  const [form, setForm] = useState({ description: "", weight: "", route_id: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.description.trim())
      e.description = "Description is required.";
    if (!form.weight)
      e.weight = "Weight is required.";
    else if (isNaN(form.weight) || parseFloat(form.weight) <= 0)
      e.weight = "Weight must be a positive number.";
    if (!form.route_id)
      e.route_id = "Please select a route.";
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await createPackage({
        description: form.description.trim(),
        weight:      parseFloat(form.weight),
        route_id:    parseInt(form.route_id, 10),
      });
      setForm({ description: "", weight: "", route_id: "" });
      setErrors({});
      setSuccess(true);
      if (onPackageCreated) onPackageCreated();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center mb-5">
      <div className="card shadow form-card form-card-green border-green">
        <div className="card-header text-white py-3">
          <h6 className="mb-0 fw-semibold text-uppercase">＋ Add New Package</h6>
        </div>

        <div className="card-body px-4 py-4">
          {serverError && (
            <div className="alert alert-danger alert-dismissible py-2" role="alert">
              <small>{serverError}</small>
              <button type="button" className="btn-close" onClick={() => setServerError(null)} aria-label="Close" />
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible py-2" role="alert">
              <small>Package added successfully.</small>
              <button type="button" className="btn-close" onClick={() => setSuccess(false)} aria-label="Close" />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Description */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-semibold small text-green">
                Description <span className="text-danger">*</span>
              </label>
              <input
                id="description" name="description" type="text"
                className={`form-control form-control-sm ${errors.description ? "is-invalid" : ""}`}
                value={form.description} onChange={handleChange}
                placeholder="e.g. Electronics — fragile"
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            {/* Weight */}
            <div className="mb-3">
              <label htmlFor="weight" className="form-label fw-semibold small text-green">
                Weight (kg) <span className="text-danger">*</span>
              </label>
              <input
                id="weight" name="weight" type="number" min="0.01" step="0.01"
                className={`form-control form-control-sm ${errors.weight ? "is-invalid" : ""}`}
                value={form.weight} onChange={handleChange}
                placeholder="e.g. 2.50"
              />
              {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
            </div>

            {/* Route dropdown */}
            <div className="mb-4">
              <label htmlFor="route_id" className="form-label fw-semibold small text-green">
                Assign to Route <span className="text-danger">*</span>
              </label>
              <select
                id="route_id" name="route_id"
                className={`form-select form-select-sm ${errors.route_id ? "is-invalid" : ""}`}
                value={form.route_id} onChange={handleChange}
              >
                <option value="">— Select a route —</option>
                {routes.map((r) => (
                  <option key={r.route_id} value={r.route_id}>
                    #{r.route_id} · {r.service_zone} · {r.date}
                  </option>
                ))}
              </select>
              {errors.route_id && <div className="invalid-feedback">{errors.route_id}</div>}
              {routes.length === 0 && (
                <div className="form-text text-warning">
                  No routes available. Create a route first.
                </div>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-sm btn-green"
                disabled={loading || routes.length === 0}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Saving...</>
                ) : "Add Package"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PackageForm;
