import React, { useState } from 'react';
import Timeline from '../Timeline';

const NetworkSimulation = ({ data, evidence, decisions, setDecisions, onSubmit, submitting }) => {
  const [view, setView] = useState('list');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleAlertClick = (itemId) => {
    setSelectedItemId(itemId);
    setView('details');
  };

  const handleDecision = (decisionValue) => {
    setDecisions(prev => ({
      ...prev,
      [selectedItemId]: decisionValue
    }));
    setView('list');
    setSelectedItemId(null);
  };

  const allCompleted = Object.keys(decisions).length === data.length;

  return (
    <>
      {view === 'list' && (
        <>
          {evidence && evidence.length > 0 && (
            <Timeline events={evidence} />
          )}
          <div className="simulation-list-view" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr 80px 100px 120px', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
            <div>Source IP</div>
            <div>Dest IP</div>
            <div>Port</div>
            <div>Severity</div>
            <div style={{ textAlign: 'right' }}>Status</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.map(alert => {
              const decision = decisions[alert.id];
              return (
                <div 
                  key={alert.id}
                  onClick={() => handleAlertClick(alert.id)}
                  style={{ 
                    padding: '1rem', 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 80px 100px 120px', 
                    gap: '1rem', 
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: decision ? 'rgba(0,0,0,0.2)' : 'transparent',
                    opacity: decision ? 0.7 : 1,
                    transition: 'background 0.2s',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { if (!decision) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={(e) => { if (!decision) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{alert.sourceIp}</div>
                  <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{alert.destIp}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{alert.port}</div>
                  <div style={{ 
                    color: alert.severity === 'Critical' ? 'var(--accent-red)' : 
                           alert.severity === 'High' ? '#f59e0b' : 
                           'var(--text-secondary)' 
                  }}>
                    {alert.severity}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {decision ? (
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                        {decision.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                        UNRESOLVED
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
            {allCompleted ? (
              <div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Investigation Complete</p>
                <button 
                  onClick={onSubmit} 
                  disabled={submitting}
                  className="btn btn-primary" 
                  style={{ padding: '0.75rem 3rem', fontSize: '1.1rem' }}
                >
                  {submitting ? 'ANALYZING...' : '[ SUBMIT INVESTIGATION ]'}
                </button>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Review all network alerts to complete the investigation.</p>
            )}
          </div>
        </div>
        </>
      )}

      {view === 'details' && selectedItemId && (
        <div className="simulation-details-view" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={() => { setView('list'); setSelectedItemId(null); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}
            >
              ← Back to Alerts List
            </button>
            
            {(() => {
              const alert = data.find(a => a.id === selectedItemId);
              return (
                <>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', marginTop: 0 }}>Alert Investigation: {alert.id}</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '1.05rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '4px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Source IP:</span>
                      <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{alert.sourceIp}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Destination IP:</span>
                      <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{alert.destIp}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Port & Protocol:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{alert.port} / {alert.protocol}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Failed Attempts:</span>
                      <span style={{ color: alert.failedAttempts > 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{alert.failedAttempts}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Frequency:</span>
                      <span style={{ color: alert.frequency === 'High' || alert.frequency === 'Very High' ? 'var(--accent-red)' : 'var(--text-primary)' }}>{alert.frequency}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Summary:</span>
                      <span style={{ color: 'var(--text-primary)', maxWidth: '60%', textAlign: 'right' }}>{alert.summary}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleDecision('allow')} className="btn btn-outline" style={{ borderColor: '#4ade80', color: '#4ade80' }}>✓ ALLOW</button>
            <button onClick={() => handleDecision('monitor')} className="btn btn-outline" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>👀 MONITOR</button>
            <button onClick={() => handleDecision('block_source')} className="btn btn-outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>🚫 BLOCK SOURCE</button>
            <button onClick={() => handleDecision('escalate_incident')} className="btn btn-primary" style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>⚠️ ESCALATE INCIDENT</button>
          </div>

        </div>
      )}
    </>
  );
};

export default NetworkSimulation;
