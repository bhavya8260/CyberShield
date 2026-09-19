import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import MissionPreview from '../components/MissionPreview';
import GamificationPreview from '../components/GamificationPreview';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="cybershield-container">
      <Hero />
      <Features />
      <HowItWorks />
      <MissionPreview />
      <GamificationPreview />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
