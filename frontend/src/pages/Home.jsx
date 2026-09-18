import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Terminal, Lock } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <Shield className="hero-icon" size={80} />
        <h1 className="hero-title">CyberShield</h1>
        <p className="hero-subtitle">Learn cybersecurity by solving simulated attacks.</p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-large">Start Learning</Link>
          <Link to="/login" className="btn btn-outline btn-large">Login</Link>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <Terminal className="feature-icon" />
          <h3>Interactive Missions</h3>
          <p>Complete hands-on cybersecurity missions designed to teach real-world defense techniques.</p>
        </div>
        <div className="feature-card">
          <Lock className="feature-icon" />
          <h3>Secure Architecture</h3>
          <p>Experience safe, sandboxed environments that simulate actual cyber threats.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
