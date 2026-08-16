import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Zap, Users, Building2, Briefcase, Star, CheckCircle, MousePointer2 } from 'lucide-react';
import TubesBackground from '../../components/TubesBackground';

export const LandingPage = () => {
  return (
    <div className="animate-fade-in">
      
      {/* Hero Section — 3D Tubes Interactive Background */}
      <TubesBackground style={{ minHeight: 'calc(100vh - 72px)' }}>
        <section style={{ 
          padding: '6rem 2rem 4rem', 
          textAlign: 'center', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 72px)'
        }}>
          <div style={{ maxWidth: '900px', width: '100%' }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
              background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', 
              padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', 
              fontWeight: 600, marginBottom: '1.5rem', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <Zap size={14} /> AI-Powered Matching Engine Now Live
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              marginBottom: '1.5rem', 
              color: '#fff',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}>
              Accelerate Your Career with{' '}
              <span style={{ 
                color: '#ef4444' 
              }}>ALTS</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'rgba(255,255,255,0.8)', 
              marginBottom: '2.5rem', 
              maxWidth: '700px', 
              margin: '0 auto 2.5rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.4)'
            }}>
              The premier campus placement portal connecting top tier talent with global enterprises through intelligent resume analysis and automated recruitment workflows.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ 
                padding: '1rem 2rem', fontSize: '1.1rem',
                pointerEvents: 'auto'
              }}>
                Create Student Profile <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=company" style={{ 
                padding: '1rem 2rem', fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                pointerEvents: 'auto'
              }}>
                Post a Job (Recruiters)
              </Link>
            </div>

            {/* Hint */}
            <div style={{ 
              marginTop: '3rem', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'rgba(255,255,255,0.4)', 
              animation: 'pulse 2s ease-in-out infinite' 
            }}>
              <MousePointer2 size={20} />
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Move cursor to interact · Click to change colors</span>
            </div>
          </div>
        </section>
      </TubesBackground>

      {/* Global Search Bar Snippet */}
      <section style={{ padding: '4rem 2rem', marginTop: '-2rem', position: 'relative', zIndex: 5 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', borderRadius: '9999px', alignItems: 'center' }}>
            <Search size={24} color="var(--text-muted)" style={{ marginLeft: '1rem' }} />
            <input 
              type="text" 
              placeholder="Search for jobs, companies, or skills..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', outline: 'none' }}
            />
            <Link to="/jobs" className="btn-primary" style={{ borderRadius: '9999px', padding: '0.75rem 2rem' }}>
              Search Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <div className="container grid-4" style={{ textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>15k+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Students Placed</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>500+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Partner Companies</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>98%</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Placement Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>₹14L</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Average Package</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '6rem 2rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Why Choose ALTS?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>An end-to-end placement ecosystem designed to streamline hiring for both students and enterprises.</p>
          </div>
          
          <div className="grid-3">
            <div className="glass-card stagger-1">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>AI Resume Analyzer</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Get instant feedback on your resume. Our AI ATS checker highlights skill gaps and suggests improvements to boost your chances.</p>
            </div>

            <div className="glass-card stagger-2">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Briefcase size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Smart Job Matching</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Stop manual searching. Our algorithm matches your skills, CGPA, and branch with exactly the right opportunities automatically.</p>
            </div>

            <div className="glass-card stagger-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Verified Recruiters</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Every company and job posting is vetted by the placement cell. No fake job postings, only premium campus drive opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Marquee Placeholder */}
      <section style={{ padding: '4rem 2rem', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '2rem' }}>Trusted by top industry leaders</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.6, filter: 'grayscale(100%)' }}>
            <h2 style={{ margin: 0 }}>Google</h2>
            <h2 style={{ margin: 0 }}>Microsoft</h2>
            <h2 style={{ margin: 0 }}>Amazon</h2>
            <h2 style={{ margin: 0 }}>Deloitte</h2>
            <h2 style={{ margin: 0 }}>Flipkart</h2>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem' }}>
        <div className="container">
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))', borderColor: 'var(--accent-primary)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to launch your career?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>Join thousands of students who have found their dream jobs through our intelligent platform.</p>
            <Link to="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
