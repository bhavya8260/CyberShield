import React from 'react';
import { learningPaths } from '../data/paths';
import { Link } from 'react-router-dom';

const Paths = () => {
  return (
    <div className="container" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Learning Paths</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Follow guided curriculums to build targeted cybersecurity skills from the ground up.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {learningPaths.map(path => (
          <div key={path.id} style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '12px', 
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, 
              height: '4px', 
              background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))' 
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{path.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>{path.difficulty}</span>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{path.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flex: 1 }}>{path.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{path.items.length} Modules</span>
              <Link to={`/paths/${path.slug}`} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>View Path</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Paths;
