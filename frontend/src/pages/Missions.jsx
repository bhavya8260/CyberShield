import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMissions } from '../services/missionService';

const Missions = () => {
  const { user } = React.useContext(AuthContext);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    fetchMissions();
  }, [categoryFilter, difficultyFilter]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (difficultyFilter) filters.difficulty = difficultyFilter;

      const response = await getMissions(filters);
      setMissions(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load missions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cybershield-container">
      <div className="missions-page-header">
        <h1>CYBERSECURITY MISSIONS</h1>
        <p>Select a scenario to test and improve your defense skills.</p>
      </div>

      <div className="missions-filters">
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="mission-filter-select"
        >
          <option value="">All Categories</option>
          <option value="Phishing Defense">Phishing Defense</option>
          <option value="Password Security">Password Security</option>
          <option value="Network Defense">Network Defense</option>
          <option value="Malware Investigation">Malware Investigation</option>
          <option value="Incident Response">Incident Response</option>
        </select>

        <select 
          value={difficultyFilter} 
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="mission-filter-select"
        >
          <option value="">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading missions...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="missions-grid">
          {missions.length > 0 ? (
            missions.map((mission) => (
              <div key={mission._id} className="mission-card">
                <div className="mission-card-header">
                  <span className="mission-category">🛡 {mission.category.toUpperCase()}</span>
                </div>
                
                <h3 className="mission-title">{mission.title}</h3>
                <p className="mission-description">{mission.description}</p>
                
                <div className="mission-meta">
                  <span className={`difficulty-badge diff-${mission.difficulty.toLowerCase()}`}>
                    Difficulty: {mission.difficulty}
                  </span>
                  <span className="xp-badge">XP: +{mission.xpReward}</span>
                  <span className="time-badge">Time: ~{mission.estimatedTime}</span>
                </div>
                
                <div className="mission-action">
                  <Link to={`/missions/${mission._id}`} className="btn btn-primary btn-block">
                    {user ? '[ START MISSION ]' : '[ VIEW MISSION ]'}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-missions">
              <p>No missions found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Missions;
