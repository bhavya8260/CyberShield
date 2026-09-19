import React from 'react';
import FeatureCard from './FeatureCard';
import { MailWarning, KeyRound, Network, ShieldAlert } from 'lucide-react';
import '../styles/cybershield.css';

const Features = () => {
  const featuresList = [
    {
      icon: MailWarning,
      title: 'Phishing Defense',
      description: 'Identify suspicious emails, links and social engineering attempts.'
    },
    {
      icon: KeyRound,
      title: 'Password Security',
      description: 'Learn how to identify weak credentials and secure accounts.'
    },
    {
      icon: Network,
      title: 'Network Defense',
      description: 'Analyze suspicious network activity and potential threats.'
    },
    {
      icon: ShieldAlert,
      title: 'Incident Response',
      description: 'Make decisions during simulated cybersecurity incidents.'
    }
  ];

  return (
    <section className="section-features">
      <div className="section-header">
        <h2>LEARN BY FACING REALISTIC THREATS</h2>
        <p>Build practical cybersecurity skills through interactive scenarios.</p>
      </div>
      <div className="features-grid">
        {featuresList.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
