import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="home-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <ShieldAlert size={80} style={{ color: 'var(--error)', marginBottom: '1rem' }} />
      <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem', background: 'var(--error)', WebkitBackgroundClip: 'text', color: 'transparent' }}>404 Not Found</h1>
      <p className="hero-subtitle" style={{ marginBottom: '2rem' }}>The page or resource you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Return Home</Link>
    </div>
  );
};

export default NotFound;
