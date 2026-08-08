import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Download, Star, BrainCircuit } from 'lucide-react';

export const ResumeBuilder = () => {
  const { user, token } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/student/resume', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
      // Call AI analysis after upload
      analyzeResume(data.resumeUrl);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload resume.' });
    } finally {
      setUploading(false);
    }
  };

  const analyzeResume = async (resumeUrl) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/student/analyze-resume', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ resumeUrl, targetRole: 'Software Engineer' })
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <BrainCircuit size={36} color="var(--accent-primary)" /> AI Resume Builder
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Upload your resume for AI-powered ATS scoring, or use our builder to create a highly optimized resume from scratch.
        </p>
      </div>

      <div className="grid-2">
        
        {/* Left Column: Upload & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Upload Existing Resume</h3>
            
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)', marginBottom: '1.5rem', transition: 'border-color 0.2s ease' }}>
              <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>{file ? file.name : 'Select PDF or DOCX file'}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Max file size: 10MB</p>
              
              <input 
                type="file" 
                id="resume-upload" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              <label htmlFor="resume-upload" className="btn-secondary" style={{ cursor: 'pointer' }}>
                Browse Files
              </label>
            </div>

            {message.text && (
              <div style={{ background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}

            <button className="btn-primary" style={{ width: '100%' }} onClick={handleUpload} disabled={uploading || !file}>
              {uploading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : <UploadCloud size={18} />}
              {uploading ? 'Uploading & Analyzing...' : 'Upload & Analyze Resume'}
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))', borderColor: 'var(--accent-primary)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Or Create from Scratch</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Use our intelligent builder that automatically pulls data from your profile and formats it to beat Applicant Tracking Systems (ATS).
            </p>
            <button className="btn-primary" style={{ width: '100%' }}>
              <Star size={18} /> Start Resume Builder
            </button>
          </div>

        </div>

        {/* Right Column: AI Analysis Results */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BrainCircuit size={20} color="var(--accent-secondary)" /> AI Analysis Report
          </h3>
          
          {analyzing ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--accent-secondary)' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Parsing text and calculating ATS score...</p>
            </div>
          ) : analysisResult ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Score Circular Progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--bg-secondary)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={analysisResult.score > 75 ? "var(--success)" : "var(--warning)"} strokeWidth="3" strokeDasharray={`${analysisResult.score}, 100`} />
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{analysisResult.score}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ATS Score</div>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {analysisResult.score > 80 ? 'Excellent Match!' : analysisResult.score > 60 ? 'Needs Improvement' : 'Critical Fixes Required'}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Your resume formats well but lacks specific quantifiable metrics in the experience section.
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--warning)' }}>Top Suggestions to Improve:</h4>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {analysisResult.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Skill Gaps */}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--danger)' }}>Skill Gaps Detected:</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {analysisResult.skillGaps.map((s, i) => (
                    <span key={i} style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--success)' }}>Key Strengths:</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {analysisResult.strengths.map((s, i) => (
                    <span key={i} style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <BrainCircuit size={32} color="var(--text-muted)" />
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>Upload your resume to receive a detailed AI analysis on ATS compatibility, skill gaps, and actionable improvement suggestions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;
