import React from 'react';
import { Link } from 'react-router-dom';
import GradientWaves from './GradientWaves/GradientWaves';

const CyberShieldHero = () => {
  return (
    <header className="cyber-hero">
      <div className="hero-background">
        <GradientWaves
          horizonColor="#07111F"
          waveColor="#245687ff"
          crestColor="#8dddf9ff"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={0.85}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.03}
        />
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-badge">
          🛡 INTERACTIVE CYBERSECURITY TRAINING
        </div>
        <h1>MASTER CYBERSECURITY<br />THROUGH SIMULATION</h1>
        <p>
          Learn cybersecurity by investigating simulated attacks,
          solving security challenges, and making the right decisions.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">START LEARNING</Link>
          <Link to="/missions" className="btn btn-secondary">EXPLORE MISSIONS</Link>
        </div>
      </div>
    </header>
  );
};

export default CyberShieldHero;
