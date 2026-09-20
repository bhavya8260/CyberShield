import React, { useState } from 'react';

const Timeline = ({ events, onSelectEvent }) => {
  return (
    <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Investigation Timeline</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {events && events.map((event, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ minWidth: '80px', color: 'var(--accent-cyan)', fontSize: '0.85rem', paddingTop: '0.2rem' }}>
              {event.timestamp}
            </div>
            <div style={{ flex: 1, borderLeft: '2px solid var(--border-subtle)', paddingLeft: '1rem', paddingBottom: '1rem' }}>
              <div 
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  padding: '0.75rem', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  transition: 'border-color 0.2s ease'
                }}
                onClick={() => onSelectEvent(event)}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{event.title}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{event.type}</p>
              </div>
            </div>
          </div>
        ))}
        {(!events || events.length === 0) && (
          <p style={{ color: 'var(--text-secondary)' }}>No timeline events available.</p>
        )}
      </div>
    </div>
  );
};

export default Timeline;
