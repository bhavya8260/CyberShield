import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import '../styles/cybershield.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="cyber-navbar">
      <Link to="/" className="nav-brand">
        <Shield size={28} color="var(--accent-cyan)" />
        <span>CyberShield</span>
      </Link>
      
      <div className="nav-links" style={{ display: mobileMenuOpen ? 'flex' : '' }}>
        <Link to="/">Home</Link>
        <Link to="/missions">Missions</Link>
        <Link to="/learn">Knowledge Hub</Link>
        {user && <Link to="/leaderboard">Leaderboard</Link>}
      </div>
      
      <div className="nav-actions">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label="Toggle theme"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn btn-secondary" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>Admin Panel</Link>
            )}
            <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-primary" style={{ backgroundColor: '#EF4444', color: '#fff' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </>
        )}
      </div>

      <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
};

export default Navbar;
