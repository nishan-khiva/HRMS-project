import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './RegisterForm.css';

const RegisterForm = ({ switchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="register-right">
      <form className="register-form">
        <h2>Welcome to Dashboard</h2>
        <label htmlFor="fullname">
          Full name<span>*</span>
        </label>
        <input type="text" id="fullname" placeholder="Full name" required />

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

        <label htmlFor="confirm-password">
          Confirm Password<span>*</span>
        </label>
        <div className="password-wrapper">
          <input
            type={showConfirm ? 'text' : 'password'}
            id="confirm-password"
            placeholder="Confirm Password"
            required
          />
          <span
            className="toggle-icon"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button type="submit" className="register-btn">Register</button>
        <p className="login-link">
          Already have an account?{' '}
          <span onClick={switchToLogin} className="login-link-text">Login</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;