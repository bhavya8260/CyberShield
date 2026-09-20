import React, { useState } from 'react';

const PhishingSimulation = ({ data, decisions, setDecisions, onSubmit, submitting }) => {
  const [view, setView] = useState('inbox');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleEmailClick = (itemId) => {
    setSelectedItemId(itemId);
    setView('email');
  };

  const handleDecision = (decisionValue) => {
    setDecisions(prev => ({
      ...prev,
      [selectedItemId]: decisionValue
    }));
    setView('inbox');
    setSelectedItemId(null);
  };

  const allCompleted = Object.keys(decisions).length === data.length;

  return (
    <>
      {view === 'inbox' && (
        <div className="inbox-view" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 2fr 100px 120px', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
            <div>Sender</div>
            <div>Subject</div>
            <div>Date</div>
            <div style={{ textAlign: 'right' }}>Status</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.map(email => {
              const decision = decisions[email.id];
              return (
                <div 
                  key={email.id}
                  onClick={() => handleEmailClick(email.id)}
                  style={{ 
                    padding: '1rem', 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 2fr 100px 120px', 
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
                  <div style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email.sender}</div>
                  <div style={{ color: decision ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: decision ? 'normal' : 'bold' }}>{email.subject}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(email.date).toLocaleDateString()}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {decision ? (
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                        {decision.replace('_', ' ').toUpperCase()}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                        UNREAD
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
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Review all emails to complete the investigation.</p>
            )}
          </div>
        </div>
      )}

      {view === 'email' && selectedItemId && (
        <div className="email-view" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={() => { setView('inbox'); setSelectedItemId(null); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}
            >
              ← Back to Inbox
            </button>
            
            {(() => {
              const email = data.find(e => e.id === selectedItemId);
              return (
                <>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', marginTop: 0 }}>{email.subject}</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.5rem', fontSize: '0.95rem' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>From:</div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>
                      {email.sender}
                    </div>
                    
                    <div style={{ color: 'var(--text-secondary)' }}>To:</div>
                    <div style={{ color: 'var(--text-primary)' }}>{email.recipient}</div>
                    
                    <div style={{ color: 'var(--text-secondary)' }}>Date:</div>
                    <div style={{ color: 'var(--text-primary)' }}>{new Date(email.date).toLocaleString()}</div>
                  </div>
                </>
              );
            })()}
          </div>

          <div style={{ padding: '2rem', minHeight: '300px', background: 'rgba(255,255,255,0.02)' }}>
            {(() => {
              const email = data.find(e => e.id === selectedItemId);
              return (
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>
                  {email.body}
                </div>
              );
            })()}
          </div>

          {(() => {
            const email = data.find(e => e.id === selectedItemId);
            if ((email.links && email.links.length > 0) || (email.attachments && email.attachments.length > 0)) {
              return (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                  {email.attachments && email.attachments.length > 0 && (
                    <div style={{ marginBottom: email.links?.length > 0 ? '1.5rem' : '0' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Attachments ({email.attachments.length})</div>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {email.attachments.map((att, idx) => (
                          <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.5rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            📎 {att}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {email.links && email.links.length > 0 && (
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Links in message</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {email.links.map((link, idx) => (
                          <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--accent-red)', padding: '0.5rem 1rem', borderRadius: '4px', color: 'var(--accent-red)', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                            🔗 {link}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }
            return null;
          })()}

          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleDecision('safe')} className="btn btn-outline" style={{ borderColor: '#4ade80', color: '#4ade80' }}>✓ SAFE</button>
            <button onClick={() => handleDecision('ignore')} className="btn btn-outline">IGNORE</button>
            <button onClick={() => handleDecision('delete')} className="btn btn-outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>🗑️ DELETE</button>
            <button onClick={() => handleDecision('report_phishing')} className="btn btn-primary" style={{ background: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>⚠️ REPORT PHISHING</button>
          </div>

        </div>
      )}
    </>
  );
};

export default PhishingSimulation;
