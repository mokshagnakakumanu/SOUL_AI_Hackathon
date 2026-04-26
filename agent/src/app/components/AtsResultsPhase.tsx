"use client";

import { Activity, CheckCircle, ChevronRight, FileSearch } from "lucide-react";

export default function AtsResultsPhase({ 
  data, 
  onContinue 
}: { 
  data: any, 
  onContinue: (skills: string[]) => void 
}) {
  return (
    <div className="glass-card slide-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)'
          }}>
            <FileSearch size={32} />
          </div>
        </div>
        <h2 className="text-gradient">ATS Pre-Screening Results</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Analysis of candidate's resume against the provided Job Description.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem', fontWeight: 500 }}>ATS Match Score</h3>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: `conic-gradient(var(--accent-color) ${data.atsScore}%, var(--bg-surface) 0)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-surface)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{data.atsScore}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ 100</span>
            </div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ flex: 1, padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem', fontWeight: 500 }}>Overall Fit</h3>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: `conic-gradient(var(--success-color) ${parseInt(data.fitPercentage)}%, var(--bg-surface) 0)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-surface)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{data.fitPercentage}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--warning-color)' }}>
          <Activity size={20} /> Resume Improvement Suggestions
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: 0, listStyle: 'none' }}>
          {data.suggestions.map((sug: string, idx: number) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle size={18} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ lineHeight: 1.5 }}>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Ready for Interview?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Jarvis will now assess you on the following core skills: <strong style={{ color: 'var(--text-primary)' }}>{data.skillsToVerify.join(", ")}</strong>
        </p>
        <button 
          className="btn-primary" 
          onClick={() => onContinue(data.skillsToVerify)}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          Begin Technical Interview with Jarvis <ChevronRight size={20} />
        </button>
      </div>

    </div>
  );
}
