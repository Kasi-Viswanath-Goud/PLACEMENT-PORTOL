import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Monitor, Palette, Globe, Save, Layout, Eye, CheckCircle2 } from 'lucide-react';

export const PortfolioBuilder = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    heroTagline: user?.portfolioData?.heroTagline || 'Building the future of the web.',
    aboutMe: user?.portfolioData?.aboutMe || user?.summary || '',
    themeColor: user?.portfolioData?.themeColor || '#6366F1',
    isPublic: user?.portfolioData?.isPublic || true
  });
  const [saved, setSaved] = useState(false);

  const colors = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // API Call goes here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Portfolio Builder</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Design and publish your personal portfolio website in minutes.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary"><Eye size={18} /> Live Preview</button>
          <button className="btn-primary" onClick={handleSave}>
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />} 
            {saved ? 'Saved!' : 'Save & Publish'}
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* Left Sidebar: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layout size={18} color="var(--accent-primary)" /> Basic Configuration
            </h3>
            
            <div className="form-group">
              <label className="form-label">Hero Tagline</label>
              <input type="text" name="heroTagline" className="form-input" value={formData.heroTagline} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">About Me Text</label>
              <textarea name="aboutMe" className="form-textarea" rows="4" value={formData.aboutMe} onChange={handleChange}></textarea>
            </div>

            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <div>
                <label className="form-label" style={{ marginBottom: 0 }}>Public Visibility</label>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allow recruiters to view</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: formData.isPublic ? 'var(--accent-primary)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '34px', transition: '.4s' }}>
                  <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: formData.isPublic ? '22px' : '4px', bottom: '3px', backgroundColor: '#fff', borderRadius: '50%', transition: '.4s' }}></span>
                </span>
              </label>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={18} color="var(--accent-primary)" /> Theme Color
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {colors.map(color => (
                <button 
                  key={color}
                  onClick={() => setFormData({ ...formData, themeColor: color })}
                  style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', background: color, border: 'none', cursor: 'pointer',
                    boxShadow: formData.themeColor === color ? `0 0 0 3px var(--bg-primary), 0 0 0 5px ${color}` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.3)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--success)' }}>
              <Globe size={18} /> Portfolio Link
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Share this link in your resume or social profiles.
            </p>
            <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
              elevo.com/p/{user?.name?.toLowerCase().replace(/\s+/g, '') || 'username'}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Live Preview Fake Window */}
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Browser Chrome */}
          <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'var(--bg-primary)', borderRadius: '4px', fontSize: '0.75rem', padding: '0.25rem', color: 'var(--text-muted)' }}>
              elevo.com/p/{user?.name?.toLowerCase().replace(/\s+/g, '') || 'username'}
            </div>
          </div>

          {/* Website Canvas */}
          <div style={{ flex: 1, background: '#ffffff', color: '#1f2937', overflowY: 'auto', maxHeight: '600px' }}>
            
            {/* Nav */}
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: formData.themeColor }}>{user?.name?.split(' ')[0] || 'Portfolio'}.</div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', fontWeight: 500 }}>
                <span>About</span><span>Experience</span><span>Projects</span>
              </div>
            </div>

            {/* Hero */}
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: `${formData.themeColor}10` }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: formData.themeColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, margin: '0 auto 1.5rem' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Hi, I'm {user?.name || 'User'}</h1>
              <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '600px', margin: '0 auto 2rem' }}>{formData.heroTagline}</p>
              <button style={{ background: formData.themeColor, color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 600, fontSize: '1rem' }}>
                Contact Me
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: formData.themeColor }}>About Me</h2>
              <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '2rem' }}>
                {formData.aboutMe || "I am a passionate professional looking to solve complex problems and build great products."}
              </p>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: formData.themeColor }}>Skills</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(user?.skills || ['JavaScript', 'React', 'Node.js']).map((s, i) => (
                  <span key={i} style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PortfolioBuilder;
