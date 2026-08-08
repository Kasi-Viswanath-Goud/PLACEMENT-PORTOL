import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Briefcase, User, CheckCircle2, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Notifications = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setNotifications(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'job_posted': return <Briefcase size={20} />;
      case 'profile_view': return <User size={20} />;
      case 'application_update': return <CheckCircle2 size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'job_posted': return 'var(--info)';
      case 'profile_view': return 'var(--accent-primary)';
      case 'application_update': return 'var(--success)';
      default: return 'var(--warning)';
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '800px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell size={28} color="var(--accent-primary)" /> Notifications
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Stay updated on your placement journey.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button className="btn-secondary btn-sm" onClick={markAllAsRead}>Mark all as read</button>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '0.5rem' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <Bell size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p>You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map(n => (
              <div 
                key={n._id} 
                style={{ 
                  padding: '1.5rem', 
                  borderBottom: '1px solid var(--border-color)', 
                  background: n.isRead ? 'transparent' : 'rgba(99,102,241,0.05)',
                  display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                  transition: 'background 0.2s ease'
                }}
                onClick={() => !n.isRead && markAsRead(n._id)}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${getIconColor(n.type)}20`, color: getIconColor(n.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getIcon(n.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: n.isRead ? 'var(--text-primary)' : 'var(--accent-primary)' }}>
                      {n.title}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  
                  {n.link && (
                    <Link to={n.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--info)' }}>
                      View Details <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
                
                {!n.isRead && (
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0, marginTop: '0.5rem' }}></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
