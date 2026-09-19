import React from 'react';
import { Link } from 'react-router-dom';
import Threads from './Threads/Threads';
import '../styles/cybershield.css';

const Hero = () => {
  return (
    <section className="cyber-hero">
      <div className="hero-background">
        <Threads
          color={[0.6, 0.65, 0.7]}
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">
          🛡 INTERACTIVE CYBERSECURITY TRAINING
        </div>
        <h1>
          MASTER CYBERSECURITY<br />
          THROUGH SIMULATION
        </h1>
        <p>
          Learn cybersecurity by investigating simulated attacks,
          solving security challenges, and making the right decisions.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            START LEARNING
          </Link>
          <Link to="/missions" className="btn btn-secondary">
            EXPLORE MISSIONS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
