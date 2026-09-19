import React from 'react';
import '../styles/cybershield.css';

const MissionPreview = () => {
  const missions = [
    {
      title: 'OPERATION: SPEARPHISH',
      description: 'Identify and neutralize a targeted email campaign aimed at company executives.',
      difficulty: 'Beginner',
      xp: '+150 XP'
    },
    {
      title: 'BREACH PROTOCOL',
      description: 'Analyze network logs to locate the source of an ongoing unauthorized data exfiltration.',
      difficulty: 'Intermediate',
      xp: '+300 XP'
    },
    {
      title: 'ZERO DAY CONTAINMENT',
      description: 'Reverse engineer a novel malware strain before it successfully encrypts the mainframe.',
      difficulty: 'Advanced',
      xp: '+600 XP'
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
            <p className="mission-description" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginTop: '-0.5rem', marginBottom: '1rem' }}>
              {mission.description}
            </p>
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
