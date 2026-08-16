import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, CheckCircle2, XCircle, Clock, Search, MapPin, Building2, Briefcase, FileText, X, Send, MessageSquare, Eye, Mail, Phone, Github, Linkedin, Globe } from 'lucide-react';

export const ApplicantsList = () => {
  const { id: jobId } = useParams();
  const { token, user: currentUser } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resume viewer modal state
  const [resumeModal, setResumeModal] = useState({ open: false, url: '', name: '' });

  // Message modal state
  const [messageModal, setMessageModal] = useState({ open: false, applicant: null });
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Profile modal state
  const [profileModal, setProfileModal] = useState({ open: false, applicant: null });

  // Interview Schedule modal state
  const [scheduleModal, setScheduleModal] = useState({ open: false, applicantId: null, date: '', time: '' });

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        fetch(`/api/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/applications/job/${jobId}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (jobRes.ok) setJob(await jobRes.json());
      if (appsRes.ok) setApplicants(await appsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus, interviewDate, interviewTime) => {
    try {
      const payload = { status: newStatus };
      if (interviewDate) payload.interviewDate = interviewDate;
      if (interviewTime) payload.interviewTime = interviewTime;

      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setApplicants(applicants.map(a => a._id === appId ? { ...a, status: newStatus, interviewDate, interviewTime } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    if (newStatus === 'Interview Scheduled') {
      setScheduleModal({ open: true, applicantId: appId, date: '', time: '' });
    } else {
      updateStatus(appId, newStatus);
    }
  };

  const confirmSchedule = () => {
    if (scheduleModal.applicantId && scheduleModal.date && scheduleModal.time) {
      updateStatus(scheduleModal.applicantId, 'Interview Scheduled', scheduleModal.date, scheduleModal.time);
      setScheduleModal({ open: false, applicantId: null, date: '', time: '' });
    }
  };

  const openResume = (url, name) => {
    setResumeModal({ open: true, url, name: name || 'Resume' });
  };

  const closeResume = () => {
    setResumeModal({ open: false, url: '', name: '' });
  };

  const openMessage = (applicant) => {
    setMessageModal({ open: true, applicant });
    setMessageText('');
    setMessageSent(false);
  };

  const closeMessage = () => {
    setMessageModal({ open: false, applicant: null });
    setMessageText('');
    setMessageSent(false);
  };

  const openProfile = (applicant) => {
    setProfileModal({ open: true, applicant });
  };

  const closeProfile = () => {
    setProfileModal({ open: false, applicant: null });
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !messageModal.applicant) return;
    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: messageModal.applicant.studentId?._id || messageModal.applicant.studentId,
          content: messageText.trim(),
          type: 'text'
        })
      });
      if (res.ok) {
        setMessageSent(true);
        setMessageText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}><div className="spinner"></div></div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/company-dashboard" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Applicants for {job?.title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review and manage candidates who have applied for this role.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }}></div> Total: {applicants.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div> Selected: {applicants.filter(a => a.status === 'Selected').length}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <input type="text" placeholder="Search applicants..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
        </div>

        {applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <User size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Applicants Yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Candidates will appear here once they apply to this job.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Candidate</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Applied On</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Current Status</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(app => (
                  <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {app.studentId?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{app.studentId?.name || 'Unknown'}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CGPA: {app.studentId?.cgpa || 'N/A'} • {app.studentId?.branch || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${app.status === 'Applied' ? 'badge-primary' : app.status === 'Selected' ? 'badge-success' : app.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                        {app.status}
                      </span>
                      {app.status === 'Interview Scheduled' && app.interviewDate && app.interviewTime && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {new Date(app.interviewDate).toLocaleDateString()} {app.interviewTime}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <select 
                          className="form-select" 
                          style={{ padding: '0.4rem 1rem', width: 'auto', fontSize: '0.85rem' }}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlist</option>
                          <option value="Interview Scheduled">Schedule Interview</option>
                          <option value="Selected">Select Candidate</option>
                          <option value="Rejected">Reject</option>
                        </select>
                        {app.studentId?.resumeUrl && (
                          <button 
                            onClick={() => openResume(app.studentId.resumeUrl, app.studentId?.resumeOriginalName || `${app.studentId?.name || 'Applicant'}'s Resume`)}
                            className="btn-primary btn-sm" 
                            title="View Resume"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}
                          >
                            <Eye size={14} /> Resume
                          </button>
                        )}
                        <button 
                          onClick={() => openMessage(app)}
                          className="btn-secondary btn-sm" 
                          title="Message Applicant"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}
                        >
                          <MessageSquare size={14} /> Message
                        </button>
                        <button onClick={() => openProfile(app)} className="btn-secondary btn-sm" title="View Full Profile">Profile</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* Resume Viewer Modal — Opens PDF/Doc inline without downloading */}
      {/* ═══════════════════════════════════════════════════════════════ */}
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
          onClick={closeResume}
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
                  onClick={closeResume} 
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

            {/* PDF/Document Viewer */}
            <div style={{ flex: 1, background: '#525659', position: 'relative' }}>
              <iframe
                src={(resumeModal.url.toLowerCase().endsWith('.docx') || resumeModal.url.toLowerCase().endsWith('.doc')) ? `${resumeModal.url}?view=html` : resumeModal.url}
                title="Resume Viewer"
                style={{
                  width: '100%', height: '100%', border: 'none',
                  background: '#fff'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Message Modal — Send a message to an applicant            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {messageModal.open && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={closeMessage}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg, 16px)',
              width: '100%', maxWidth: '520px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '1rem'
                }}>
                  {messageModal.applicant?.studentId?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>Message {messageModal.applicant?.studentId?.name || 'Applicant'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {messageModal.applicant?.studentId?.branch || ''} {messageModal.applicant?.studentId?.branch ? '•' : ''} {messageModal.applicant?.studentId?.email || ''}
                  </div>
                </div>
              </div>
              <button 
                onClick={closeMessage} 
                style={{ 
                  background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  width: '36px', height: '36px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Templates */}
            <div style={{ padding: '1rem 1.5rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                `We'd like to schedule an interview.`,
                `Congratulations! You've been shortlisted.`,
                `Please share additional documents.`
              ].map((tmpl, i) => (
                <button 
                  key={i}
                  onClick={() => setMessageText(tmpl)}
                  style={{
                    padding: '0.35rem 0.75rem', fontSize: '0.75rem',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    borderRadius: '9999px', color: 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tmpl}
                </button>
              ))}
            </div>

            {/* Message Body */}
            <div style={{ padding: '1rem 1.5rem' }}>
              {messageSent ? (
                <div style={{
                  textAlign: 'center', padding: '2rem 1rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem'
                }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={28} color="var(--success)" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Message Sent!</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Your message has been delivered to {messageModal.applicant?.studentId?.name || 'the applicant'}.
                  </div>
                  <button onClick={closeMessage} className="btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Write a message to ${messageModal.applicant?.studentId?.name || 'the applicant'}...`}
                    style={{
                      width: '100%', minHeight: '130px', resize: 'vertical',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm, 8px)', padding: '1rem',
                      color: 'var(--text-primary)', fontSize: '0.95rem',
                      outline: 'none', fontFamily: 'inherit',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    autoFocus
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                    <button 
                      onClick={closeMessage} 
                      className="btn-secondary btn-sm"
                      style={{ padding: '0.5rem 1.25rem' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={sendMessage}
                      disabled={!messageText.trim() || sendingMessage}
                      className="btn-primary btn-sm"
                      style={{ 
                        padding: '0.5rem 1.5rem', 
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        opacity: !messageText.trim() || sendingMessage ? 0.5 : 1,
                        cursor: !messageText.trim() || sendingMessage ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Send size={14} />
                      {sendingMessage ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Profile Modal — View Full Applicant Details                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {profileModal.open && profileModal.applicant && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={closeProfile}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg, 16px)',
              width: '100%', maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '1.2rem'
                }}>
                  {profileModal.applicant.studentId?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{profileModal.applicant.studentId?.name || 'Applicant'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {profileModal.applicant.studentId?.headline || `${profileModal.applicant.studentId?.degree || ''} in ${profileModal.applicant.studentId?.branch || ''}`}
                  </div>
                </div>
              </div>
              <button 
                onClick={closeProfile} 
                style={{ 
                  background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  width: '36px', height: '36px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Contact & Basics */}
              <div className="grid-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <Mail size={16} /> 
                  {profileModal.applicant.studentId?.email ? (
                    <a href={`mailto:${profileModal.applicant.studentId.email}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                      {profileModal.applicant.studentId.email}
                    </a>
                  ) : 'N/A'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <Phone size={16} /> {profileModal.applicant.studentId?.phone || 'N/A'}
                </div>
                {profileModal.applicant.studentId?.github && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <Github size={16} /> <a href={profileModal.applicant.studentId.github} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>GitHub Profile</a>
                  </div>
                )}
                {profileModal.applicant.studentId?.linkedin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <Linkedin size={16} /> <a href={profileModal.applicant.studentId.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>LinkedIn Profile</a>
                  </div>
                )}
                {profileModal.applicant.studentId?.portfolio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <Globe size={16} /> <a href={profileModal.applicant.studentId.portfolio} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Portfolio Website</a>
                  </div>
                )}
              </div>

              {/* Education */}
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Education</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>{profileModal.applicant.studentId?.college || 'University'}</span>
                    <span>Class of {profileModal.applicant.studentId?.passingYear || ''}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {profileModal.applicant.studentId?.degree || ''} in {profileModal.applicant.studentId?.branch || ''}
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                    CGPA: {profileModal.applicant.studentId?.cgpa || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Technical Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profileModal.applicant.studentId?.skills?.length > 0 ? (
                    profileModal.applicant.studentId.skills.map((skill, idx) => (
                      <span key={idx} className="badge badge-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>{skill}</span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>No skills listed.</span>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Projects & Demos</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {profileModal.applicant.studentId?.projects?.length > 0 ? (
                    profileModal.applicant.studentId.projects.map((proj, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{proj.title}</span>
                          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                            {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Globe size={14} /> Demo</a>}
                            {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Github size={14} /> Code</a>}
                          </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{proj.description}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {proj.techStack?.map((tech, i) => (
                            <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tech}</span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>No projects listed.</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Schedule Interview Modal                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {scheduleModal.open && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setScheduleModal({ open: false, applicantId: null, date: '', time: '' })}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg, 16px)',
              width: '100%', maxWidth: '400px',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Schedule Interview</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Select a date and time for the interview. The applicant will be notified.
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Date</label>
              <input 
                type="date" 
                className="form-input"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                value={scheduleModal.date}
                onChange={(e) => setScheduleModal({ ...scheduleModal, date: e.target.value })}
                onClick={(e) => { try { e.target.showPicker(); } catch (err) {} }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Time</label>
              <input 
                type="time" 
                className="form-input"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                value={scheduleModal.time}
                onChange={(e) => setScheduleModal({ ...scheduleModal, time: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                onClick={() => setScheduleModal({ open: false, applicantId: null, date: '', time: '' })} 
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmSchedule} 
                className="btn-primary"
                disabled={!scheduleModal.date || !scheduleModal.time}
                style={{ padding: '0.5rem 1rem', opacity: (!scheduleModal.date || !scheduleModal.time) ? 0.5 : 1 }}
              >
                Confirm Schedule
              </button>
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

export default ApplicantsList;
