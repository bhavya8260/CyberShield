import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/historyService';
import { Link } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        if (res.success) {
          setHistory(res.data);
        }
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading History...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--accent-red)' }}>{error}</div>;

  return (
    <div className="container" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Investigation History</h1>
      
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Complete your first investigation to see your activity here.</p>
          <Link to="/challenges" className="btn btn-primary">Explore Challenges</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((record) => (
            <div key={record._id} style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '8px', 
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{record.missionId?.title || 'Unknown Mission'}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{record.missionId?.category}</span>
                  <span>•</span>
                  <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', fontSize: '1.2rem' }}>{record.score} pts</div>
                <div style={{ color: '#4ade80', fontSize: '0.9rem' }}>+{record.xpEarned} XP</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
