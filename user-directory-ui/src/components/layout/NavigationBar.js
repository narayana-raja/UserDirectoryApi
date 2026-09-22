import { Link, useLocation } from 'react-router-dom';

function NavigationBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        User Directory
      </div>
      <div className="navbar-links">
        <Link
          to="/users"
          className={location.pathname === "/users" ? "active" : ""}
        >
          Users
        </Link>
        <Link
          to="/add-user"
          className={location.pathname === "/add-user" ? "active" : ""}
        >
          Add User
        </Link>
      </div>
    </nav>
  );
}

export default NavigationBar;
