import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, FileText, CheckCircle2, Clock, MapPin, Award, 
  TrendingUp, Zap, Building2, Calendar, Star, User, Sparkles, ChevronRight, X
} from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedCount, setRecommendedCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [latestJob, setLatestJob] = useState(null);

  useEffect(() => {
    fetchApplications();
    fetchRecommendedJobs();
  }, [token]);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setLatestJob(data[0]); // newest job is at index 0
        }
        // Match jobs based on student skills
        const studentSkills = user?.skills || [];
        const matchedJobs = data.map(job => {
          const required = job.requiredSkills || [];
          const matchCount = required.filter(skill => 
            studentSkills.some(s => s.toLowerCase().trim() === skill.toLowerCase().trim())
          ).length;
          const matchPercentage = required.length > 0 ? Math.round((matchCount / required.length) * 100) : 0;
          return { ...job, matchPercentage };
        }).sort((a, b) => b.matchPercentage - a.matchPercentage);

        const validMatches = matchedJobs.filter(j => j.matchPercentage > 0);
        setRecommendedJobs(validMatches.length > 0 ? validMatches.slice(0, 2) : matchedJobs.slice(0, 2));
        setRecommendedCount(validMatches.length > 0 ? validMatches.length : 6); // Fallback to 6 if no matches
      }
    } catch (err) {
      console.error(err);
      setRecommendedCount(6);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'var(--info)';
      case 'Shortlisted': return 'var(--accent-primary)';
      case 'Interview Scheduled': return 'var(--warning)';
      case 'Selected': case 'Offer Accepted': return 'var(--success)';
      case 'Rejected': case 'Offer Declined': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  const interviewCount = applications.filter(a => a.status === 'Interview Scheduled').length;
  const resumeScore = user?.resumeScore || 75;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', position: 'relative' }}>
      
      {/* Welcome Banner removed as per request (replaced by bell notifications) */}

      {/* 2. Stats & Metric Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        
        {/* Metric 1 - Jobs Applied → History */}
        <Link to="/history" className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} style={{ alignSelf: 'center' }} />
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>+{applications.filter(a => a.status === 'Applied').length} Active</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Jobs Applied
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              {applications.length.toString().padStart(2, '0')}
              <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>↑ {applications.length > 0 ? Math.round((applications.length / 10) * 100) : 0}%</span>
            </div>
          </div>
        </Link>

        {/* Metric 2 - Resume Score → Resume Builder */}
        <Link to="/resume-builder" className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(239,68,68,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} style={{ alignSelf: 'center' }} />
            </div>
            <span className="badge" style={{ background: resumeScore >= 80 ? 'var(--success-bg)' : 'var(--warning-bg)', color: resumeScore >= 80 ? 'var(--success)' : 'var(--warning)', fontSize: '0.65rem' }}>
              {resumeScore >= 80 ? 'OPTIMIZED' : 'NEEDS WORK'}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Resume Score (ATS)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              {resumeScore}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
            </div>
          </div>
        </Link>

        {/* Metric 3 - Scheduled Interviews → History (filtered) */}
        <Link to="/history" className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(245,158,11,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} style={{ alignSelf: 'center' }} />
            </div>
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>{interviewCount > 0 ? 'HIGH PRIORITY' : 'ALL CLEAR'}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Scheduled Interviews
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {interviewCount.toString().padStart(2, '0')}
            </div>
          </div>
        </Link>

        {/* Metric 4 - Recommended Placements → Jobs */}
        <Link to="/jobs" className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(16,185,129,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} style={{ alignSelf: 'center' }} />
            </div>
            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Match score {user?.cgpa ? 'Good' : 'Medium'}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Recommended Placements
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {recommendedCount.toString().padStart(2, '0')}
            </div>
          </div>
        </Link>

      </div>

      {/* 3. Quick Actions row */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div className="grid-3">
          
          <Link to="/resume-builder" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', transition: 'all 0.2s' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Generate AI Resume</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Optimize structure, layout and content</p>
            </div>
          </Link>



          <Link to="/jobs" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', transition: 'all 0.2s' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Explore Placements</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Browse hiring drives & apply</p>
            </div>
          </Link>

        </div>
      </div>

      {/* 4. Split Grid Content */}
      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1.2fr' }}>
        
        {/* Left Side: Recent Applications */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} /> Recent Applications
            </h3>
            <Link to="/jobs" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>See All Drives</Link>
          </div>

          {loading ? (
            <div className="flex-center" style={{ height: '200px' }}><div className="spinner"></div></div>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
              <FileText size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>No applications yet</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Start applying to job drives to track your progress.</p>
              <Link to="/jobs" className="btn-primary btn-sm">Find Jobs</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {applications.slice(0, 4).map(app => (
                <div key={app._id} style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '1rem', 
                  border: '1px solid var(--border-color)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={20} color="var(--text-muted)" />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{app.jobId?.title || 'Job Role'}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                        <span>{app.jobId?.companyName || 'Company'}</span>
                        <span>•</span>
                        <span>{app.jobId?.location || 'Remote'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      color: getStatusColor(app.status), 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      background: `${getStatusColor(app.status)}15`, 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '9999px',
                      border: `1px solid ${getStatusColor(app.status)}30`
                    }}>
                      {app.status}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: AI Insights Card (Dark gradient box) */}
        <div style={{
          background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(99,102,241,0.2)',
          padding: '1.5rem',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '340px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Zap size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>AI Insights</h3>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Your profile match rate is optimal. Here are top recommended vacancies tailored to your skillset:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recommendedJobs.length > 0 ? recommendedJobs.map((job, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: job.matchPercentage > 70 ? '#10b981' : '#f59e0b' }}>
                    <span>{job.matchPercentage > 0 ? `${job.matchPercentage}% MATCH` : 'TOP PICK'}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{job.companyName}</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>{job.title}</h4>
                </div>
              )) : (
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontStyle: 'italic', padding: '1rem 0' }}>No matching jobs found right now.</p>
              )}
            </div>
          </div>

          <Link to="/jobs" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            background: 'var(--accent-gradient)',
            border: 'none',
            color: '#fff',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            Explore Matches <ChevronRight size={16} />
          </Link>
        </div>

      </div>

    </div>
  );
}
