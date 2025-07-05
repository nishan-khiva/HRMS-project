import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useUser } from '../../../context/UserContext';
import '../registerForm/RegisterForm.css';

const LoginForm = ({ switchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock login - in real app, this would be an API call
    if (formData.email === 'hr@company.com' && formData.password === 'password') {
      // Login successful
      const userData = {
        id: 1,
        name: 'HR Manager',
        email: 'hr@company.com',
        position: 'Human Resource Manager',
        department: 'Human Resource',
        profile: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'HR'
      };
      login(userData);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="register-right">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Welcome to Dashboard</h2>

        {error && (
          <div style={{ 
            color: '#f44336', 
            fontSize: '14px', 
            marginBottom: '12px',
            padding: '8px 12px',
            backgroundColor: '#ffebee',
            borderRadius: '6px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}

        <label htmlFor="email">
          Email Address<span>*</span>
        </label>
        <input 
          type="email" 
          id="email" 
          name="email"
          placeholder="Email Address" 
          value={formData.email}
          onChange={handleInputChange}
          required 
        />

        <label htmlFor="password">
          Password<span>*</span>
        </label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
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
        
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          <strong>Demo Credentials:</strong><br />
          Email: hr@company.com<br />
          Password: password
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
