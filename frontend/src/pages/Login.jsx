import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
            <Link to="/login" className="auth-tab active" state={{ from: location.state?.from }}>Login</Link>
            <Link to="/register" className="auth-tab" state={{ from: location.state?.from }}>Sign Up</Link>
          </div>

          <div className="split-auth-header">
            <h2>Welcome Back</h2>
            <p>Continue your cybersecurity journey.</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="split-auth-form">
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

            <button type="submit" className="auth-btn">Login</button>
          </form>

          <div className="split-auth-footer">
            Don't have an account? <Link to="/register" state={{ from: location.state?.from }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
