import React from 'react';
import '../styles/cybershield.css';

const GamificationPreview = () => {
  return (
    <section className="section-gamification">
      <div className="section-header">
        <h2>RANK UP YOUR CYBER SKILLS</h2>
        <p>Defend against simulated threats to earn XP, unlock advanced missions, and climb the leaderboards.</p>
      </div>
      <div className="gami-container">
        <div className="gami-header">OPERATIVE STATUS</div>
        
        <div className="gami-level-info">
          <div>
            <h3>Level 12</h3>
            <span style={{ color: 'var(--text-primary)' }}>Security Analyst</span>
          </div>
          <span>2,450 XP / 3,000 XP</span>
        </div>
        
        <div className="gami-progress-bar">
          <div className="gami-progress-fill" style={{ width: '81%' }}></div>
        </div>
        
        <div className="gami-stats">
          <span>Threats Mitigated: 47</span>
          <span>Zero-Days Patched: 3</span>
          <span>Current Streak: 14 Days</span>
        </div>
      </div>
    </section>
  );
};

export default GamificationPreview;
