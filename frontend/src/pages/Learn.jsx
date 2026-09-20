import React, { useState, useEffect } from 'react';
import { getLearnTopics } from '../services/learnService';
import { getMyRecommendations } from '../services/userService';

const Learn = () => {
  const [topics, setTopics] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [topicsRes, recRes] = await Promise.all([
          getLearnTopics(),
          getMyRecommendations().catch(() => null)
        ]);

        if (topicsRes.success) {
          setTopics(topicsRes.data);
        }
        if (recRes && recRes.success) {
          setRecommendation(recRes.data);
        }
      } catch (err) {
        setError('Failed to load learning hub');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="cybershield-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Knowledge Hub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cybershield-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-red)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="cybershield-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Knowledge Hub</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Expand your cybersecurity expertise</p>

      {recommendation && (
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>Recommended for You</h3>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{recommendation.reason}</p>
          <button 
            className="btn btn-outline" 
            style={{ borderColor: '#f59e0b', color: '#f59e0b', padding: '0.5rem 1rem' }}
            onClick={() => {
              const recTopic = topics.find(t => t.id === recommendation.recommendedTopicId);
              if (recTopic) setSelectedTopic(recTopic);
            }}
          >
            Review {recommendation.improve}
          </button>
        </div>
      )}

      {selectedTopic ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button 
            onClick={() => setSelectedTopic(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
          >
            ← Back to Topics
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '2rem' }}>{selectedTopic.title}</h2>
            <span style={{ 
              background: 'rgba(255,255,255,0.05)', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '4px', 
              color: 'var(--accent-cyan)', 
              fontSize: '0.85rem',
              textTransform: 'uppercase' 
            }}>
              {selectedTopic.difficulty}
            </span>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>{selectedTopic.summary}</p>
          
          <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Key Concepts</h3>
          <ul style={{ color: 'var(--text-secondary)', marginBottom: '2rem', paddingLeft: '1.5rem' }}>
            {selectedTopic.keyPoints.map((point, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{point}</li>
            ))}
          </ul>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Example Scenario</h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedTopic.example}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {topics.map(topic => (
            <div 
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              style={{ 
                background: 'var(--bg-secondary)', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{topic.category}</span>
                <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{topic.difficulty}</span>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{topic.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {topic.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Learn;
