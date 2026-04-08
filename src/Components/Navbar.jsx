import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="topbar-row">
          {/* Logo */}
          <div className="brand-wrap">
            <div className="brand-icon-wrap">
              <span className="brand-icon">📦</span>
            </div>
            <div>
              <h1 className="brand-title">BoxTracker</h1>
              <p className="brand-subtitle">PACKAGING BUSINESS MANAGER</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="topbar-links">
            <NavLink to="/" className={linkClass}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/clients" className={linkClass}>
              👥 Clients
            </NavLink>
            <NavLink to="/orders" className={linkClass}>
              📦 Orders
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
