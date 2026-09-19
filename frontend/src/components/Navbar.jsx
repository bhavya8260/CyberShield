import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Menu, X } from 'lucide-react';
import '../styles/cybershield.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
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
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>
      
      <div className="nav-actions">
        {user ? (
          <>
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
