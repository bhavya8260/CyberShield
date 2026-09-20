import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMissions, getUserProgress } from '../services/missionService';

const CATEGORY_MAP = {
  'phishing': 'Phishing Defense',
  'password': 'Password Security',
  'network': 'Network Defense',
  'malware': 'Malware Investigation',
  'incident-response': 'Incident Response'
};

const Missions = () => {
  const { user } = React.useContext(AuthContext);
  const [allMissions, setAllMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [missionsRes, progressRes] = await Promise.all([
          getMissions(),
          user ? getUserProgress().catch(() => null) : Promise.resolve(null)
        ]);

        setAllMissions(missionsRes.data || []);
        
        if (progressRes && progressRes.data) {
          setCompletedMissions(progressRes.data.completedMissions || []);
        }
        setError(null);
      } catch (err) {
        setError('Unable to load missions.\n\nPlease try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (categoryFilter === 'All') {
      setFilteredMissions(allMissions);
    } else {
      setFilteredMissions(allMissions.filter(m => m.category === categoryFilter));
    }
  }, [categoryFilter, allMissions]);

  const getDifficultyLabel = (diff) => {
    if (!diff) return 'Unknown';
    return diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase();
  };

  return (
    <div className="cybershield-container" style={{ padding: '4rem 2rem' }}>
      <div className="missions-page-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>CYBERSECURITY MISSIONS</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Investigate simulated attacks, make security decisions, and build real-world cybersecurity skills.
        </p>
      </div>

      <div className="missions-filters" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {['All', 'phishing', 'password', 'network', 'malware', 'incident-response'].map(cat => (
          <button 
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`btn ${categoryFilter === cat ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '20px', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          >
            {cat === 'All' ? 'All' : CATEGORY_MAP[cat]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading missions...</p>
        </div>
      ) : error ? (
        <div className="error-message" style={{ textAlign: 'center', color: 'var(--accent-red)', padding: '2rem' }}>
          <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
        </div>
      ) : (
        <div className="missions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredMissions.length > 0 ? (
            filteredMissions.map((mission) => {
              const isCompleted = completedMissions.includes(mission._id);
              
              return (
                <div 
                  key={mission._id} 
                  className="mission-card"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 217, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {CATEGORY_MAP[mission.category]}
                    </div>
                    {isCompleted && (
                      <div style={{ background: 'rgba(0, 255, 0, 0.1)', color: '#4ade80', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(0, 255, 0, 0.2)' }}>
                        COMPLETED
                      </div>
                    )}
                  </div>
                  
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{mission.title}</h3>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem', flex: 1 }}>
                    {mission.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                    <span style={{ color: mission.difficulty === 'hard' ? 'var(--accent-red)' : mission.difficulty === 'medium' ? '#f59e0b' : 'var(--accent-cyan)' }}>
                      {getDifficultyLabel(mission.difficulty)}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{mission.estimatedTime} MIN</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>+{mission.xpReward} XP</span>
                  </div>
                  
                  <Link 
                    to={`/missions/${mission._id}`} 
                    className="btn btn-outline" 
                    style={{ width: '100%', textAlign: 'center', padding: '0.75rem' }}
                  >
                    [ VIEW MISSION ]
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="no-missions" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px dashed var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>NO MISSIONS AVAILABLE</h3>
              <p style={{ color: 'var(--text-secondary)' }}>New cybersecurity scenarios are coming soon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Missions;
