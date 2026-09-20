import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getMyProgress, getDailyChallenge, getMySkills, getMyRecommendations } from '../services/userService';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [daily, setDaily] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [progRes, dailyRes, skillsRes, recRes] = await Promise.all([
          getMyProgress(),
          getDailyChallenge().catch(() => null),
          getMySkills().catch(() => null),
          getMyRecommendations().catch(() => null)
        ]);
        
        if (progRes.success) {
          setProgress(progRes.data);
        }
        if (dailyRes && dailyRes.success) {
          setDaily(dailyRes.data);
        }
        if (skillsRes && skillsRes.success) {
          setSkillsData(skillsRes.data);
        }
        if (recRes && recRes.success) {
          setRecommendation(recRes.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--accent-red)' }}>{error}</p>
      </div>
    );
  }

  const progressPercent = progress.nextLevelXP 
    ? ((progress.totalXP - (progress.nextLevelXP - (progress.level * 500))) / (progress.nextLevelXP - (progress.nextLevelXP - (progress.level * 500)))) * 100 // approximation based on thresholds
    : 100;
  
  // Actually, computing exact progress bar %:
  // previous threshold = level thresholds
  // We can just send `xpForCurrentLevel` from backend, or we can just do totalXP / nextLevelXP if simple.
  const simpleProgressPercent = progress.nextLevelXP ? (progress.totalXP / progress.nextLevelXP) * 100 : 100;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Welcome, {user?.username}</h1>
          <p>Your Cybersecurity Progress</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            🔥 {progress.currentStreak} Day Streak
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Longest: {progress.longestStreak} days
          </div>
        </div>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <h4>Total XP</h4>
          <span className="stat-value highlight">{progress.totalXP}</span>
        </div>
        <div className="stat-card">
          <h4>Missions Completed</h4>
          <span className="stat-value">{progress.completedMissions}</span>
        </div>
        <div className="stat-card">
          <h4>Current Level</h4>
          <span className="stat-value accent">Level {progress.level}</span>
        </div>
      </section>

      {/* Progress Bar */}
      <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Level {progress.level}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{progress.totalXP} / {progress.nextLevelXP || 'MAX'} XP</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(simpleProgressPercent, 100)}%`, background: 'var(--accent-cyan)' }}></div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2>ACHIEVEMENTS ({progress.achievementsUnlocked} / {progress.achievementsTotal})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {progress.allAchievements.map(ach => {
              const unlocked = progress.achievements.find(a => a.achievementId === ach.id);
              return (
                <div key={ach.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  background: unlocked ? 'rgba(74, 222, 128, 0.05)' : 'rgba(255,255,255,0.02)', 
                  border: `1px solid ${unlocked ? 'rgba(74, 222, 128, 0.2)' : 'var(--border-subtle)'}`,
                  borderRadius: '4px',
                  opacity: unlocked ? 1 : 0.6
                }}>
                  <div style={{ fontSize: '1.5rem', marginRight: '1rem' }}>{unlocked ? '🏆' : '🔒'}</div>
                  <div>
                    <div style={{ color: unlocked ? '#4ade80' : 'var(--text-primary)', fontWeight: 'bold' }}>{ach.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{ach.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>DAILY CHALLENGE</h2>
          {daily ? (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '4px', border: '1px dashed var(--accent-cyan)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Today's Target</div>
              <h3 style={{ color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>{daily.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>+{daily.bonusXP} Bonus XP</span>
                {progress.dailyChallengeClaimed ? (
                  <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓ COMPLETED</span>
                ) : (
                  <Link to={`/missions/${daily.missionId}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>PLAY NOW</Link>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No daily challenge available.</p>
          )}

          <h2 style={{ marginTop: '2rem' }}>QUICK LINKS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/missions" className="btn btn-primary" style={{ textAlign: 'center' }}>VIEW ALL MISSIONS</Link>
            <Link to="/leaderboard" className="btn btn-outline" style={{ textAlign: 'center' }}>VIEW LEADERBOARD</Link>
          </div>
        </section>
        
        {skillsData && (
          <section className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
            <h2>YOUR CYBERSECURITY SKILLS</h2>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Phishing Defense</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{skillsData.skills.phishing}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Password Security</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{skillsData.skills.password}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Network Defense</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{skillsData.skills.network}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Malware Investigation</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{skillsData.skills.malware}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Incident Response</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{skillsData.skills.incidentResponse}%</span>
                </div>
              </div>

              {recommendation && (
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
                  <h3 style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Recommended Learning</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Improve: </span>
                    <strong style={{ color: '#f59e0b' }}>{recommendation.improve}</strong>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {recommendation.reason}
                  </p>
                  <Link to={`/learn`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'inline-block' }}>GO TO KNOWLEDGE HUB</Link>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
