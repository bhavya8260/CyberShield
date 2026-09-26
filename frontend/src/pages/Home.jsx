import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import MissionPreview from '../components/MissionPreview';
import GamificationPreview from '../components/GamificationPreview';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import CyberSecurity3DBackground from '../components/CyberSecurity3DBackground';

const Home = () => {
  return (
    <>
      <CyberSecurity3DBackground />
      <div className="cybershield-container landing-page-content" style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Features />
        <HowItWorks />
        <MissionPreview />
        <GamificationPreview />
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default Home;
