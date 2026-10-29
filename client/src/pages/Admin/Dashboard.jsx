import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Building2, Search, Filter, ShieldAlert, Trash2, CheckCircle, XCircle, Eye, FileText, Briefcase, X } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [search, setSearch] = useState('');
  const [pendingHRs, setPendingHRs] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumeModal, setResumeModal] = useState({ open: false, url: '', name: '' });

  const fetchStatsAndUsers = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, pendingRes, appsRes, jobsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/admin/users${search ? `?search=${search}` : ''}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/pending-hr', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/applications/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/jobs', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingHRs(pendingData);
      }

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setAllApps(appsData);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(Array.isArray(jobsData) ? jobsData : jobsData.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndUsers();
  }, [token, search]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveHR = async (id) => {
    try {
      const res = await fetch(`/api/admin/hr/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStatsAndUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineHR = async (id) => {
    if (!window.confirm('Are you sure you want to decline and remove this request?')) return;
    try {
      const res = await fetch(`/api/admin/hr/${id}/decline`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStatsAndUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role === filterRole);

  const cardStyle = {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    padding: '1.5rem',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)'
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
      
      {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              System Administration
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage all users and platform activity</p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={cardStyle}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Students</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalStudents}</h2>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Recruiters</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalCompanies}</h2>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Active Jobs</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalJobs}</h2>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Applications</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalApplications}</h2>
            </div>
          </div>
        )}

        {/* Pending HR Approvals */}
        {pendingHRs && pendingHRs.length > 0 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid #f59e0b', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(245, 158, 11, 0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} /> Pending Recruiter Approvals ({pendingHRs.length})
              </h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>User Name</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Company</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingHRs.map(hr => (
                  <tr key={hr._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                          {hr.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{hr.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{hr.companyName || '-'}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{hr.email}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleApproveHR(hr._id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button onClick={() => handleDeclineHR(hr._id)} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* All Applications — View Resumes */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} color="var(--accent-primary)" /> All Applications & Resumes
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{allApps.length} total applications</span>
          </div>

          {/* Job-wise cards */}
          {jobs.length > 0 && (
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              {jobs.map(job => {
                const jobApps = allApps.filter(a => (a.jobId?._id || a.jobId) === job._id);
                return (
                  <div key={job._id} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{job.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{job.companyName} • {jobApps.length} applicant{jobApps.length !== 1 ? 's' : ''}</div>
                    <Link 
                      to={`/jobs/${job._id}/applicants`} 
                      style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)',
                        textDecoration: 'none'
                      }}
                    >
                      <Eye size={14} /> View Applicants & Resumes
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full applications table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Student</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Job Applied</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Applied On</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Resume</th>
                </tr>
              </thead>
              <tbody>
                {allApps.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  allApps.map(app => (
                    <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 }}>
                            {app.studentId?.name?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{app.studentId?.name || 'Student'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.studentId?.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {app.jobId?.title || 'Position'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600,
                          backgroundColor: app.status === 'Selected' ? 'rgba(16,185,129,0.1)' : app.status === 'Rejected' ? 'rgba(239,68,68,0.1)' : app.status === 'Shortlisted' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                          color: app.status === 'Selected' ? '#10b981' : app.status === 'Rejected' ? '#ef4444' : app.status === 'Shortlisted' ? '#3b82f6' : '#f59e0b'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        {app.studentId?.resumeUrl ? (
                          <button 
                            onClick={() => setResumeModal({ open: true, url: app.studentId.resumeUrl, name: `${app.studentId?.name || 'Student'}'s Resume` })}
                            style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                              background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)',
                              border: '1px solid rgba(99,102,241,0.2)', borderRadius: '6px',
                              padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.2s ease'
                            }}
                          >
                            <Eye size={14} /> View Resume
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No resume</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Management */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Registered Users</h3>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search name or email..." 
                  style={{ paddingLeft: '2.5rem', height: '36px', fontSize: '0.9rem', width: '250px' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select 
                className="form-input" 
                style={{ height: '36px', fontSize: '0.9rem', width: 'auto' }}
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="company">HR / Recruiters</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>User Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Registered</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{user.name}</div>
                            {user.googleId && <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>Google Auth</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '1rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'company' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: user.role === 'admin' ? '#ef4444' : user.role === 'company' ? '#3b82f6' : '#10b981',
                          textTransform: 'capitalize'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {user.role === 'student' && user.resumeUrl && (
                            <button 
                              onClick={() => setResumeModal({ open: true, url: user.resumeUrl, name: `${user.name}'s Resume` })}
                              title="View Resume"
                              style={{ 
                                background: 'none', border: 'none', color: 'var(--accent-primary)', 
                                cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600
                              }}
                            >
                              <FileText size={16} /> Resume
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(user._id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </div>

      {/* Resume Viewer Modal */}
      {resumeModal.open && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setResumeModal({ open: false, url: '', name: '' })}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg, 16px)',
              width: '100%', maxWidth: '900px',
              height: '85vh',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FileText size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{resumeModal.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Document Viewer</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <a 
                  href={resumeModal.url} 
                  download 
                  className="btn-secondary btn-sm"
                  style={{ textDecoration: 'none', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                  title="Download Resume"
                >
                  Download
                </a>
                <button 
                  onClick={() => setResumeModal({ open: false, url: '', name: '' })} 
                  style={{ 
                    background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)', cursor: 'pointer',
                    width: '36px', height: '36px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div style={{ flex: 1, background: '#525659', position: 'relative' }}>
              <iframe
                src={resumeModal.url}
                title="Resume Viewer"
                style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
