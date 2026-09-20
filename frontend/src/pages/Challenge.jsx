import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMissionById, submitMission } from '../services/missionService';

const Challenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }

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
      setError('Mission not found or error loading challenge.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option
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
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) {
        return;
      }
    }

    try {
      setSubmitting(true);
      const submissionPayload = Object.keys(answers).map(qId => ({
        questionId: qId,
        answer: answers[qId]
      }));

      const response = await submitMission(id, submissionPayload);
      
      // Pass the result data via state to the result page to avoid re-fetching or leaking
      navigate(`/missions/${id}/result`, { state: { resultData: response.data, mission } });
    } catch (err) {
      setError(err.message || 'Error submitting mission.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Initializing Cyber Environment...</p>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  const currentQuestion = mission.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / mission.questions.length) * 100;

  return (
    <div className="cybershield-container">
      <div className="challenge-interface">
        <div className="challenge-header">
          <div className="challenge-title-area">
            <span className="mission-id-badge">MISSION {id.substring(id.length - 4).toUpperCase()}</span>
            <h2>{mission.title.toUpperCase()}</h2>
          </div>
          
          <div className="challenge-progress-container">
            <div className="progress-text">
              QUESTION {currentQuestionIndex + 1} OF {mission.questions.length}
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="question-container">
          <div className="question-text">
            {currentQuestion.questionText}
          </div>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion._id] === option;
              return (
                <div 
                  key={index} 
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(currentQuestion._id, option)}
                >
                  <div className="option-indicator">
                    {isSelected ? '■' : '□'}
                  </div>
                  <div className="option-text">{option}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="challenge-footer">
          <button 
            className="btn btn-outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            [ PREVIOUS ]
          </button>
          
          {currentQuestionIndex === mission.questions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? '[ SUBMITTING... ]' : '[ SUBMIT REPORT ]'}
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
