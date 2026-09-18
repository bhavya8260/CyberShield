import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <Shield className="profile-icon" size={60} />
          <h2>Agent Profile</h2>
        </div>
        
        <div className="profile-details">
          <div className="detail-group">
            <span className="detail-label">Username</span>
            <span className="detail-value">{user?.username}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user?.email}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Joined Date</span>
            <span className="detail-value">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Total Score</span>
            <span className="detail-value highlight">{user?.totalScore || 0}</span>
          </div>
          <div className="detail-group">
            <span className="detail-label">Missions Completed</span>
            <span className="detail-value">{user?.completedChallenges || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
