import { useState, type FormEvent } from "react";
import Auth from "../utils/auth";
import { signUp } from "../api/authAPI";
import type { UserLogin } from "../interfaces/UserLogin";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../CSS/Login.css";

const SignUp = () => {
  const navigate = useNavigate();
  const { checkLogin } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<UserLogin>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    age: 0,
    password: "",
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: name === "age" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const data = await signUp(userData);
      Auth.login(data.token);
      checkLogin();
      navigate('/Landing', { replace: true });
    } catch (err) {
      console.error("Failed to create user", err);
      setErrorMessage("We could not create your account. Check your information and try again.");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Get started</p>
        <h1>Create your account</h1>
        <p className="auth-intro">Set up a private place to keep your heart-health readings together.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="signup-username">Username</label>
          <input
            className="form-input"
            type="text"
            name="username"
            id="signup-username"
            autoComplete="username"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            id="signup-email"
            autoComplete="email"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="first-name">First name</label>
          <input
            className="form-input"
            type="text"
            name="first_name"
            id="first-name"
            autoComplete="given-name"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Last name</label>
          <input
            className="form-input"
            type="text"
            name="last_name"
            id="last-name"
            autoComplete="family-name"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-age">Age</label>
          <input
            className="form-input"
            type="number"
            name="age"
            id="signup-age"
            min="1"
            max="120"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            id="signup-password"
            autoComplete="new-password"
            minLength={8}
            required
            onChange={handleChange}
          />
        </div>
        <div className="auth-actions">
          <button className="button" type="submit">Create account</button>
        </div>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </section>
  );
};

export default SignUp;
