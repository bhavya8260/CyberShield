import React, { useEffect, useState } from 'react';
import { getAdminAuditLogs } from '../../services/adminService';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getAdminAuditLogs(100);
        if (res.success) {
          setLogs(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--accent-red)' }}>{error}</div>;

  return (
    <div className="cybershield-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Security Audit Logs</h1>
      
      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date/Time</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>User</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Action</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Resource</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>IP Address</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} style={{ borderBottom: '1px solid var(--border-subtle)', background: log.action.includes('FAILURE') ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {log.userId ? log.userId.username : 'Anonymous'}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ color: log.action.includes('SUCCESS') ? '#4ade80' : log.action.includes('FAILURE') ? '#ef4444' : 'var(--text-primary)' }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{log.resource}</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{log.ipAddress}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {JSON.stringify(log.metadata)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
