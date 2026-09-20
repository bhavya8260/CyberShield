import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/userService';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await getLeaderboard();
        if (res.success) {
          setLeaderboardData(res.data.leaderboard);
          setUserRank(res.data.userRank);
        }
      } catch (err) {
        setError('Failed to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="cybershield-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cybershield-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--accent-red)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="cybershield-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>HALL OF FAME</h1>
        <p style={{ color: 'var(--accent-cyan)', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>CyberShield Global Rankings</p>
      </div>

      {userRank && (
        <div style={{ 
          background: 'rgba(74, 222, 128, 0.05)', 
          border: '1px solid rgba(74, 222, 128, 0.3)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          textAlign: 'center',
          color: 'var(--text-primary)'
        }}>
          Your Current Global Rank: <strong style={{ color: '#4ade80', fontSize: '1.2rem' }}>#{userRank}</strong>
        </div>
      )}

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '60px 1fr 100px 100px', 
          gap: '1rem', 
          padding: '1rem 1.5rem', 
          background: 'rgba(255,255,255,0.02)', 
          borderBottom: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          textTransform: 'uppercase'
        }}>
          <div style={{ textAlign: 'center' }}>Rank</div>
          <div>Agent Name</div>
          <div style={{ textAlign: 'center' }}>Level</div>
          <div style={{ textAlign: 'right' }}>Total XP</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {leaderboardData.map((player) => (
            <div 
              key={player.username}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '60px 1fr 100px 100px', 
                gap: '1rem', 
                padding: '1.2rem 1.5rem', 
                borderBottom: '1px solid var(--border-subtle)',
                alignItems: 'center'
              }}
            >
              <div style={{ 
                textAlign: 'center', 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                color: player.rank === 1 ? '#f59e0b' : 
                       player.rank === 2 ? '#94a3b8' : 
                       player.rank === 3 ? '#b45309' : 'var(--text-secondary)'
              }}>
                #{player.rank}
              </div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                {player.username}
              </div>
              <div style={{ textAlign: 'center', color: 'var(--accent-cyan)' }}>
                {player.level}
              </div>
              <div style={{ textAlign: 'right', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                {player.totalXP}
              </div>
            </div>
          ))}
          
          {leaderboardData.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No agents have been ranked yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
