import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Target, LogOut, Sun, Moon, Bell, MessageSquare, Menu, X, User, GraduationCap } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on auth pages if we want them to be full screen, or we can just simplify it
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        
        {/* Brand */}
        <Link to={user ? `/${user.role}-dashboard` : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
          <img src="/logo.png" alt="ALTS Logo" style={{ 
            height: '40px', 
            objectFit: 'contain', 
            marginRight: '0.5rem'
          }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: '#ef4444', letterSpacing: '-0.02em', lineHeight: 1 }}>
              ALTS
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', letterSpacing: '0.05em', marginTop: '2px', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              Placement Portal
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          
          {user && !isAuthPage && (
            <nav className="desktop-nav" style={{ display: 'flex', gap: '0.5rem', marginRight: '1rem' }}>
              <Link to="/jobs" className={`btn-secondary btn-sm ${location.pathname.includes('/jobs') ? 'active' : ''}`}>Find Jobs</Link>
              {user.role === 'student' && (
                <>
                  <Link to="/student-dashboard" className={`btn-secondary btn-sm ${location.pathname === '/student-dashboard' ? 'active' : ''}`}>Dashboard</Link>
                  <Link to="/profile" className={`btn-secondary btn-sm ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
                </>
              )}
              {user.role === 'company' && (
                <Link to="/company-dashboard" className={`btn-secondary btn-sm ${location.pathname === '/company-dashboard' ? 'active' : ''}`}>Recruiter Hub</Link>
              )}
            </nav>
          )}

          {/* Tools & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Theme Toggle */}
            <button className="btn-secondary btn-sm" onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%' }} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <Link to="/messages" className="btn-secondary btn-sm" style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }} title="Messages">
                  <MessageSquare size={18} />
                </Link>

                <Link to="/notifications" className="btn-secondary btn-sm" style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }} title="Notifications">
                  <Bell size={18} />
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
                  <div className="user-info" style={{ textAlign: 'right', display: 'none' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user.role}</div>
                  </div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                  </div>
                  <button className="btn-secondary btn-sm" onClick={logout} style={{ padding: '0.5rem' }} title="Logout">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : !isAuthPage ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn-secondary btn-sm">Log In</Link>
                <Link to="/register" className="btn-primary btn-sm">Sign Up</Link>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
