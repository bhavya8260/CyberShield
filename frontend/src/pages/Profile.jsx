import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyProgress, getMySkills } from '../services/userService';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, skillsRes] = await Promise.all([
          getMyProgress(),
          getMySkills().catch(() => null)
        ]);
        if (progRes.success) setProgress(progRes.data);
        if (skillsRes && skillsRes.success) setSkills(skillsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Profile...</div>;

  return (
    <div className="container" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#000', fontWeight: 'bold' }}>
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>{user?.username}</h1>
          <div style={{ color: 'var(--text-secondary)' }}>Level {progress?.level || 1} • {progress?.totalXP || 0} Total XP</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Streak</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>🔥 {progress?.currentStreak || 0} Days</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Longest Streak</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{progress?.longestStreak || 0} Days</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Missions Completed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{progress?.completedMissions || 0}</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Achievements</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {progress?.allAchievements.map(ach => {
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

      <div style={{ textAlign: 'center' }}>
        <Link to="/history" className="btn btn-outline" style={{ marginRight: '1rem' }}>View Investigation History</Link>
        <Link to="/skills" className="btn btn-primary">View Detailed Skills</Link>
      </div>
    </div>
  );
};

export default Profile;
