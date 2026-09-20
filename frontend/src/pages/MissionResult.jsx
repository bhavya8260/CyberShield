import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { getMissionResult } from '../services/missionService';

const MissionResult = () => {
  const { id } = useParams();
  const location = useLocation();
  const [resultData, setResultData] = useState(location.state?.resultData || null);
  const [loading, setLoading] = useState(!resultData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resultData) {
      fetchResult();
    }
  }, [id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await getMissionResult(id);
      setResultData(response.data);
    } catch (err) {
      setError('Result not found or mission not completed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading results...</p>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="error-message" style={{ textAlign: 'center', padding: '4rem', color: 'var(--accent-red)' }}>
        {error}
        <br/><br/>
        <Link to="/missions" className="btn btn-outline">[ BACK TO MISSIONS ]</Link>
      </div>
    );
  }

  const { score, totalPoints, xpEarned, correctAnswers, totalQuestions, missionTitle, isReplay, results } = resultData;
  const isSuccess = score > 0;

  return (
    <div className="cybershield-container" style={{ padding: '4rem 2rem' }}>
      <div className="result-container" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: isSuccess ? 'var(--accent-cyan)' : 'var(--text-primary)', marginBottom: '1rem' }}>
            MISSION COMPLETED
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{missionTitle || location.state?.mission?.title || 'Unknown Mission'}</p>
        </div>
        
        {isReplay && (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            You have already completed this mission. Additional XP is not awarded for replays.
          </div>
        )}

        <div className="result-stats" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', fontSize: '1.1rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Score</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{score} / {totalPoints}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', paddingTop: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Correct Answers</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{correctAnswers} / {totalQuestions}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>XP Earned</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>+{xpEarned} XP</span>
          </div>
        </div>

        {/* Gamification Notifications */}
        {(resultData.levelUp || resultData.isDailyChallenge || (resultData.newAchievements && resultData.newAchievements.length > 0)) && (
          <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resultData.levelUp && (
              <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ color: '#4ade80', margin: '0 0 0.5rem 0' }}>LEVEL UP!</h3>
                <p style={{ color: 'var(--text-primary)', margin: 0 }}>You have reached a new CyberShield rank.</p>
              </div>
            )}
            
            {resultData.isDailyChallenge && (
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ color: '#f59e0b', margin: '0 0 0.5rem 0' }}>DAILY CHALLENGE COMPLETE</h3>
                <p style={{ color: 'var(--text-primary)', margin: 0 }}>+50 Bonus XP Awarded</p>
              </div>
            )}

            {resultData.newAchievements && resultData.newAchievements.length > 0 && (
              <div style={{ background: 'rgba(0, 255, 255, 0.05)', border: '1px dashed var(--accent-cyan)', padding: '1.5rem', borderRadius: '8px' }}>
                <h3 style={{ color: 'var(--accent-cyan)', margin: '0 0 1rem 0', textAlign: 'center' }}>ACHIEVEMENTS UNLOCKED</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {resultData.newAchievements.map((ach, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>🏆</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{ach.achievementId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="feedback-section" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>MISSION DEBRIEFING</h2>
            <div className="feedback-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {results.map((item, index) => (
                <div key={item.questionId} className={`feedback-card`} style={{ 
                  background: 'rgba(0,0,0,0.2)', 
                  border: `1px solid ${item.isCorrect || item.correct ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)'}`, 
                  borderRadius: '8px', 
                  padding: '1.5rem' 
                }}>
                  <div className="feedback-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold', color: (item.isCorrect || item.correct) ? '#4ade80' : '#f87171' }}>
                    <span>Question {index + 1}</span>
                    <span>{(item.isCorrect || item.correct) ? '✓ Correct' : '✗ Incorrect'}</span>
                  </div>
                  
                  {item.questionText && (
                    <div style={{ marginBottom: '1rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                      {item.questionText}
                    </div>
                  )}

                  {!(item.isCorrect || item.correct) && item.correctAnswer && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--text-secondary)' }}>Correct Answer:</strong>
                      <div style={{ marginTop: '0.5rem' }}>{item.correctAnswer}</div>
                    </div>
                  )}

                  {item.explanation && (
                    <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Explanation:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="result-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/missions" className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
            [ BACK TO MISSIONS ]
          </Link>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            [ GO TO DASHBOARD ]
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MissionResult;
