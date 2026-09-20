import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
          <h2>YOUR TRAINING</h2>
          <div className="training-summary">
            <p>Completed Missions: <strong>{user?.completedChallenges || 0}</strong></p>
            <p>Total XP: <strong>{user?.totalScore || 0}</strong></p>
            <p>Current Level: <strong className="accent">Cyber Rookie</strong></p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/missions" className="btn btn-primary">
                [ CONTINUE TRAINING ]
              </Link>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Recommended Missions</h2>
          <ul className="mission-list">
            <li className="mission-item">
              <span className="mission-name">Phishing Defense</span>
              <Link to="/missions" className="badge" style={{ backgroundColor: 'var(--accent-primary)', color: '#000', textDecoration: 'none' }}>Start</Link>
            </li>
            <li className="mission-item">
              <span className="mission-name">Password Security</span>
              <Link to="/missions" className="badge" style={{ backgroundColor: 'var(--accent-primary)', color: '#000', textDecoration: 'none' }}>Start</Link>
            </li>
            <li className="mission-item">
              <span className="mission-name">Network Attack</span>
              <Link to="/missions" className="badge" style={{ backgroundColor: 'var(--accent-primary)', color: '#000', textDecoration: 'none' }}>Start</Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
