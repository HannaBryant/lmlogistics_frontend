import { useState } from "react";
import { createRoute } from "../services/routes";

function RouteForm({ onRouteCreated }) {
  const [form, setForm] = useState({ date: "", service_zone: "", driver_id: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.date.trim())         e.date         = "Date is required.";
    if (!form.service_zone.trim()) e.service_zone = "Service zone is required.";
    if (!form.driver_id)           e.driver_id    = "Driver ID is required.";
    else if (isNaN(form.driver_id) || parseInt(form.driver_id) < 1)
                                   e.driver_id    = "Driver ID must be a positive number.";
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
      await createRoute({
        date:         form.date,
        service_zone: form.service_zone.trim(),
        driver_id:    parseInt(form.driver_id, 10),
      });
      setForm({ date: "", service_zone: "", driver_id: "" });
      setErrors({});
      setSuccess(true);
      if (onRouteCreated) onRouteCreated();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center mb-5">
      <div className="card shadow form-card border-navy">
        <div className="card-header bg-navy text-white py-3">
          <h6 className="mb-0 fw-semibold text-uppercase">＋ Add New Route</h6>
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
              <small>Route created successfully.</small>
              <button type="button" className="btn-close" onClick={() => setSuccess(false)} aria-label="Close" />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Date */}
            <div className="mb-3">
              <label htmlFor="date" className="form-label fw-semibold small text-navy">
                Date <span className="text-danger">*</span>
              </label>
              <input
                id="date" name="date" type="date"
                className={`form-control form-control-sm ${errors.date ? "is-invalid" : ""}`}
                value={form.date} onChange={handleChange}
              />
              {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>

            {/* Service Zone */}
            <div className="mb-3">
              <label htmlFor="service_zone" className="form-label fw-semibold small text-navy">
                Service Zone <span className="text-danger">*</span>
              </label>
              <input
                id="service_zone" name="service_zone" type="text"
                className={`form-control form-control-sm ${errors.service_zone ? "is-invalid" : ""}`}
                value={form.service_zone} onChange={handleChange}
                placeholder="e.g. Zone A — Downtown"
              />
              {errors.service_zone && <div className="invalid-feedback">{errors.service_zone}</div>}
            </div>

            {/* Driver ID */}
            <div className="mb-4">
              <label htmlFor="driver_id" className="form-label fw-semibold small text-navy">
                Driver ID <span className="text-danger">*</span>
              </label>
              <input
                id="driver_id" name="driver_id" type="number" min="1"
                className={`form-control form-control-sm ${errors.driver_id ? "is-invalid" : ""}`}
                value={form.driver_id} onChange={handleChange}
                placeholder="e.g. 1"
              />
              {errors.driver_id && <div className="invalid-feedback">{errors.driver_id}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-sm btn-navy" disabled={loading}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Saving...</>
                ) : "Create Route"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RouteForm;
