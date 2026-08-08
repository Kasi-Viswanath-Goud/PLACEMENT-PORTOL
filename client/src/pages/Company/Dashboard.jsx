import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, Users, CheckCircle2, AlertCircle, Plus, 
  Search, Building2, MapPin, Sparkles, ChevronRight, MessageSquare
} from 'lucide-react';

export const Dashboard = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Filter jobs posted by this company
        const myJobs = data.filter(j => j.companyId === user.id || j.companyName === user.companyName);
        setJobs(myJobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicantCount || 0), 0);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* 1. Large Welcoming Recruiter Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3b82f6 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 3rem',
        color: '#fff',
        marginBottom: '2rem',
        boxShadow: '0 8px 30px rgba(99, 102, 241, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', right: '100px', bottom: '-80px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: 'rgba(255, 255, 255, 0.15)', 
            padding: '0.3rem 0.8rem', 
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1rem',
            backdropFilter: 'blur(4px)'
          }}>
            <Sparkles size={12} /> Recruiter Hub Active
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            Welcome back, {user?.name || 'Recruiter'}.
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '650px', lineHeight: '1.5' }}>
            You have <strong style={{ textDecoration: 'underline' }}>{jobs.length} active jobs</strong> and <strong style={{ textDecoration: 'underline' }}>{totalApplicants} candidates</strong> currently awaiting review. Post roles and connect with top candidates.
          </p>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        
        {/* Metric 1 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} />
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Active Job Postings
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {jobs.length.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{totalApplicants > 0 ? 'REVIEW PENDING' : 'ON TRACK'}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Total Applicants
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {totalApplicants.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>UPCOMING</span>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Interviews Scheduled
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              12
            </div>
          </div>
        </div>

      </div>

      {/* 3. Quick Actions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div className="grid-3">
          
          <Link to="/post-job" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', transition: 'all 0.2s' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Plus size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Post New Job</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Publish new roles to candidate list</p>
            </div>
          </Link>

          <Link to="/candidates" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', transition: 'all 0.2s' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
              <Search size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Search Candidates</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Filter students by skillsets and CGPA</p>
            </div>
          </Link>

          <Link to="/messages" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', transition: 'all 0.2s' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Instant Chat</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Contact candidates directly</p>
            </div>
          </Link>

        </div>
      </div>

      {/* 4. Split Grid Content */}
      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1.2fr' }}>
        
        {/* Left Side: Recent Job Postings list */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} /> Active Postings
            </h3>
            <Link to="/post-job" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Create New</Link>
          </div>

          {loading ? (
            <div className="flex-center" style={{ height: '200px' }}><div className="spinner"></div></div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
              <Briefcase size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>No jobs posted yet</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Publish your first listing to receive applicant responses.</p>
              <Link to="/post-job" className="btn-primary btn-sm">Post a Job</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.slice(0, 4).map(job => (
                <div key={job._id} style={{ 
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
                      <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{job.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                        <span>CTC: {job.packageCTC} LPA</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                        {job.applicantCount || 0} Candidates
                      </span>
                    </div>
                    <Link to={`/jobs/${job._id}/applicants`} className="btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem' }}>
                      Applicants
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Insights panel */}
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
              <AlertCircle size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>HR Analytics</h3>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Here are current skill matching statistics across your active job drives:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                  <span>SKILL COVERAGE</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>90% Average</span>
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>React & Node developers match</h4>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--warning)' }}>
                  <span>CGPA FILTER</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{'>'}= 7.5 CGPA</span>
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>Matches 82% of batch size</h4>
              </div>
            </div>
          </div>

          <Link to="/candidates" style={{ 
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
            Filter Candidates <ChevronRight size={16} />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
