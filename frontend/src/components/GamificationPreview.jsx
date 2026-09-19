import React from 'react';
import '../styles/cybershield.css';

const GamificationPreview = () => {
  return (
    <section className="section-gamification">
      <div className="section-header">
        <h2>YOUR CYBER JOURNEY</h2>
        <p>Track your progress, earn experience, and level up.</p>
      </div>
      <div className="gami-container">
        <div className="gami-header">CURRENT STATUS</div>
        
        <div className="gami-level-info">
          <div>
            <h3>Level 01</h3>
            <span style={{ color: 'var(--text-primary)' }}>Cyber Rookie</span>
          </div>
          <span>60 XP / 100 XP</span>
        </div>
        
        <div className="gami-progress-bar">
          <div className="gami-progress-fill"></div>
        </div>
        
        <div className="gami-stats">
          <span>Challenges Completed: 6</span>
          <span>Current Streak: 3 Days</span>
        </div>
      </div>
    </section>
  );
};

export default GamificationPreview;
