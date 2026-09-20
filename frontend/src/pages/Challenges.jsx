import React, { useState, useEffect } from 'react';
import { getMissions, getUserProgress } from '../services/missionService';
import { Link } from 'react-router-dom';
import { Shield, Clock, Star, CheckCircle, Play, ArrowRight } from 'lucide-react';

const Challenges = () => {
  const [missions, setMissions] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [missionsData, progressData] = await Promise.all([
          getMissions(),
          getUserProgress()
        ]);
        
        if (missionsData.success) {
          setMissions(missionsData.data);
        }
        
        if (progressData.success) {
          setProgress(progressData.data.completedMissions);
        }
      } catch (err) {
        setError('Failed to load challenges. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading challenges...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--accent-red)' }}>{error}</div>;

  const categories = ['All', 'Phishing', 'Password Security', 'Network Defense', 'Malware', 'Incident Response'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const statuses = ['All', 'Completed', 'Not Started'];

  const filteredMissions = missions.filter(mission => {
    // Category mapping because backend uses lowercased slugs for categories usually, or specific names
    const categoryMatch = activeCategory === 'All' || 
      mission.category.toLowerCase().includes(activeCategory.toLowerCase().replace(' security', '').replace(' defense', ''));
      
    const difficultyMatch = activeDifficulty === 'All' || mission.difficulty === activeDifficulty;
    
    const isCompleted = progress.includes(mission._id);
    const statusMatch = activeStatus === 'All' || 
      (activeStatus === 'Completed' && isCompleted) || 
      (activeStatus === 'Not Started' && !isCompleted);

    return categoryMatch && difficultyMatch && statusMatch;
  });

  return (
    <div className="container" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Challenges Hub</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Test your skills in interactive cybersecurity scenarios.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <strong style={{ width: '80px' }}>Category:</strong>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              style={{ 
                background: activeCategory === cat ? 'var(--accent-cyan)' : 'transparent',
                color: activeCategory === cat ? '#000' : 'var(--text-primary)',
                border: `1px solid ${activeCategory === cat ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', transition: 'var(--transition-smooth)'
              }}
            >{cat}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <strong style={{ width: '80px' }}>Difficulty:</strong>
          {difficulties.map(diff => (
            <button 
              key={diff} 
              onClick={() => setActiveDifficulty(diff)}
              style={{ 
                background: activeDifficulty === diff ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'var(--text-primary)',
                border: `1px solid ${activeDifficulty === diff ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', transition: 'var(--transition-smooth)'
              }}
            >{diff}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <strong style={{ width: '80px' }}>Status:</strong>
          {statuses.map(stat => (
            <button 
              key={stat} 
              onClick={() => setActiveStatus(stat)}
              style={{ 
                background: activeStatus === stat ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'var(--text-primary)',
                border: `1px solid ${activeStatus === stat ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', transition: 'var(--transition-smooth)'
              }}
            >{stat}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredMissions.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No challenges match your filters.
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isCompleted = progress.includes(mission._id);
            
            return (
              <div key={mission._id} style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: `1px solid ${isCompleted ? 'rgba(74, 222, 128, 0.3)' : 'var(--border-subtle)'}`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
                      {mission.category}
                    </span>
                    {isCompleted && (
                      <span title="Completed" style={{ color: '#4ade80' }}><CheckCircle size={20} /></span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{mission.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    {mission.description?.substring(0, 100)}...
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Shield size={16} color={mission.difficulty === 'Easy' ? '#4ade80' : mission.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'} />
                      <span>{mission.difficulty}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={16} color="#f59e0b" />
                      <span>{mission.xpReward} XP</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={16} />
                      <span>{mission.estimatedTime}m</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                  <Link to={`/missions/${mission._id}`} style={{ 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', 
                    padding: '1rem', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 'bold',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  >
                    {isCompleted ? (
                      <>REVIEW CHALLENGE <ArrowRight size={18} /></>
                    ) : (
                      <>START CHALLENGE <Play size={18} /></>
                    )}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Challenges;
