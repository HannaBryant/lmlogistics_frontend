import { NavLink } from "react-router-dom";

const links = [
  { to: "/",         label: "Home",     end: true },
  { to: "/drivers",  label: "Drivers" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/routes",   label: "Routes" },
  { to: "/packages", label: "Packages" },
];

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-lm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          🚚 LM Logistics &amp; Fleet
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto gap-1">
            {links.map(({ to, label, end }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  className={({ isActive }) =>
                    "nav-link px-3" + (isActive ? " active" : "")
                  }
                  to={to}
                  end={end}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
