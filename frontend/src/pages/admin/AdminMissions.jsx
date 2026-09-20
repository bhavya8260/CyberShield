import React, { useEffect, useState } from 'react';
import { getAdminMissions } from '../../services/adminService';

const AdminMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const res = await getAdminMissions();
      if (res.success) {
        setMissions(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to fetch missions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--accent-red)' }}>{error}</div>;

  return (
    <div className="cybershield-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Mission Management</h1>
        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Create Mission</button>
      </div>
      
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Title</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Category</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Difficulty</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Base XP</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {missions.map(mission => (
              <tr key={mission._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem' }}>{mission.title}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{mission.category}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: 'var(--accent-cyan)', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    {mission.difficulty}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: mission.published ? '#4ade80' : 'var(--text-secondary)' }}>
                    {mission.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{mission.xpReward}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMissions;
