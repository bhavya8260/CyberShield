import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <Icon size={24} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;
