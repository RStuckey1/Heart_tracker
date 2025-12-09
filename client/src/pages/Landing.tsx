import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../CSS/Landing.css';

const Landing = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="landing">
      {!isLoggedIn ? (
      <div className="container">
        <h1>Heart-Tracker</h1>
        <h2>Easy tool for tracking data of Congestive Heart Failure Patients</h2>
        <h3>No more entering data for vitals in multiple places. One place, all the data. Cardiologists will be able to see your data with your permission and help you live a long and happy life!</h3>
        <h4>To get started, please login or create an account</h4>
          <>
            <button className="landbtn1" type="button">
              <h3><Link to="/login">Login</Link></h3>
            </button>
            <button className="landbtn2" type="button">
              <h3><Link to="/signup">New User</Link></h3>
            </button>
          </>
        </div>
        ) : (
          <div className="welcome">
            <h1>Welcome to your Heart-Tracker</h1>
            <div className="welcome-links">         
              <Link className="two" to="/DisplayRecords">See your Data</Link>
              <Link className="two" to="/NewHeartData">Enter a New Data</Link>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default Landing;