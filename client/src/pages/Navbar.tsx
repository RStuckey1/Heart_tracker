import { useAuth } from '../context/AuthContext';
import auth from "../utils/auth";
import { Link, useNavigate } from 'react-router-dom';
import "../CSS/Navbar.css";

const CustomNavbar = () => {
  const { isLoggedIn, checkLogin, User, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout(false);
    checkLogin();
    navigate('/Landing');
  };

  if (loading) {
    return null;
  }

  return (
    <header className="site-header">
      <nav className="navbar-inner" aria-label="Main navigation">
        <Link className="brand" to="/Landing">
          <span className="brand-mark" aria-hidden="true">♥</span>
          <span>Heart Tracker</span>
        </Link>
        <ul className="navbar-links">
          {isLoggedIn ? (
            <>
              <li className="nav-welcome">Hello, {User?.username || 'there'}</li>
              <li><Link to="/DisplayRecords">My readings</Link></li>
              <li><Link to="/NewHeartData">Add reading</Link></li>
              <li><button className="nav-logout" type="button" onClick={handleLogout}>Log out</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Log in</Link></li>
              <li><Link className="button" to="/signup">Create account</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default CustomNavbar;
