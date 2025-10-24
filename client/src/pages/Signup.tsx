import { useState, type FormEvent } from "react";
import Auth from "../utils/auth";
import { signUp } from "../api/authAPI";
import type { UserLogin } from "../interfaces/UserLogin";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserLogin>({
    username: "",
    email: "",
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
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await signUp(userData);
      Auth.login(data.token);
      console.log("User created successfully");
      navigate('/login');
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Create a New Account</h2>
      <form className='form signup-form' onSubmit={handleSubmit}>

        <div className="form-group">
          <label>New Username</label>
          <input
            className="form-input"
            type="text"
            name="username"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            onChange={handleChange}
            />
         </div>
           <div className="form-group">
          <label>Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            onChange={handleChange}
            />
        </div>
        <div className="form-group1">
          <button className="user-login" type="submit">
           Signup
          </button>
        </div>
      </form>
      <div className="new-login"></div>


    </div>
  
  );
};

export default SignUp;
