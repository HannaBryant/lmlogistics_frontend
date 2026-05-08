import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "🧑‍✈️",
    title: "Driver Management",
    desc: "Maintain a complete registry of licensed drivers, track credentials, and assign personnel to routes with ease.",
  },
  {
    icon: "🚛",
    title: "Fleet Oversight",
    desc: "Monitor every vehicle in your fleet — license plates, models, and driver assignments — from a single dashboard.",
  },
  {
    icon: "🗺️",
    title: "Route Planning",
    desc: "Create and manage delivery routes by zone and date, keeping drivers and dispatchers perfectly aligned.",
  },
  {
    icon: "📦",
    title: "Package Tracking",
    desc: "Log packages against active routes, track weights, and maintain full delivery chain visibility.",
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center gy-5">

            {/* Left copy */}
            <div className="col-lg-6">
              <div className="hero-badge">Last Mile Logistics &amp; Fleet</div>
              <h1>
                Deliver Smarter.<br />
                Manage Everything.
              </h1>
              <p className="mt-3 mb-4">
                A unified operations platform for dispatchers and fleet managers.
                Track drivers, vehicles, routes, and packages — all in one place.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button
                  className="btn btn-hero-primary"
                  onClick={() => navigate("/drivers")}
                >
                  Manage Drivers
                </button>
                <button
                  className="btn btn-hero-outline"
                  onClick={() => navigate("/vehicles")}
                >
                  View Fleet
                </button>
              </div>
            </div>

            {/* Right stats */}
            <div className="col-lg-5 offset-lg-1">
              <div className="row g-3">
                {[
                  { number: "99.4%", label: "On-Time Delivery" },
                  { number: "24/7",  label: "Operations Support" },
                  { number: "Fleet", label: "Real-Time Visibility" },
                  { number: "Live",  label: "Route Monitoring" },
                ].map((s) => (
                  <div className="col-6" key={s.label}>
                    <div className="stat-card">
                      <div className="stat-number">{s.number}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="feature-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-navy">Everything You Need to Run the Last Mile</h2>
            <p className="text-muted mt-2" style={{ maxWidth: 540, margin: "0 auto" }}>
              Built for logistics teams that need reliability, clarity, and speed
              at every step of the delivery chain.
            </p>
          </div>

          <div className="row g-4">
            {features.map((f) => (
              <div className="col-sm-6 col-lg-3" key={f.title}>
                <div className="card feature-card h-100 p-4">
                  <div className="feature-icon">{f.icon}</div>
                  <h6 className="fw-bold text-navy mb-2">{f.title}</h6>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section style={{ background: "#1a3d2b", padding: "3.5rem 0" }}>
        <div className="container text-center">
          <h3 className="text-white fw-bold mb-2">Ready to get started?</h3>
          <p style={{ color: "rgba(255,255,255,0.7)" }} className="mb-4">
            Jump straight into managing your drivers and fleet.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-light fw-semibold px-4"
              onClick={() => navigate("/drivers")}
            >
              Go to Drivers
            </button>
            <button
              className="btn btn-outline-light fw-semibold px-4"
              onClick={() => navigate("/vehicles")}
            >
              Go to Vehicles
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
