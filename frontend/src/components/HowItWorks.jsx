import React from 'react';
import '../styles/cybershield.css';

const HowItWorks = () => {
  return (
    <section className="section-how">
      <div className="how-steps">
        <div className="how-step">
          <div className="step-number">01</div>
          <h3>INVESTIGATE</h3>
          <p>Analyze the simulated cyberattack.</p>
        </div>
        
        <div className="how-step">
          <div className="step-number">02</div>
          <h3>DECIDE</h3>
          <p>Choose the appropriate security action.</p>
        </div>
        
        <div className="how-step">
          <div className="step-number">03</div>
          <h3>LEARN</h3>
          <p>Receive your score and understand why the decision was correct or incorrect.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
