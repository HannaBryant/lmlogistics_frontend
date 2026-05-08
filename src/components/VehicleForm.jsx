import { useState } from "react";
import { createVehicle } from "../services/vehicles";

function VehicleForm({ onVehicleCreated }) {
  const [form, setForm] = useState({ license_plate: "", model: "", driver_id: "" });
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
      await createVehicle({
        ...form,
        driver_id: parseInt(form.driver_id, 10),
      });
      setForm({ license_plate: "", model: "", driver_id: "" });
      setSuccess(true);
      if (onVehicleCreated) onVehicleCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center mb-5">
      <div className="card shadow form-card form-card-green border-green">

        <div className="card-header text-white py-3">
          <h6 className="mb-0 fw-semibold text-uppercase">＋ Add New Vehicle</h6>
        </div>

        <div className="card-body px-4 py-4">
          {error && (
            <div className="alert alert-danger alert-dismissible py-2" role="alert">
              <small>{error}</small>
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Close"
              />
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible py-2" role="alert">
              <small>Vehicle added successfully.</small>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess(false)}
                aria-label="Close"
              />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="license_plate" className="form-label fw-semibold small text-green">
                License Plate
              </label>
              <input
                id="license_plate"
                name="license_plate"
                type="text"
                className="form-control form-control-sm"
                value={form.license_plate}
                onChange={handleChange}
                placeholder="e.g. ABC-1234"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="model" className="form-label fw-semibold small text-green">
                Model
              </label>
              <input
                id="model"
                name="model"
                type="text"
                className="form-control form-control-sm"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. Ford Transit"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="driver_id" className="form-label fw-semibold small text-green">
                Driver ID
              </label>
              <input
                id="driver_id"
                name="driver_id"
                type="number"
                min="1"
                className="form-control form-control-sm"
                value={form.driver_id}
                onChange={handleChange}
                placeholder="e.g. 1"
                required
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-sm btn-green"
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
                  "Add Vehicle"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default VehicleForm;
