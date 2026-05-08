/**
 * RouteDetails
 * Shows all packages belonging to a selected route.
 * `packages` is the full package list; filtering happens here.
 */
function RouteDetails({ route, packages, onClose }) {
  if (!route) return null;

  const routePackages = packages.filter((p) => p.route_id === route.route_id);

  return (
    <div className="route-details-panel mb-5">
      <div className="card shadow border-0">
        {/* Header */}
        <div className="card-header route-details-header d-flex justify-content-between align-items-center py-3">
          <div>
            <h6 className="mb-0 fw-bold text-white">
              Route #{route.route_id} — {route.service_zone}
            </h6>
            <small className="text-white-50">
              {route.date} &nbsp;·&nbsp; Driver ID: {route.driver_id}
            </small>
          </div>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={onClose}
            aria-label="Close route details"
          >
            ✕ Close
          </button>
        </div>

        {/* Package table */}
        <div className="card-body p-0">
          {routePackages.length === 0 ? (
            <p className="text-muted p-3 mb-0 small">
              No packages assigned to this route yet.
            </p>
          ) : (
            <table className="table table-hover table-striped mb-0 small">
              <thead className="table-secondary">
                <tr>
                  <th>Package ID</th>
                  <th>Description</th>
                  <th>Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {routePackages.map((p) => (
                  <tr key={p.package_id}>
                    <td>{p.package_id}</td>
                    <td>{p.description}</td>
                    <td>{p.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer summary */}
        {routePackages.length > 0 && (
          <div className="card-footer route-details-footer text-end">
            <small className="text-white-50">
              {routePackages.length} package{routePackages.length !== 1 ? "s" : ""} &nbsp;·&nbsp;
              Total weight:{" "}
              <strong className="text-white">
                {routePackages.reduce((sum, p) => sum + parseFloat(p.weight), 0).toFixed(2)} kg
              </strong>
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteDetails;
