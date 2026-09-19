import React from 'react';
import '../styles/cybershield.css';

const MissionPreview = () => {
  const missions = [
    {
      title: 'PHISHING ATTACK',
      difficulty: 'Beginner',
      xp: '+100 XP'
    },
    {
      title: 'NETWORK INTRUSION',
      difficulty: 'Intermediate',
      xp: '+250 XP'
    },
    {
      title: 'MALWARE INVESTIGATION',
      difficulty: 'Advanced',
      xp: '+500 XP'
    }
  ];

  return (
    <section className="section-missions">
      <div className="section-header">
        <h2>MISSION PREVIEW</h2>
        <p>Take on specialized challenges designed for all skill levels.</p>
      </div>
      <div className="missions-grid">
        {missions.map((mission, index) => (
          <div className="mission-card" key={index}>
            <div className="mission-coming-soon">COMING SOON</div>
            <h3 className="mission-title">{mission.title}</h3>
            <div className="mission-meta">
              <span>Difficulty: {mission.difficulty}</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{mission.xp}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionPreview;
