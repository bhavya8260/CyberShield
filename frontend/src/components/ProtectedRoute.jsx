import React, { useContext } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, message }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    if (message) {
      return (
        <div className="cybershield-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-cyan)', marginBottom: '1.5rem', fontSize: '2rem' }}>Authentication Required</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>{message}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/login" state={{ from: location.pathname }} className="btn btn-primary">[ LOGIN ]</Link>
            <Link to="/register" state={{ from: location.pathname }} className="btn btn-secondary">[ REGISTER ]</Link>
          </div>
        </div>
      );
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
