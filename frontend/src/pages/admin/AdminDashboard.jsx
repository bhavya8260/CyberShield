import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalyticsOverview } from '../../services/adminService';
import { Users, ShieldAlert, Target, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAnalyticsOverview();
        if (res.success) {
          setStats(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="cybershield-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>Loading Admin Dashboard...</div>;
  if (error) return <div className="cybershield-container" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--accent-red)' }}>{error}</div>;

  return (
    <div className="cybershield-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System overview and analytics</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/users" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> Manage Users
          </Link>
          <Link to="/admin/missions" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} /> Manage Missions
          </Link>
          <Link to="/admin/audit-logs" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={16} /> Audit Logs
          </Link>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Total Users</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats?.totalUsers}</span>
          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{stats?.activeUsers} Active</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Missions</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats?.totalMissions}</span>
          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{stats?.publishedMissions} Published</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Completions</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats?.totalCompletions}</span>
          <div style={{ color: '#4ade80', fontSize: '0.85rem', marginTop: '0.5rem' }}>Avg Score: {stats?.averageScore}</div>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Avg Level</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{stats?.averageLevel}</span>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Total XP: {stats?.totalXP}</div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--accent-cyan)" /> Average Skill Performance
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(stats?.averageSkills || {}).map(([skill, value]) => (
            <div key={skill} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '150px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                {skill.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', margin: '0 1rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${value}%`, background: 'var(--accent-cyan)' }}></div>
              </div>
              <div style={{ width: '40px', textAlign: 'right', color: 'var(--text-primary)' }}>{value}%</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
