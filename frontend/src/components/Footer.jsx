import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import '../styles/cybershield.css';

const Footer = () => {
  return (
    <footer className="cyber-footer">
      <div className="footer-content">
        <div>
          <div className="footer-brand">
            <Shield size={24} color="var(--accent-cyan)" />
            <span>CyberShield</span>
          </div>
          <p className="footer-tagline">Learn. Investigate. Defend.</p>
        </div>
        
        <div className="footer-links">
          <Link to="/missions">Missions</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        &copy; 2026 CyberShield
      </div>
    </footer>
  );
};

export default Footer;
