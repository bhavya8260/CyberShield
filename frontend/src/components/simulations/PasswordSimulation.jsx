import React, { useState } from 'react';

const PasswordSimulation = ({ data, decisions, setDecisions, onSubmit, submitting }) => {
  const [view, setView] = useState('list');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleAccountClick = (itemId) => {
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
        <div className="simulation-list-view" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
            <div>Employee</div>
            <div>Department</div>
            <div style={{ textAlign: 'right' }}>Status</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.map(account => {
              const decision = decisions[account.id];
              return (
                <div 
                  key={account.id}
                  onClick={() => handleAccountClick(account.id)}
                  style={{ 
                    padding: '1rem', 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 120px', 
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
                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{account.employee}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{account.department}</div>
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
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Review all accounts to complete the investigation.</p>
            )}
          </div>
        </div>
      )}

      {view === 'details' && selectedItemId && (
        <div className="simulation-details-view" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={() => { setView('list'); setSelectedItemId(null); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}
            >
              ← Back to Accounts List
            </button>
            
            {(() => {
              const account = data.find(a => a.id === selectedItemId);
              return (
                <>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', marginTop: 0 }}>Account Investigation: {account.employee}</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '1.05rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '4px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Department:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{account.department}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Password Strength:</span>
                      <span style={{ color: account.passwordStrength === 'Weak' ? 'var(--accent-red)' : 'var(--text-primary)', fontWeight: 'bold' }}>{account.passwordStrength}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Password Reuse Detected:</span>
                      <span style={{ color: account.passwordReuse ? 'var(--accent-red)' : 'var(--text-primary)' }}>{account.passwordReuse ? 'Yes' : 'No'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>MFA Enabled:</span>
                      <span style={{ color: account.mfaEnabled ? '#4ade80' : 'var(--accent-red)' }}>{account.mfaEnabled ? 'Yes' : 'No'}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Previous Breach Exposure:</span>
                      <span style={{ color: account.previousBreach !== 'None' ? 'var(--accent-red)' : 'var(--text-primary)' }}>{account.previousBreach}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Last Password Change:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{account.lastPasswordChange}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleDecision('flag_account')} className="btn btn-outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>⚠️ FLAG ACCOUNT</button>
            <button onClick={() => handleDecision('force_password_reset')} className="btn btn-primary" style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>🔄 FORCE PASSWORD RESET</button>
            <button onClick={() => handleDecision('enable_mfa')} className="btn btn-outline" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>🔐 ENABLE MFA</button>
            <button onClick={() => handleDecision('mark_as_secure')} className="btn btn-outline" style={{ borderColor: '#4ade80', color: '#4ade80' }}>✓ MARK AS SECURE</button>
            <button onClick={() => handleDecision('ignore')} className="btn btn-outline">IGNORE</button>
          </div>

        </div>
      )}
    </>
  );
};

export default PasswordSimulation;
