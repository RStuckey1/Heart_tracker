import { useState, type FormEvent, type ChangeEvent } from 'react';
import Auth from '../utils/auth';
import { loginauth } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';
import type { UserLogin } from '../interfaces/UserLogin';
import "../CSS/Login.css";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    age: 0,
  });

  const navigate = useNavigate();
  const { setIsLoggedIn, checkLogin } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const data = await loginauth(loginData);
      Auth.login(data.token);
      setIsLoggedIn(true);
      checkLogin();
      navigate('/Landing', { replace: true });
    } catch (err) {
      console.error('Failed to login', err);
      setErrorMessage('We could not log you in. Check your username and password, then try again.');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to Heart Tracker</h1>
        <p className="auth-intro">Access your health journal and keep your readings up to date.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
          <div className="form-group form-group-full">
          <label htmlFor="username">Username</label>
          <input
            className="form-input"
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            required
            value={loginData.username || ''}
            onChange={handleChange}
          />
          </div>
          <div className="form-group form-group-full">
          <label htmlFor="password">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            required
            value={loginData.password || ''}
            onChange={handleChange}
          />
          </div>
          <div className="auth-actions">
            <button className="button" type="submit">Log in</button>
            <button className="button button-secondary" type="button" onClick={() => navigate('/signup')}>
              Create an account
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;