import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
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

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Applied Jobs History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track all your past and current job applications in one place.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {loading ? (
          <div className="flex-center" style={{ height: '300px' }}><div className="spinner"></div></div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem' }} />
            <h3>No Application History Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              You haven't applied to any jobs yet. Browse available jobs and start applying.
            </p>
            <Link to="/jobs" className="btn-primary">Find Jobs</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map(app => (
              <div key={app._id} style={{ 
                background: 'var(--bg-secondary)', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '48px', height: '48px', 
                    borderRadius: '12px', background: 'var(--bg-primary)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-color)'
                  }}>
                    <Building2 size={24} color="var(--text-muted)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      <Link to={`/jobs/${app.jobId?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {app.jobId?.title || 'Job Role'}
                      </Link>
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{app.jobId?.companyName || 'Company'}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Calendar size={12}/> Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ 
                    color: getStatusColor(app.status), 
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    background: `${getStatusColor(app.status)}15`, 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '9999px',
                    border: `1px solid ${getStatusColor(app.status)}30`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    {app.status === 'Selected' && <CheckCircle2 size={14}/>}
                    {app.status}
                  </span>
                  
                  {app.status === 'Interview Scheduled' && app.interviewDate && app.interviewTime && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', background: 'var(--bg-primary)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '0.25rem' }}>
                      <Calendar size={12} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />
                      <strong style={{ verticalAlign: 'middle' }}>{new Date(app.interviewDate).toLocaleDateString()} at {app.interviewTime}</strong>
                    </div>
                  )}


                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
