import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="split-auth-layout">
      {/* Left Side: Cybersecurity Background */}
      <div className="split-auth-left">
        <div className="cyber-bg"></div>
        <div className="cyber-lines"></div>
        <div className="cyber-brand">
          <Shield className="cyber-brand-icon" size={32} />
          <h1>CyberShield</h1>
        </div>
        <div className="cyber-brand-tagline">
          Learn. Investigate. Defend.
        </div>
      </div>

      {/* Right Side: Authentication Card */}
      <div className="split-auth-right">
        <div className="split-auth-card">
          <div className="auth-tabs">
            <Link to="/login" className="auth-tab" state={{ from: location.state?.from }}>Login</Link>
            <Link to="/register" className="auth-tab active" state={{ from: location.state?.from }}>Sign Up</Link>
          </div>

          <div className="split-auth-header">
            <h2>Create Account</h2>
            <p>Start your cybersecurity learning journey.</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="split-auth-form">
            <div className="split-form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="auth-input"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Neo"
                />
              </div>
            </div>

            <div className="split-form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="auth-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div className="split-form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="auth-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="split-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="auth-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn">Create Account</button>
          </form>

          <div className="split-auth-footer">
            Already have an account? <Link to="/login" state={{ from: location.state?.from }}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
