import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import auth from "../utils/auth";
import { Link, useNavigate } from 'react-router-dom';
import "../CSS/Navbar.css";

const CustomNavbar = () => {
  const { isLoggedIn, checkLogin, User, loading } = useAuth();
  const navigate = useNavigate();
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

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
              <li><Link to="/journal">Journal</Link></li>
              <li><Link to="/NewHeartData">Add reading</Link></li>
              <li className="settings-menu-container">
                <button
                  className="settings-icon-button"
                  type="button"
                  aria-label="Open preferences menu"
                  aria-expanded={settingsMenuOpen}
                  aria-controls="preferences-menu"
                  onClick={() => setSettingsMenuOpen((isOpen) => !isOpen)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                    <path d="m19.4 13.5 1.1.9-1.1 1.9-1.4-.5a7.9 7.9 0 0 1-1.5.9l-.2 1.5h-2.2l-.4-1.4a7.9 7.9 0 0 1-1.7 0l-.9 1.1-1.9-1.1.5-1.4a7.9 7.9 0 0 1-.9-1.5l-1.5-.2v-2.2l1.4-.4a7.9 7.9 0 0 1 0-1.7l-1.1-.9 1.1-1.9 1.4.5a7.9 7.9 0 0 1 1.5-.9l.2-1.5h2.2l.4 1.4a7.9 7.9 0 0 1 1.7 0l.9-1.1 1.9 1.1-.5 1.4a7.9 7.9 0 0 1 .9 1.5l1.5.2v2.2l-1.4.4a7.9 7.9 0 0 1 0 1.7Z" />
                  </svg>
                </button>
                {settingsMenuOpen && (
                  <div className="preferences-menu" id="preferences-menu">
                    <p>Preferences</p>
                    <Link to="/settings" onClick={() => setSettingsMenuOpen(false)}>
                      Account settings
                      <span>Username, birthday, password</span>
                    </Link>
                  </div>
                )}
              </li>
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
