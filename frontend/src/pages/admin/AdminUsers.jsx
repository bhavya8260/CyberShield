import React, { useEffect, useState } from 'react';
import { getAdminUsers, updateAdminUser } from '../../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers();
      if (res.success) {
        setUsers(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (window.confirm(`Are you sure you want to ${user.isActive ? 'disable' : 'enable'} ${user.username}?`)) {
      try {
        const res = await updateAdminUser(user._id, { isActive: !user.isActive });
        if (res.success) {
          setUsers(users.map(u => u._id === user._id ? { ...u, isActive: !user.isActive } : u));
        }
      } catch (err) {
        alert('Failed to update user status');
      }
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to make ${user.username} an ${newRole}?`)) {
      try {
        const res = await updateAdminUser(user._id, { role: newRole });
        if (res.success) {
          setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
        }
      } catch (err) {
        alert('Failed to update user role');
      }
    }
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--accent-red)' }}>{error}</div>;

  return (
    <div className="cybershield-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>User Management</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Search users..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.75rem',
            width: '300px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>User</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Email</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Lvl / XP</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem' }}>{user.username}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 255, 255, 0.1)',
                    color: user.role === 'admin' ? '#ef4444' : 'var(--accent-cyan)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: user.isActive ? '#4ade80' : '#ef4444' }}>
                    {user.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{user.level} / {user.totalScore}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleToggleRole(user)}
                    className="btn btn-outline" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    Toggle Role
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(user)}
                    className="btn btn-outline" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderColor: user.isActive ? 'var(--accent-red)' : '#4ade80', color: user.isActive ? 'var(--accent-red)' : '#4ade80' }}
                  >
                    {user.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
