import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, DollarSign, Clock, Building2, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const JobDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasApplied, setHasApplied] = useState(false);
  
  // AI Cover Letter State
  const [coverLetter, setCoverLetter] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
      }
      if (user && user.role === 'student') {
        const appsRes = await fetch('/api/applications/my-applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (appsRes.ok) {
          const apps = await appsRes.json();
          if (apps.some(a => a.jobId._id === id || a.jobId === id)) {
            setHasApplied(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!user) return navigate('/login');
    setGenerating(true);
    try {
      const res = await fetch('/api/student/generate-cover-letter', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          jobTitle: job.title,
          companyName: job.companyName,
          skills: user.skills || []
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCoverLetter(data.coverLetter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ jobId: id, coverLetter })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      setMessage({ type: 'success', text: 'Successfully applied for this job!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to apply.' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}><div className="spinner"></div></div>;
  if (!job) return <div className="container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>Job not found</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px' }}>
      
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      {message.text && (
        <div style={{ background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Header Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
            <Building2 size={40} color="var(--text-muted)" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{job.title}</h1>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{job.companyName}</div>
            
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> {job.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Briefcase size={16} /> {job.experienceRequired}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><DollarSign size={16} /> {job.packageCTC} LPA</span>
            </div>
          </div>
        </div>

        {(!user || user.role === 'student') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px' }}>
            <button className="btn-primary" onClick={handleApply} disabled={applying || message.type === 'success' || hasApplied || message.text === 'Already applied.'}>
              {applying ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : <Send size={18} />}
              {applying ? 'Applying...' : (message.type === 'success' || hasApplied || message.text === 'Already applied.') ? 'Applied' : 'Apply Now'}
            </button>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Job Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', marginTop: '2rem' }}>Responsibilities</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.responsibilities}</p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', marginTop: '2rem' }}>Required Skills</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {job.requiredSkills.map((skill, i) => (
                <span key={i} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 500, border: '1px solid rgba(99,102,241,0.2)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI Cover Letter Generator */}
          {(!user || user.role === 'student') && !message.type && (
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--accent-primary)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-gradient">✨ AI Cover Letter Generator</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Generate a highly personalized cover letter tailored to this specific job description and your profile skills.
              </p>
              
              {!coverLetter ? (
                <button className="btn-secondary" onClick={handleGenerateCoverLetter} disabled={generating}>
                  {generating ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : 'Generate Cover Letter'}
                </button>
              ) : (
                <div>
                  <textarea 
                    className="form-textarea" 
                    rows="8" 
                    value={coverLetter} 
                    onChange={(e) => setCoverLetter(e.target.value)}
                    style={{ marginBottom: '1rem', fontFamily: 'monospace' }}
                  ></textarea>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Feel free to edit the generated cover letter before applying. It will be sent automatically when you click "Apply Now".
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Eligibility Criteria</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--text-muted)' }}><GraduationCap size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Allowed Branches</div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{job.allowedBranches.join(', ')}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--text-muted)' }}><CheckCircle2 size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Minimum CGPA</div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{job.minCGPA} & above</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--text-muted)' }}><Clock size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Passing Year</div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{job.passingYear}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Job Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Job Type</span>
                <span style={{ fontWeight: 500 }}>{job.jobType}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Work Mode</span>
                <span style={{ fontWeight: 500 }}>{job.workMode}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Vacancies</span>
                <span style={{ fontWeight: 500 }}>{job.vacancies}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Posted</span>
                <span style={{ fontWeight: 500 }}>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default JobDetails;
