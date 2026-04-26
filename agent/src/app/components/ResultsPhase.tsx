"use client";

import { useState, useEffect } from "react";
import { Loader2, Award, CheckCircle, AlertTriangle, BookOpen, Clock, ExternalLink, Download, LayoutDashboard } from "lucide-react";

// Simple custom Radar Chart component using SVG
function RadarChart({ scores }: { scores: Record<string, number> }) {
  const categories = Object.keys(scores);
  const data = Object.values(scores);
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (Math.PI * 2) / categories.length;

  const points = data.map((score, i) => {
    const r = (score / 100) * radius;
    const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
    const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
    return `${x},${y}`;
  }).join(" ");

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {gridLevels.map(level => (
          <polygon
            key={level}
            points={categories.map((_, i) => {
              const r = level * radius;
              const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
              const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        {/* Category Lines */}
        {categories.map((cat, i) => {
          const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
          return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" />;
        })}
        {/* Labels */}
        {categories.map((cat, i) => {
          const x = center + (radius + 25) * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + (radius + 25) * Math.sin(i * angleStep - Math.PI / 2);
          return (
            <text key={i} x={x} y={y} fill="var(--text-secondary)" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">
              {cat}
            </text>
          );
        })}
        {/* Data Polygon */}
        <polygon
          points={points}
          fill="rgba(99, 102, 241, 0.3)"
          stroke="var(--accent-color)"
          strokeWidth="2"
        />
        {/* Data Points */}
        {data.map((score, i) => {
          const r = (score / 100) * radius;
          const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
          return <circle key={i} cx={x} cy={y} r="4" fill="var(--accent-color)" />;
        })}
      </svg>
    </div>
  );
}

export default function ResultsPhase({ chatHistory, skills, atsScore }: { chatHistory: any[], skills: string[], atsScore: number }) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history: chatHistory, skills, atsScore }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setResults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [chatHistory, skills, atsScore]);

  const handleDownloadReport = () => {
    const reportContent = `INTERVIEW ASSESSMENT REPORT\n\nOverall Score: ${results.overallScore}/100\nInterview Score: ${results.interviewScore}/100\nATS Score: ${atsScore}/100\n\nSUMMARY:\n${results.summary}\n\nSKILLS ANALYSIS:\n${results.skillsAnalysis.map((s: any) => `- ${s.skill}: ${s.proficiency}\n  Feedback: ${s.feedback}`).join('\n\n')}\n\nLEARNING PLAN:\n${results.learningPlan.map((l: any) => `- ${l.topic} (${l.estimatedTime})\n  ${l.description}`).join('\n\n')}`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jarvis_Assessment_Report.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="glass-card slide-up" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="pulse" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
          <LayoutDashboard size={40} />
        </div>
        <h2 className="text-gradient">Generating Talent Intelligence</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Jarvis is compiling your categorical proficiency and learning roadmap...</p>
      </div>
    );
  }

  if (error) return <div className="glass-card slide-up"><AlertTriangle size={48} style={{ color: 'var(--error-color)' }} /><h3>Evaluation Failed</h3><p>{error}</p></div>;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      {/* Top Header Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
        <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Award size={28} /> Performance Profile
          </h2>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{results.overallScore}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall IQ</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-color)' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)' }}>{results.interviewScore}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Interview</div>
            </div>
             <div style={{ width: '1px', background: 'var(--border-color)' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success-color)' }}>{atsScore}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>ATS Score</div>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{results.summary}</p>
          <button className="btn-secondary" onClick={handleDownloadReport} style={{ alignSelf: 'flex-start', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Download Detailed Report
          </button>
        </div>

        {/* Radar Chart Panel */}
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Skill Proficiency Matrix</h4>
          {results.categoricalScores && <RadarChart scores={results.categoricalScores} />}
        </div>
      </div>

      {/* Gap Analysis */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Technical Proficiency Gaps</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {results.skillsAnalysis.map((skill: any, idx: number) => (
            <div key={idx} className="glass-card" style={{ borderLeft: `4px solid ${skill.hasGap ? 'var(--warning-color)' : 'var(--success-color)'}`, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{skill.skill}</h4>
                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: skill.hasGap ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: skill.hasGap ? 'var(--warning-color)' : 'var(--success-color)', fontWeight: 700 }}>{skill.proficiency}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{skill.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Plan */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(0,0,0,0) 100%)' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={24} className="text-gradient" /> Personalised Upskilling Roadmap
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {results.learningPlan.map((plan: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, color: 'var(--accent-color)', border: '1px solid var(--border-color)' }}>{idx + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{plan.topic}</h4>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}><Clock size={14} /> {plan.estimatedTime}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>{plan.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {plan.resources.map((res: any, rIdx: number) => (
                    <a key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer" className="glass-panel" style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem', color: 'var(--accent-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      {res.name} <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <button className="btn-primary" onClick={() => window.location.reload()}>Re-initiate Assessment Sequence</button>
      </div>
    </div>
  );
}
