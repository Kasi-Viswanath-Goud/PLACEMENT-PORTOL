import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutGrid, Search, User, FileText, Award, MessageSquare, 
  Bell, Plus, Users, LogOut, Sun, Moon, Settings, Compass, ChevronRight, Clock, X
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [hasNewAlert, setHasNewAlert] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [latestJob, setLatestJob] = useState(null);

  useEffect(() => {
    if (user?.role === 'student') {
      const fetchLatestJob = async () => {
        try {
          const res = await fetch('/api/jobs');
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              setLatestJob(data[0]);
              // Show notification if not seen this session
              if (!sessionStorage.getItem('hasSeenJobPopup')) {
                setTimeout(() => {
                  setHasNewAlert(true);
                  setTimeout(() => setShowDropdown(true), 1200); // unfold card after bell shakes
                }, 2000);
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchLatestJob();
    }
  }, [user]);

  const handleDismissPopup = () => {
    setShowDropdown(false);
    sessionStorage.setItem('hasSeenJobPopup', 'true');
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/student-dashboard') return ['Home', 'Student Dashboard'];
    if (path === '/company-dashboard') return ['Home', 'Recruiter Hub'];
    if (path === '/profile') return ['Home', 'My Profile'];
    if (path === '/resume-builder') return ['Home', 'Resume Builder'];
    if (path === '/portfolio') return ['Home', 'Portfolio Builder'];
    if (path === '/jobs') return ['Home', 'Find Jobs'];
    if (path.startsWith('/jobs/') && path.endsWith('/applicants')) return ['Home', 'Applicants List'];
    if (path.startsWith('/jobs/')) return ['Home', 'Job Details'];
    if (path === '/post-job') return ['Home', 'Post a Job'];
    if (path === '/messages') return ['Home', 'Messages'];
    if (path === '/notifications') return ['Home', 'Notifications'];
    if (path === '/candidates') return ['Home', 'Candidate Search'];
    return ['Home', 'Dashboard Overview'];
  };

  const breadcrumbs = getBreadcrumbs();

  const studentLinks = [
    { to: '/student-dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { to: '/jobs', label: 'Find Jobs', icon: <Compass size={18} /> },
    { to: '/history', label: 'History', icon: <Clock size={18} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={18} /> },
    { to: '/resume-builder', label: 'Resume Builder', icon: <FileText size={18} /> },
    { to: '/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell size={18} />, badge: true },
  ];

  const companyLinks = [
    { to: '/company-dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { to: '/post-job', label: 'Post a Job', icon: <Plus size={18} /> },
    { to: '/candidates', label: 'Search Candidates', icon: <Users size={18} /> },
    { to: '/jobs', label: 'View Jobs', icon: <Compass size={18} /> },
    { to: '/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell size={18} />, badge: true },
  ];

  const links = user?.role === 'company' ? companyLinks : studentLinks;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Sidebar Panel */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        padding: '1.5rem 1rem'
      }}>
        {/* Brand/Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <img src="/alts_logo_v2.png" alt="ALTS Logo" style={{ 
            height: '56px', 
            objectFit: 'contain', 
            filter: theme === 'dark' ? 'brightness(1.8) contrast(1.1)' : 'none',
            transition: 'filter 0.3s ease',
            marginRight: '0.25rem'
          }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: '#B31B1B', letterSpacing: '-0.02em', lineHeight: 1 }}>
              ALTS
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', letterSpacing: '0.05em', marginTop: '2px', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              Placement Portal
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {links.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                boxShadow: isActive ? 'var(--accent-glow)' : 'none',
                transition: 'all 0.25s ease'
              })}
            >
              {link.icon}
              <span style={{ flex: 1 }}>{link.label}</span>
              {link.badge && (
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  background: 'var(--danger)', 
                  borderRadius: '50%' 
                }} />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom User Account Card */}
        {user && (
          <div style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            padding: '0.85rem', 
            borderRadius: 'var(--radius-lg)',
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {/* Avatar */}
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'var(--accent-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#fff', 
              fontWeight: 600,
              flexShrink: 0
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
            </div>
            
            {/* Info details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: 700, 
                fontSize: '0.85rem', 
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user.name}
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                color: 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}>
                {user.role === 'company' ? 'Recruiter' : user.role}
              </div>
            </div>

            {/* Logout button */}
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Right Content Wrap */}
      <div style={{ 
        flex: 1, 
        marginLeft: '260px', 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0
      }}>
        
        {/* Top Header bar */}
        <header style={{
          height: '70px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          {/* Breadcrumbs Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} color="var(--text-muted)" />}
                <span style={{ color: idx === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Search bar Center */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--bg-primary)', 
            padding: '0.4rem 1rem', 
            borderRadius: '9999px', 
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '320px',
            gap: '0.5rem'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search jobs, classes, tools..." 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-primary)', 
                fontSize: '0.85rem', 
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          {/* User Tools Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Notification trigger with animation */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  if (hasNewAlert) setHasNewAlert(false);
                }}
                className={hasNewAlert ? 'animate-bell' : ''}
                style={{ 
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.45rem', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
                title="Notifications"
              >
                <Bell size={16} />
                {(hasNewAlert || showDropdown) && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-2px', 
                    right: '-2px', 
                    width: '8px', 
                    height: '8px', 
                    background: 'var(--danger)', 
                    borderRadius: '50%' 
                  }} />
                )}
              </div>

              {/* Unfolding Notification Card */}
              {showDropdown && latestJob && (
                <div 
                  className="animate-unfold"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 16px)',
                    right: '-10px',
                    width: '320px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg, 16px)',
                    padding: '1.25rem',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                    zIndex: 50,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      New job posted
                    </h4>
                    <button 
                      onClick={handleDismissPopup}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-muted)', 
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {latestJob.companyName} — {latestJob.title}.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      color: '#10B981', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: '500' 
                    }}>
                      {latestJob.packageCTC} LPA
                    </span>
                    <span style={{ 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      color: '#3B82F6', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: '500' 
                    }}>
                      CGPA {latestJob.minCGPA}+
                    </span>
                  </div>
                  <div style={{ marginTop: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <Link to={`/jobs/${latestJob._id}`} onClick={handleDismissPopup} style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '600' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Messages trigger */}
            <Link 
              to="/messages" 
              style={{ 
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.45rem', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)'
              }}
              title="Messages"
            >
              <MessageSquare size={16} />
            </Link>

            {/* Theme trigger */}
            <button 
              onClick={toggleTheme}
              style={{ 
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.45rem', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Content Render viewport */}
        <main style={{ flex: 1, position: 'relative' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
