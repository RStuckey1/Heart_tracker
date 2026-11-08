import Footer from './pages/Footer';
import NavBar from './pages/Navbar';
import { Outlet } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <div className="site-shell">
      <div className="App">
        <NavBar />
      </div>
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
