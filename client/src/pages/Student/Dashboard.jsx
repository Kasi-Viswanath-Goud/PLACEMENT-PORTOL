import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, Calendar, CheckCircle, Eye, Download, MoreHorizontal, ArrowRight, UserCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

// Dummy sparkline data
const dataPurple = [{v: 10}, {v: 12}, {v: 11}, {v: 15}, {v: 14}, {v: 18}, {v: 22}];
const dataBlue = [{v: 5}, {v: 6}, {v: 6}, {v: 8}, {v: 7}, {v: 9}, {v: 12}];
const dataGreen = [{v: 1}, {v: 1}, {v: 2}, {v: 2}, {v: 3}, {v: 3}, {v: 4}];
const dataOrange = [{v: 30}, {v: 32}, {v: 35}, {v: 40}, {v: 38}, {v: 45}, {v: 48}];

export default function Dashboard() {
  const { user, token } = useAuth();
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

  const activeAppsCount = applications.filter(a => !['Rejected', 'Offer Declined'].includes(a.status)).length;
  const interviews = applications.filter(a => a.status === 'Interview Scheduled');
  const offers = applications.filter(a => a.status === 'Selected').length;

  // Pie chart data
  const appliedCount = applications.filter(a => a.status === 'Applied').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = interviews.length;
  const offeredCount = offers;
  
  const totalApps = applications.length || 1;
  const pieData = [
    { name: 'Applied', value: appliedCount, color: '#3b82f6' }, // blue
    { name: 'Shortlisted', value: shortlistedCount, color: '#a855f7' }, // purple
    { name: 'Interview', value: interviewCount, color: '#f59e0b' }, // orange
    { name: 'Offered', value: offeredCount, color: '#10b981' }, // green
  ].filter(d => d.value > 0);

  // If no data, show a dummy ring
  const displayPieData = pieData.length > 0 ? pieData : [{ name: 'None', value: 1, color: '#2d334a' }];

  const cardStyle = {
    background: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Welcome back, {user?.name || 'Student'} <span style={{fontSize: '1.5rem'}}>👋</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Let's find your dream opportunity today!</p>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Active Applications */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Applications</span>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <Briefcase size={16} color="#a855f7" />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{activeAppsCount}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              ↑ 20% <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>this week</span>
            </div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataPurple}>
                  <Line type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Interviews Scheduled */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Interviews Scheduled</span>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <Calendar size={16} color="#3b82f6" />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{interviews.length}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              ↑ 50% <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>this week</span>
            </div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataBlue}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Offers Received */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Offers Received</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <CheckCircle size={16} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{offers}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              ↑ 100% <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>this week</span>
            </div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataGreen}>
                  <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Profile Views */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Profile Views</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '6px', borderRadius: '8px' }}>
              <Eye size={16} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{user?.profileViews || 48}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              ↑ 25% <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>this week</span>
            </div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataOrange}>
                  <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Grid (Overview, Interviews, Activity) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.5fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Application Overview Donut Chart */}
        <div style={cardStyle}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Application Overview</span>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ width: '140px', height: '140px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayPieData}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {displayPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{totalApps}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total</span>
              </div>
            </div>
            
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginLeft: 'auto' }}>
              {[
                { label: 'Applied', val: appliedCount, pct: Math.round((appliedCount/totalApps)*100), color: '#3b82f6' },
                { label: 'Shortlisted', val: shortlistedCount, pct: Math.round((shortlistedCount/totalApps)*100), color: '#a855f7' },
                { label: 'Interview', val: interviewCount, pct: Math.round((interviewCount/totalApps)*100), color: '#f59e0b' },
                { label: 'Offered', val: offeredCount, pct: Math.round((offeredCount/totalApps)*100), color: '#10b981' }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, marginRight: '8px' }}></span>
                  <span style={{ color: 'var(--text-secondary)', width: '60px' }}>{item.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, marginLeft: '10px' }}>{item.val}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>({item.pct || 0}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Upcoming Interviews</span>
            <MoreHorizontal size={18} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            {interviews.length > 0 ? interviews.slice(0,2).map((app, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{app.jobId?.companyName || 'Company'} Interview</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{app.jobId?.title || 'Software Engineer'}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {app.interviewDate ? new Date(app.interviewDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'}
                  </p>
                </div>
                <span style={{ 
                  background: idx === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                  color: idx === 0 ? '#3b82f6' : '#10b981', 
                  fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 
                }}>
                  {idx === 0 ? 'Priority' : 'Normal'}
                </span>
              </div>
            )) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>No Interviews Yet</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Keep applying to land one!</p>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '1rem' }}>
            <Link to="/history" style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              View All
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Activity</span>
            <MoreHorizontal size={18} color="var(--text-muted)" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', flex: 1, paddingLeft: '1rem' }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', left: '1rem', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)' }}></div>
            
            {applications.slice(0, 2).map((app, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  marginLeft: '-16px', zIndex: 2
                }}>
                  <Briefcase size={14} color="#10b981" />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Applied to {app.jobId?.title || 'Job'}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.jobId?.companyName || 'Company'}</p>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.15)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                marginLeft: '-16px', zIndex: 2
              }}>
                <UserCheck size={14} color="#a855f7" />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Profile Updated</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your profile was updated successfully</p>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                14 Aug 2026
              </div>
            </div>

          </div>
          <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '1rem' }}>
            <Link to="/history" style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              View All
            </Link>
          </div>
        </div>
      </div>


    </div>
  );
}
