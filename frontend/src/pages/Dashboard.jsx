import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Your Cybersecurity Progress</p>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <h4>Total Score</h4>
          <span className="stat-value highlight">{user?.totalScore || 0}</span>
        </div>
        <div className="stat-card">
          <h4>Challenges Completed</h4>
          <span className="stat-value">{user?.completedChallenges || 0}</span>
        </div>
        <div className="stat-card">
          <h4>Current Level</h4>
          <span className="stat-value accent">Beginner</span>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2>Cyber Missions</h2>
          <ul className="mission-list">
            <li className="mission-item">
              <span className="mission-name">Phishing Defense</span>
              <span className="badge badge-disabled">Coming Soon</span>
            </li>
            <li className="mission-item">
              <span className="mission-name">Password Security</span>
              <span className="badge badge-disabled">Coming Soon</span>
            </li>
            <li className="mission-item">
              <span className="mission-name">Network Attack</span>
              <span className="badge badge-disabled">Coming Soon</span>
            </li>
          </ul>
        </section>

        <section className="dashboard-section">
          <h2>Security Challenges</h2>
          <div className="placeholder-content">
            <p>More cybersecurity missions coming soon...</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
