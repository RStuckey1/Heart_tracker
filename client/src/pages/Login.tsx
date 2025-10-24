import { useState, type FormEvent, type ChangeEvent } from 'react';
import Auth from '../utils/auth';
import { loginauth } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';
import type { UserLogin } from '../interfaces/UserLogin';
import "../index.css";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { setIsLoggedIn, checkLogin } = useAuth(); // Include checkLogin from AuthContext

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginauth(loginData);
      Auth.login(data.token);
      setIsLoggedIn(true); // Update global login state
      checkLogin(); // Trigger checkLogin to update User state
      navigate('/Landing', { replace: true });
    } catch (err) {
      console.error('Failed to login', err);
    }
  };

  return (
    <div className="form-container1">
      <h2>Welcome to Heart Tracker</h2>
      <h2>Please Login</h2>
      <form className="form login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            className="form-input"
            type="text"
            name="username"
            value={loginData.username || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={loginData.password || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group1">
          <button className="user-login" type="submit">
            Login
          </button>
        </div>
      </form>
      <div className="new-login">
        <button
          className="new-login"
          type="button"
          onClick={() => navigate('/signup')}
        >
          New User Click Here
        </button>
      </div>
    </div>
  );
};

export default Login;