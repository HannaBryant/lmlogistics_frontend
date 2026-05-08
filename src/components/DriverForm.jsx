import { useState } from "react";
import { createDriver } from "../services/drivers";

function DriverForm({ onDriverCreated }) {
  const [form, setForm] = useState({ name: "", license_type: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await createDriver(form);
      setForm({ name: "", license_type: "" });
      setSuccess(true);
      if (onDriverCreated) onDriverCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center mb-5">
      <div className="card shadow form-card border-navy">

        <div className="card-header bg-navy text-white py-3">
          <h6 className="mb-0 fw-semibold text-uppercase tracking-wide">
            ＋ Add New Driver
          </h6>
        </div>

        <div className="card-body px-4 py-4">
          {error && (
            <div className="alert alert-danger alert-dismissible py-2" role="alert">
              <small>{error}</small>
              <button
                type="button"
                className="btn-close btn-close-sm"
                onClick={() => setError(null)}
                aria-label="Close"
              />
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible py-2" role="alert">
              <small>Driver added successfully.</small>
              <button
                type="button"
                className="btn-close btn-close-sm"
                onClick={() => setSuccess(false)}
                aria-label="Close"
              />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold small text-navy">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control form-control-sm"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. John Smith"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="license_type" className="form-label fw-semibold small text-navy">
                License Type
              </label>
              <input
                id="license_type"
                name="license_type"
                type="text"
                className="form-control form-control-sm"
                value={form.license_type}
                onChange={handleChange}
                placeholder="e.g. CDL-A"
                required
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-sm btn-navy"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Saving...
                  </>
                ) : (
                  "Add Driver"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default DriverForm;
