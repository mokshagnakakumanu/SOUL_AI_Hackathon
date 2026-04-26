"use client";

import { useState } from "react";
import { Upload, FileText, Loader2, FileUp } from "lucide-react";

export default function SetupPhase({ onStart }: { onStart: (data: any) => void }) {
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if ((!jdText && !jdFile) || (!resumeText && !resumeFile)) {
      setError("Please provide both a Job Description and a Resume (either as text or file).");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      if (jdFile) formData.append("jdFile", jdFile);
      if (jdText) formData.append("jd", jdText);
      if (resumeFile) formData.append("resumeFile", resumeFile);
      if (resumeText) formData.append("resume", resumeText);

      const response = await fetch("/api/extract-skills", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to extract skills");
      }

      onStart(data); // Pass ATS data and skills to next phase
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card slide-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>Start Assessment</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Upload or paste the job description and your resume to generate a personalized skill assessment and ATS tracking score.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Job Description Section */}
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
            <FileText size={20} className="text-gradient" /> Job Description
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="file" 
                id="jd-file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setJdFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
              <label htmlFor="jd-file" className="btn-secondary" style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <FileUp size={18} /> {jdFile ? jdFile.name : "Upload JD File (PDF, DOCX)"}
              </label>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>OR</div>
            <textarea 
              className="input-field" 
              placeholder="Paste the job description text here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              style={{ minHeight: '120px' }}
              disabled={!!jdFile}
            />
          </div>
        </div>

        {/* Resume Section */}
        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
            <Upload size={20} className="text-gradient" /> Candidate Resume
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="file" 
                id="resume-file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
              <label htmlFor="resume-file" className="btn-secondary" style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <FileUp size={18} /> {resumeFile ? resumeFile.name : "Upload Resume File (PDF, DOCX)"}
              </label>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>OR</div>
            <textarea 
              className="input-field" 
              placeholder="Paste the resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ minHeight: '120px' }}
              disabled={!!resumeFile}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--error-color)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <button 
          className="btn-primary" 
          onClick={handleStart} 
          disabled={loading || (!jdText && !jdFile) || (!resumeText && !resumeFile)}
          style={{ marginTop: '1rem', width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="spinner" /> Analyzing & Tracking ATS...
            </>
          ) : (
            "Start Assessment"
          )}
        </button>
      </div>
    </div>
  );
}
