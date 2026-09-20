import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMissionById } from '../services/missionService';
import { AuthContext } from '../context/AuthContext';

const CATEGORY_MAP = {
  'phishing': 'Phishing Defense',
  'password': 'Password Security',
  'network': 'Network Defense',
  'malware': 'Malware Investigation',
  'incident-response': 'Incident Response'
};

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
      if (err.message && err.message.includes('404')) {
        setError('404');
      } else {
        setError('404'); // Assuming 404 for any fetch error for simplicity of the spec
      }
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyLabel = (diff) => {
    if (!diff) return 'Unknown';
    return diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading mission...</p>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="cybershield-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '4rem', borderRadius: '8px', border: '1px dashed var(--border-subtle)', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-red)' }}>MISSION NOT FOUND</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This mission may no longer be available.</p>
          <Link to="/missions" className="btn btn-outline">[ BACK TO MISSIONS ]</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cybershield-container" style={{ padding: '4rem 2rem' }}>
      <div className="mission-details-card" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="mission-details-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
            {CATEGORY_MAP[mission.category] || mission.category}
          </span>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{mission.title}</h1>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem' }}>
          <p>{mission.description}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', fontSize: '0.95rem', flexWrap: 'wrap' }}>
          <div style={{ color: 'var(--text-primary)' }}><span style={{ color: 'var(--text-secondary)' }}>Difficulty:</span> {getDifficultyLabel(mission.difficulty)}</div>
          <div style={{ color: 'var(--text-primary)' }}><span style={{ color: 'var(--text-secondary)' }}>Estimated Time:</span> {mission.estimatedTime} minutes</div>
          <div style={{ color: 'var(--accent-cyan)' }}><span style={{ color: 'var(--text-secondary)' }}>Reward:</span> +{mission.xpReward} XP</div>
        </div>

        <div className="mission-content-section" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>MISSION SCENARIO</h2>
          <div className="scenario-box" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <p>{mission.scenario}</p>
          </div>
        </div>

        <div className="mission-content-section" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>OBJECTIVES</h2>
          <ul className="objectives-list" style={{ listStyleType: 'none', padding: 0, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {mission.objectives && mission.objectives.map((obj, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent-cyan)', marginRight: '10px' }}>✓</span> {obj}
              </li>
            ))}
          </ul>
          
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>SKILLS PRACTICED</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
             {mission.simulationType && (
               <span style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', border: '1px solid #4ade80', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                 {CATEGORY_MAP[mission.simulationType] || mission.simulationType}
               </span>
             )}
             <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem' }}>
               Critical Thinking
             </span>
             <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem' }}>
               Log Analysis
             </span>
          </div>
        </div>

        <div className="mission-actions-footer" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/missions" className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
            [ ABORT ]
          </Link>
          
          {user ? (
            <Link to={`/missions/${mission._id}/${mission.simulationType ? 'simulation' : 'challenge'}`} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              [ START MISSION ]
            </Link>
          ) : (
            <Link 
              to="/login"
              state={{ from: `/missions/${mission._id}` }}
              className="btn btn-primary"
              style={{ padding: '0.75rem 2rem' }}
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
