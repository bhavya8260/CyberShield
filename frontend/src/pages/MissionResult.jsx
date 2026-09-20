import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const MissionResult = () => {
  const location = useLocation();
  const { resultData, mission } = location.state || {};

  // If accessed directly without state, redirect to missions
  if (!resultData || !mission) {
    return <Navigate to="/missions" replace />;
  }

  const { score, maxScore, xpEarned, correctAnswers, totalQuestions, percentage, feedback } = resultData;

  const isSuccess = percentage >= 70; // Define success threshold

  return (
    <div className="cybershield-container">
      <div className="result-container">
        <div className={`result-header ${isSuccess ? 'success' : 'failure'}`}>
          <h1>MISSION {isSuccess ? 'SUCCESS' : 'FAILED'}</h1>
          <p>{mission.title}</p>
        </div>

        <div className="result-stats-grid">
          <div className="result-stat-card">
            <span className="stat-label">SCORE</span>
            <span className="stat-value">{score} <small>/ {maxScore}</small></span>
          </div>
          <div className="result-stat-card">
            <span className="stat-label">ACCURACY</span>
            <span className="stat-value">{percentage}%</span>
          </div>
          <div className="result-stat-card">
            <span className="stat-label">XP EARNED</span>
            <span className="stat-value xp">+{xpEarned} XP</span>
          </div>
          <div className="result-stat-card">
            <span className="stat-label">CORRECT</span>
            <span className="stat-value">{correctAnswers} <small>/ {totalQuestions}</small></span>
          </div>
        </div>

        <div className="feedback-section">
          <h2>MISSION DEBRIEFING</h2>
          <div className="feedback-list">
            {feedback.map((item, index) => {
              // Find original question text
              const question = mission.questions.find(q => q._id === item.questionId);
              
              return (
                <div key={item.questionId} className={`feedback-card ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="feedback-card-header">
                    <span className="feedback-status">
                      {item.isCorrect ? '✓ CORRECT' : '✕ INCORRECT'}
                    </span>
                    <span className="feedback-points">
                      {item.isCorrect ? `+${item.pointsAwarded} PTS` : '0 PTS'}
                    </span>
                  </div>
                  
                  <div className="feedback-question">
                    <strong>Q{index + 1}:</strong> {question?.questionText}
                  </div>

                  {!item.isCorrect && (
                    <div className="feedback-correct-answer">
                      <strong>Correct Answer:</strong> {item.correctAnswer}
                    </div>
                  )}

                  <div className="feedback-explanation">
                    <strong>Explanation:</strong> {item.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="result-actions">
          <Link to="/dashboard" className="btn btn-primary btn-large">
            [ RETURN TO DASHBOARD ]
          </Link>
          <Link to="/missions" className="btn btn-outline btn-large">
            [ BROWSE MISSIONS ]
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MissionResult;
