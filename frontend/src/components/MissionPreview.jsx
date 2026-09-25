import React from 'react';
import '../styles/cybershield.css';
import './MissionPreviewCard.css';

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
          <div className="card" key={index}>
            <div className="text">
              <span style={{ fontSize: '0.6em', color: 'var(--accent-cyan)', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                COMING SOON
              </span>
              {mission.title}
              <div className="subtitle">
                {mission.description}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '0.6em', color: 'rgba(240, 248, 255, 0.691)', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span>Difficulty: {mission.difficulty}</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{mission.xp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionPreview;
