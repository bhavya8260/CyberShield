import React, { useState } from 'react';
import Timeline from '../Timeline';

const IncidentResponseSimulation = ({ data, evidence, decisions, setDecisions, onSubmit, submitting }) => {
  // data is an array of stages, sorted by ID or logically by index.
  // The user must progress linearly through the stages.
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const currentStage = data[currentStageIndex];
  
  const handleDecision = (decisionValue) => {
    setDecisions(prev => ({
      ...prev,
      [currentStage.id]: decisionValue
    }));
    
    // Move to next stage, or submit if last
    if (currentStageIndex < data.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const allCompleted = Object.keys(decisions).length === data.length;

  return (
    <div>
      {evidence && evidence.length > 0 && (
        <Timeline events={evidence} />
      )}
      <div className="simulation-wizard-view" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
        {data.map((stage, index) => {
          const isCompleted = decisions[stage.id] !== undefined;
          const isActive = index === currentStageIndex;
          return (
            <div 
              key={stage.id} 
              style={{ 
                flex: 1, 
                padding: '1rem', 
                textAlign: 'center', 
                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: isCompleted ? '#4ade80' : isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
            >
              {stage.title}
            </div>
          );
        })}
      </div>

      {!allCompleted ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Stage Details */}
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', marginTop: 0 }}>{currentStage.title}</h2>
            
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '2rem' }}>
              {currentStage.description}
            </p>

            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Evidence / Telemetry</h3>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '4px', border: '1px dashed var(--border-subtle)' }}>
              <ul style={{ color: 'var(--text-primary)', margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                {currentStage.evidence.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions specific to the stage */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)' }}>
            {currentStage.id.includes('detect') && (
              <>
                <button onClick={() => handleDecision('ignore')} className="btn btn-outline">IGNORE</button>
                <button onClick={() => handleDecision('monitor')} className="btn btn-outline" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>👀 MONITOR ONLY</button>
                <button onClick={() => handleDecision('investigate')} className="btn btn-primary" style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>🔍 INVESTIGATE</button>
              </>
            )}
            
            {currentStage.id.includes('analyze') && (
              <>
                <button onClick={() => handleDecision('log_activity')} className="btn btn-outline">LOG ACTIVITY</button>
                <button onClick={() => handleDecision('escalate')} className="btn btn-primary" style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>⚠️ ESCALATE TO CONTAINMENT</button>
              </>
            )}

            {currentStage.id.includes('contain') && (
              <>
                <button onClick={() => handleDecision('shutdown_server')} className="btn btn-outline">SHUTDOWN SERVER</button>
                <button onClick={() => handleDecision('isolate_system')} className="btn btn-primary" style={{ background: '#f59e0b', borderColor: '#f59e0b' }}>🚫 ISOLATE FROM NETWORK</button>
              </>
            )}

            {currentStage.id.includes('eradicate') && (
              <>
                <button onClick={() => handleDecision('delete_malware')} className="btn btn-outline">DELETE MALWARE FILES</button>
                <button onClick={() => handleDecision('reset_credentials')} className="btn btn-primary" style={{ background: '#f59e0b', borderColor: '#f59e0b' }}>🔄 RESET ALL ADMIN CREDENTIALS</button>
              </>
            )}

            {currentStage.id.includes('recover') && (
              <>
                <button onClick={() => handleDecision('reboot_server')} className="btn btn-outline">REBOOT SERVER</button>
                <button onClick={() => handleDecision('restore_service')} className="btn btn-outline" style={{ borderColor: '#4ade80', color: '#4ade80' }}>✓ RESTORE SERVICE & MONITOR</button>
              </>
            )}

            {currentStage.id.includes('review') && (
              <>
                <button onClick={() => handleDecision('fire_employee')} className="btn btn-outline" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>FIRE RESPONSIBLE EMPLOYEE</button>
                <button onClick={() => handleDecision('close_incident')} className="btn btn-primary" style={{ background: '#4ade80', borderColor: '#4ade80', color: '#000' }}>📋 FILE REPORT & CLOSE</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Incident Response Procedures Completed</p>
          <button 
            onClick={onSubmit} 
            disabled={submitting}
            className="btn btn-primary" 
            style={{ padding: '1rem 4rem', fontSize: '1.2rem' }}
          >
            {submitting ? 'GENERATING INCIDENT REPORT...' : '[ SUBMIT RESPONSE ]'}
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default IncidentResponseSimulation;
