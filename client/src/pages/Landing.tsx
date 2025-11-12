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
        <h1>The place for tracking data of Congestive Heart Failure Patients</h1>
        <h2>No more entering data for vitals in multiple places. One place, all the data. Cardiologists will be efficently able to help you with thid data conviently available to see!</h2>
        <h3>To get started, please login or create an account</h3>
          <>
            <button className="landbtn" type="button">
              <h3><Link to="/login">Login</Link></h3>
            </button>
            <button className="landbtn" type="button">
              <h3><Link to="/signup">New User</Link></h3>
            </button>
          </>
        </div>
        ) : (
          <>
            <div className="welcome">
              <h1>Welcome to your Heart-Tracker</h1>
            </div>
            <div className="links">
              <h3><Link to="/DisplayRecords">See your Data</Link></h3>
              <h3><Link to="/NewHeartData">Enter a New Data</Link></h3>
            </div>
          </>
        )}
      </div>
    
  );
};

export default Landing;