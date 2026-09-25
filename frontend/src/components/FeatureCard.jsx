import React from 'react';
import { Shield } from 'lucide-react';
import './FeatureCard.css';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="feature-card-wrapper" tabIndex="0">
      <div className="feature-card-inner">
        {/* Floating Glow Elements */}
        <div className="glow-element top-right"></div>
        <div className="glow-element bottom-left"></div>
        
        {/* Front Face */}
        <div className="feature-card-front">
          <Shield className="back-icon" size={48} />
          <h4>{title}</h4>
          <div className="cyber-line"></div>
        </div>

        {/* Back Face */}
        <div className="feature-card-back">
          <div className="feature-icon">
            <Icon size={24} />
          </div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
