"use client";

import React, { useEffect, useState } from 'react';

type JarvisState = 'idle' | 'thinking' | 'speaking';

export default function JarvisAvatar({ state }: { state: JarvisState }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (state === 'speaking' || state === 'thinking') {
      const interval = setInterval(() => {
        setPulse(p => !p);
      }, state === 'thinking' ? 500 : 200);
      return () => clearInterval(interval);
    }
  }, [state]);

  const innerColor = state === 'thinking' ? '#8b5cf6' : (state === 'speaking' ? '#10b981' : '#6366f1');
  const outerGlow = state === 'thinking' ? 'rgba(139, 92, 246, 0.4)' : (state === 'speaking' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.2)');

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      padding: '2rem', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-lg)', 
      border: '1px solid var(--border-color)', marginBottom: '1.5rem',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `radial-gradient(circle, ${outerGlow} 0%, transparent 70%)`,
        opacity: pulse ? 0.8 : 0.4,
        transition: 'opacity 0.3s ease',
        zIndex: 0
      }} />

      {/* Robot Eye / Core */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: '#111827',
        border: `3px solid ${innerColor}`,
        boxShadow: `0 0 20px ${outerGlow}, inset 0 0 10px ${outerGlow}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1,
        transition: 'all 0.3s ease',
        transform: state === 'speaking' && pulse ? 'scale(1.05)' : 'scale(1)'
      }}>
        <div style={{
          width: state === 'idle' ? '40px' : (pulse ? '50px' : '30px'),
          height: state === 'idle' ? '10px' : (pulse ? '40px' : '20px'),
          background: innerColor,
          borderRadius: state === 'idle' ? '10px' : '50%',
          transition: 'all 0.2s ease',
          boxShadow: `0 0 15px ${innerColor}`
        }} />
      </div>

      <h3 style={{ 
        marginTop: '1rem', zIndex: 1, color: 'var(--text-primary)', 
        fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase',
        fontSize: '1rem', opacity: 0.9
      }}>
        J.A.R.V.I.S.
      </h3>
      <p style={{ zIndex: 1, color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem', fontFamily: 'monospace' }}>
        {state === 'idle' ? 'AWAITING INPUT' : (state === 'thinking' ? 'PROCESSING...' : 'TRANSMITTING')}
      </p>
    </div>
  );
}
