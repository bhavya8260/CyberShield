import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMissionById, submitMission } from '../services/missionService';

const CATEGORY_MAP = {
  'phishing': 'Phishing Defense',
  'password': 'Password Security',
  'network': 'Network Defense',
  'malware': 'Malware Investigation',
  'incident-response': 'Incident Response'
};

const Challenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionValue }

  useEffect(() => {
    fetchMission();
  }, [id]);

  const fetchMission = async () => {
    try {
      setLoading(true);
      const response = await getMissionById(id);
      setMission(response.data);
      setError(null);
    } catch (err) {
      setError('Mission not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionValue) => {
    setValidationError('');
    setAnswers({
      ...answers,
      [questionId]: optionValue
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < mission.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < mission.questions.length) {
      setValidationError('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const submissionPayload = Object.keys(answers).map(qId => ({
        questionId: qId,
        answer: answers[qId]
      }));

      const response = await submitMission(id, submissionPayload);
      
      // Pass the result data via state to the result page
      navigate(`/missions/${id}/result`, { state: { resultData: response.data, mission } });
    } catch (err) {
      setValidationError('Unable to submit your answers.\nPlease try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading challenge...</p>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="error-message" style={{ textAlign: 'center', padding: '4rem', color: 'var(--accent-red)' }}>
        {error}
      </div>
    );
  }

  const currentQuestion = mission.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / mission.questions.length) * 100;

  return (
    <div className="cybershield-container" style={{ padding: '4rem 2rem' }}>
      <div className="challenge-interface" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '3rem' }}>
        
        <div className="challenge-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div className="challenge-title-area" style={{ marginBottom: '2rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
              {CATEGORY_MAP[mission.category] || mission.category}
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{mission.title}</h2>
          </div>
          
          <div className="challenge-progress-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="progress-text" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Question {currentQuestionIndex + 1} of {mission.questions.length}
            </div>
            <div className="progress-bar-bg" style={{ background: 'var(--border-subtle)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercentage}%`, background: 'var(--accent-cyan)', height: '100%', transition: 'width 0.3s ease' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="question-container" style={{ marginBottom: '3rem' }}>
          <div className="question-text" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: '1.6' }}>
            {currentQuestion.questionText}
          </div>

          <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion._id] === option.value;
              return (
                <div 
                  key={index} 
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(currentQuestion._id, option.value)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '6px',
                    border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    background: isSelected ? 'rgba(0, 217, 255, 0.05)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <div className="option-indicator" style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    border: `2px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></div>}
                  </div>
                  <div className="option-text" style={{ flex: 1, lineHeight: '1.5' }}>{option.text}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {validationError && (
          <div style={{ color: 'var(--accent-red)', textAlign: 'center', marginBottom: '2rem', fontWeight: 'bold', whiteSpace: 'pre-line' }}>
            {validationError}
          </div>
        )}

        <div className="challenge-footer" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{ visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible' }}
          >
            [ PREVIOUS ]
          </button>
          
          {currentQuestionIndex === mission.questions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'SUBMIT MISSION'}
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
            >
              [ NEXT ]
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenge;
