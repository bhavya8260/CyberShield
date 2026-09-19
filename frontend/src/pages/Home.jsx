import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Terminal, Lock } from 'lucide-react';

import { StructureFlowCollection } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

const Home = () => {
  return (
    <div className="home-container" style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
      <header className="hero" style={{ position: 'relative', overflow: 'hidden', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* ThreeUI Background */}
        <div className="shader-frame" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <StructureFlowCollection
            variant="topology-field"
            hue={0}
            saturation={1.00}
            brightness={1.10}
          />
        </div>
        
        {/* Overlay to ensure text readability */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1 }} />
        
        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px', padding: '0 2rem' }}>
          <h1 style={{ fontSize: '1.25rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '1rem', fontWeight: '600' }}>
            CyberShield
          </h1>
          <h2 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#f8fafc', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Master Cybersecurity Through Simulation
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Learn cybersecurity by solving simulated attacks, investigating threats, and making the right security decisions.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/register" style={{ padding: '1rem 2rem', background: '#3b82f6', color: '#fff', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: '600', textDecoration: 'none', transition: 'background 0.2s' }}>
              Start Learning
            </Link>
            <Link to="/missions" style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: '600', textDecoration: 'none', backdropFilter: 'blur(10px)' }}>
              Explore Missions
            </Link>
          </div>
        </div>
      </header>

      <section className="features" style={{ padding: '5rem 2rem', background: '#0f172a', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="feature-card" style={{ background: '#1e293b', padding: '2rem', borderRadius: '1rem', flex: '1', minWidth: '300px', maxWidth: '400px' }}>
          <Terminal size={40} color="#60a5fa" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Interactive Missions</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Complete hands-on cybersecurity missions designed to teach real-world defense techniques.</p>
        </div>
        <div className="feature-card" style={{ background: '#1e293b', padding: '2rem', borderRadius: '1rem', flex: '1', minWidth: '300px', maxWidth: '400px' }}>
          <Lock size={40} color="#60a5fa" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Secure Architecture</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Experience safe, sandboxed environments that simulate actual cyber threats.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
