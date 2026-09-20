import React, { useEffect, useState } from 'react';
import { getMySkills, getMyRecommendations } from '../services/userService';
import { Link } from 'react-router-dom';

const Skills = () => {
  const [skillsData, setSkillsData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, recRes] = await Promise.all([
          getMySkills(),
          getMyRecommendations()
        ]);
        if (skillsRes.success) setSkillsData(skillsRes.data);
        if (recRes.success) setRecommendation(recRes.data);
      } catch (err) {
        setError('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Skills...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--accent-red)' }}>{error}</div>;

  if (!skillsData || !skillsData.skills) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>No skills data available yet.</div>;
  }

  const { skills } = skillsData;
  const skillEntries = Object.entries(skills);
  
  let strongest = { name: 'None', value: 0 };
  let weakest = { name: 'None', value: 100 };
  
  skillEntries.forEach(([key, value]) => {
    if (value > strongest.value) strongest = { name: key, value };
    if (value < weakest.value && value > 0) weakest = { name: key, value }; // Only count if > 0 as weak, or if all 0 then none
  });
  
  if (weakest.value === 100 && strongest.value === 0) {
    weakest = { name: 'All', value: 0 };
  }

  return (
    <div className="container" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Skills</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.9rem' }}>Skill Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {skillEntries.map(([key, value]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                  <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{value}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${value}%`, background: 'var(--accent-cyan)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Strongest Skill</h4>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize', color: '#4ade80' }}>{strongest.name.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Needs Improvement</h4>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize', color: '#f59e0b' }}>{weakest.name.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          </div>

          {recommendation && (
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--accent-cyan)', padding: '2rem', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.9rem' }}>Recommended Next Topic</h3>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Focus on: <strong style={{ color: '#f59e0b' }}>{recommendation.improve}</strong></p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{recommendation.reason}</p>
              <Link to="/learn" className="btn btn-outline">Go to Knowledge Hub</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
