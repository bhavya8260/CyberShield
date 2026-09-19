import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/cybershield.css';

const CTA = () => {
  return (
    <section className="section-cta">
      <h2>READY TO DEFEND?</h2>
      <p>Start your cybersecurity journey today.</p>
      <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
        GET STARTED
      </Link>
    </section>
  );
};

export default CTA;
