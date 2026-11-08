import Footer from './pages/Footer';
import NavBar from './pages/Navbar';
import { Outlet } from 'react-router-dom';
import './index.css';
import { useAuth } from './context/useAuth';

function App() {
  const { birthdayGreeting, clearBirthdayGreeting, User } = useAuth();

  return (
    <div className="site-shell">
      <div className="App">
        <NavBar />
      </div>
      {birthdayGreeting && (
        <div className="birthday-banner" role="status">
          <span>
            Happy birthday{User?.username ? `, ${User.username}` : ''}! We hope you have a wonderful day.
          </span>
          <button type="button" aria-label="Dismiss birthday greeting" onClick={clearBirthdayGreeting}>×</button>
        </div>
      )}
      <main className="site-main">
        <Outlet />
      </main>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
