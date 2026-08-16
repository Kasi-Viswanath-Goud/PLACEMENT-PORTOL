import React from 'react';
import { GraduationCap, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      padding: '4rem 2rem 2rem'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '28px' }}>
                <img src="/logo.png" alt="ALTS Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: '#ef4444' }}>
                ALTS
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', marginBottom: '1.5rem' }}>
              The most advanced AI-powered campus placement platform connecting talented students with top global enterprises.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-muted)' }}><Twitter size={20} /></a>
              <a href="#" style={{ color: 'var(--text-muted)' }}><Linkedin size={20} /></a>
              <a href="#" style={{ color: 'var(--text-muted)' }}><Github size={20} /></a>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1.25rem' }}>For Students</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/jobs" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Browse Jobs</Link>
              <Link to="/resume-builder" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Resume Builder</Link>
              <Link to="/portfolio" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Create Portfolio</Link>
              <Link to="/companies" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Company Profiles</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1.25rem' }}>For Companies</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/register?role=company" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Post a Job</Link>
              <Link to="/candidates" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Search Candidates</Link>
              <Link to="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pricing & Plans</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1.25rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>About Us</Link>
              <Link to="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Contact & Support</Link>
              <Link to="/privacy" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Terms of Service</Link>
            </div>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <div>&copy; {new Date().getFullYear()} ALTS. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Built with <Heart size={14} color="var(--danger)" /> by Antigravity
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
