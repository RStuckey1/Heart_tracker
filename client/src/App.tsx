import Footer from './pages/Footer';
import NavBar from './pages/Navbar';
import { Outlet } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <>
      <div className="App">
        <NavBar />
        </div>
        <div className="container">
          <Outlet />
        </div>
        <div className="footer">
        <Footer />
        </div>
      
    </>
  );
}

export default App;
