import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Building2, Plus, Trash2 } from 'lucide-react';

export const ActivePostings = () => {
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

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Active Postings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage your published job listings and view applicants.
          </p>
        </div>
        <Link to="/post-job" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Posting
        </Link>
      </div>

      {/* Summary stat */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Briefcase size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Total Active Jobs
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {jobs.length}
          </div>
        </div>
      </div>

      {/* Job listings */}
      {loading ? (
        <div className="flex-center" style={{ height: '300px' }}><div className="spinner"></div></div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Briefcase size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No active postings</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Create your first job listing to start receiving applications from candidates.
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
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {job.applicantCount || 0} Candidates
                </span>
                <Link 
                  to={`/jobs/${job._id}/applicants`}
                  className="btn-secondary btn-sm" 
                  style={{ padding: '0.4rem 0.85rem', textDecoration: 'none' }}
                >
                  Applicants
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
  );
};

export default ActivePostings;
