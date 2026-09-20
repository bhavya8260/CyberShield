import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children, message = "Access denied. Admin role required." }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h2 style={{ color: 'var(--accent-red)' }}>403 Forbidden</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <button onClick={() => window.location.href = '/'} className="btn btn-outline" style={{ marginTop: '1rem' }}>
          Return Home
        </button>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
