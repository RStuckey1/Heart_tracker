import { useAuth } from '../context/AuthContext';
import auth from "../utils/auth";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';
import "../index.css";
import "../CSS/Navbar.css";

const CustomNavbar = () => {
  const { isLoggedIn, checkLogin, User, loading } = useAuth(); // Include loading state
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    auth.logout(false); // Prevent redirection by AuthService
    checkLogin(); // Update the login state
    navigate('/Landing'); // Redirect to the landing page
  };

  if (loading) {
    // Show a loading indicator or nothing while loading
    return null;
  }

  return (
    <>
      <nav>

        {!isLoggedIn ? (
          <div className="navbar-logo">
            <ul>
              <li><Link to="/Landing">Heart Data</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </ul>
          </div>
        ) : (
          <div className="navbar-logo">
            <h1>{`Welcome, ${User?.username || 'User'}`}</h1>
            <ul>
              <li className="dropdown">
              <a href="javascript:void(0)" className="dropbtn">Menu</a>
              <div className="dropdown-content">
              <a href="#"><Link to="/Landing">Home</Link></a>
              <a href="#"><Link to="/DisplayRecords">Your Data</Link></a>
              <a href="#"><Link to="/NewHeartData">New Entry</Link></a>
              <a href="#"><button onClick={handleLogout}>Logout</button></a>
              </div>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default CustomNavbar;
