import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, Users, CheckCircle2, AlertCircle, Plus, 
  Search, Building2, MapPin, Sparkles, ChevronRight, MessageSquare, Trash2, Eye
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

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicantCount || 0), 0);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      {/* 2. Stats Grid */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        
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

        {/* Metric 2: (Removed Total Applicants) */}

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

          <Link to="/active-postings" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', transition: 'all 0.2s' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
              <Eye size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Active Postings</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>View posted jobs & manage applicants</p>
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

      {/* 4. Your Job Postings — Direct applicant access */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Your Job Postings
          </h3>
          <Link to="/active-postings" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: '200px' }}><div className="spinner"></div></div>
        ) : jobs.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <Briefcase size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>No jobs posted yet</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Post your first job to start receiving applications from students.
            </p>
            <Link to="/post-job" className="btn-primary">Post a Job</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {jobs.map(job => (
              <div key={job._id} className="glass-card" style={{ 
                padding: '1.25rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={20} color="var(--text-muted)" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{job.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      <span>CTC: {job.packageCTC} LPA</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.jobType}</span>
                      {job.deadline && (
                        <>
                          <span>•</span>
                          <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link 
                    to={`/jobs/${job._id}/applicants`}
                    className="btn-primary btn-sm" 
                    style={{ padding: '0.4rem 0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Users size={14} /> View Applicants
                  </Link>
                  <button 
                    onClick={() => handleDelete(job._id)}
                    style={{ 
                      background: 'none', border: 'none', color: 'var(--text-muted)', 
                      cursor: 'pointer', padding: '0.4rem', borderRadius: 'var(--radius-sm)',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    title="Delete posting"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. HR Analytics Panel */}
      <div style={{
        background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(99,102,241,0.2)',
        padding: '1.5rem',
        color: '#fff',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={20} color="#a855f7" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>HR Analytics</h3>
          </div>
          
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
            Here are current skill matching statistics across your active job drives:
          </p>

          <div className="grid-2" style={{ gap: '0.85rem' }}>
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
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{'>'} = 7.5 CGPA</span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>Matches 82% of batch size</h4>
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

