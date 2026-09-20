import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMissionById } from '../services/missionService';
import { AuthContext } from '../context/AuthContext';

const MissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMissionDetails();
  }, [id]);

  const fetchMissionDetails = async () => {
    try {
      setLoading(true);
      const response = await getMissionById(id);
      setMission(response.data);
      setError(null);
    } catch (err) {
      setError('Mission not found or error loading data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading mission details...</p>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="error-message">
        {error}
        <br/><br/>
        <Link to="/missions" className="btn btn-outline">Back to Missions</Link>
      </div>
    );
  }

  return (
    <div className="cybershield-container">
      <div className="mission-details-card">
        <div className="mission-details-header">
          <span className="mission-category">🛡 {mission.category.toUpperCase()}</span>
          <h1 className="mission-title-large">{mission.title}</h1>
        </div>

        <div className="mission-meta-banner">
          <div className="meta-item">
            <span className="meta-label">Difficulty</span>
            <span className={`difficulty-badge diff-${mission.difficulty.toLowerCase()}`}>
              {mission.difficulty}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Reward</span>
            <span className="xp-badge">+{mission.xpReward} XP</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Est. Time</span>
            <span className="time-badge">~{mission.estimatedTime}</span>
          </div>
        </div>

        <div className="mission-content-section">
          <h2>INCIDENT SCENARIO</h2>
          <div className="scenario-box">
            <p>{mission.scenario}</p>
          </div>
        </div>

        <div className="mission-content-section">
          <h2>MISSION OBJECTIVES</h2>
          <ul className="objectives-list">
            {mission.objectives.map((obj, index) => (
              <li key={index}>
                <span className="objective-icon">⚡</span> {obj}
              </li>
            ))}
          </ul>
        </div>

        <div className="mission-actions-footer">
          <Link to="/missions" className="btn btn-outline">
            [ ABORT ]
          </Link>
          
          {user ? (
            <Link to={`/missions/${mission._id}/challenge`} className="btn btn-primary btn-large">
              [ START MISSION ]
            </Link>
          ) : (
            <Link 
              to="/login"
              state={{ from: `/missions/${mission._id}/challenge` }}
              className="btn btn-primary btn-large"
            >
              [ LOGIN TO PLAY ]
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionDetails;
