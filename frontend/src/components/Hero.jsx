import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Threads from './Threads/Threads';
import '../styles/cybershield.css';

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      badge: "🛡 INTERACTIVE CYBERSECURITY TRAINING",
      title: "MASTER CYBERSECURITY\nTHROUGH SIMULATION",
      description: "Learn cybersecurity by investigating simulated attacks, solving security challenges, and making the right decisions."
    },
    {
      badge: "⚔️ REAL-WORLD THREATS",
      title: "DEFEND AGAINST\nPHISHING & MALWARE",
      description: "Experience highly realistic scenarios where you must analyze malicious payloads and social engineering attempts."
    },
    {
      badge: "🏆 EARN REWARDS",
      title: "GAMIFIED LEARNING\nPROGRESSION",
      description: "Level up your skills, earn badges, and compete on the leaderboard while mastering complex security concepts."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="cyber-hero">
      <div className="hero-background">
        <Threads
          color={[0.6, 0.65, 0.7]}
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>
      <div className="hero-overlay"></div>
      
      <div className="hero-carousel-container">
        {/* Left Side: Vertical Progress Navigation */}
        <div className="hero-progress-nav">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`progress-item ${index === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
            >
              <div className="progress-line-bg">
                <div 
                  className="progress-line-fill" 
                  style={{ 
                    height: index === activeSlide ? '100%' : '0%',
                    transition: index === activeSlide ? 'height 6s linear' : 'height 0.3s ease'
                  }}
                ></div>
              </div>
              <span className="progress-num">0{index + 1}</span>
            </div>
          ))}
        </div>

        {/* Right Side: Slide Content */}
        <div className="hero-content-wrapper">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
            >
              <div className="hero-content">
                <div className="hero-badge">
                  {slide.badge}
                </div>
                <h1>
                  {slide.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h1>
                <p>
                  {slide.description}
                </p>
                <div className="hero-actions">
                  <Link to="/register" className="btn btn-primary">
                    START LEARNING
                  </Link>
                  <Link to="/missions" className="btn btn-secondary">
                    EXPLORE MISSIONS
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
