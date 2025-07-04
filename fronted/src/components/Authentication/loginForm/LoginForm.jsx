import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../registerForm/RegisterForm.css';

const LoginForm = ({ switchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="register-right">
      <form className="register-form">
        <h2>Welcome to Dashboard</h2>

        <label htmlFor="email">
          Email Address<span>*</span>
        </label>
        <input type="email" id="email" placeholder="Email Address" required />

        <label htmlFor="password">
          Password<span>*</span>
        </label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Password"
            required
          />
          <span
            className="toggle-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button type="submit" className="register-btn">Login</button>

        <p className="login-link">
          Don't have an account?{' '}
          <span onClick={switchToRegister} className="login-link-text">Register</span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
