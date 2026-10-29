import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Zap, Users, Building2, Briefcase, Star, CheckCircle, MousePointer2 } from 'lucide-react';
import TubesBackground from '../../components/TubesBackground';

export const LandingPage = () => {
  return (
    <div className="animate-fade-in">
      <style>{`
        /* Navbar entrance */
        .navbar {
          animation: navbarEnter 0.7s ease-out forwards;
        }

        .navbar-logo {
          animation: logoEnter 0.6s ease-out 0.15s both;
        }

        .navbar-theme {
          animation: fadeScale 0.5s ease-out 0.35s both;
        }

        .navbar-login {
          animation: buttonEnter 0.5s ease-out 0.45s both;
        }

        .navbar-signup {
          animation: buttonEnter 0.5s ease-out 0.55s both;
        }

        @keyframes navbarEnter {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoEnter {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes buttonEnter {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Hero sequence animations */
        .hero-anim-1,
        .hero-anim-2,
        .hero-anim-3,
        .hero-anim-4,
        .hero-anim-5 {
          opacity: 0;
          will-change: transform, opacity;
        }

        .hero-anim-1 {
          animation: heroSlideUp 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .hero-anim-2 {
          animation: heroSlideUpGlow 800ms cubic-bezier(0.22, 1, 0.36, 1) 250ms forwards;
        }

        .hero-anim-3 {
          animation: heroSlideUp 650ms cubic-bezier(0.22, 1, 0.36, 1) 450ms forwards;
        }

        .hero-anim-4 {
          animation: heroSlideUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 700ms forwards;
        }

        .hero-anim-5 {
          animation: heroSlideUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 900ms forwards;
        }

        @keyframes heroSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroSlideUpGlow {
          0% {
            opacity: 0;
            transform: translateY(20px);
            filter: drop-shadow(0 0 0px rgba(96, 165, 250, 0));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(96, 165, 250, 0.6));
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: drop-shadow(0 0 0px rgba(96, 165, 250, 0));
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .navbar,
          .navbar-logo,
          .navbar-theme,
          .navbar-login,
          .navbar-signup,
          .hero-anim-1,
          .hero-anim-2,
          .hero-anim-3,
          .hero-anim-4,
          .hero-anim-5 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      
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
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              marginBottom: '0.5rem', 
              color: 'var(--text-primary)'
            }}>
              <span className="hero-anim-1" style={{ display: 'inline-block' }}>
                Accelerate Your Career with{' '}
              </span>
              <span className="text-gradient hero-anim-2" style={{ 
                display: 'block'
              }}>ALTS</span>
              <span className="hero-anim-3" style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 600,
                color: 'var(--accent-secondary)',
                display: 'block',
                marginTop: '0.5rem'
              }}>Placement Portal</span>
            </h1>
            
            <p className="hero-anim-4" style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-secondary)', 
              marginBottom: '2.5rem', 
              maxWidth: '700px', 
              margin: '0 auto 2.5rem'
            }}>
              The premier campus placement portal connecting top tier talent with global enterprises through intelligent resume analysis and automated recruitment workflows.
            </p>
            
            <div className="hero-anim-5" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ 
                padding: '1rem 2rem', fontSize: '1.1rem',
                pointerEvents: 'auto'
              }}>
                Create Student Profile <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary" style={{ 
                padding: '1rem 2rem', fontSize: '1.1rem',
                borderRadius: '12px',
                fontWeight: 600,
                pointerEvents: 'auto'
              }}>
                Login or Signup
              </Link>
            </div>


          </div>
        </section>
      </TubesBackground>



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
            <div className="glass-card animate-slide-up stagger-1">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>AI Resume Analyzer</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Get instant feedback on your resume. Our AI ATS checker highlights skill gaps and suggests improvements to boost your chances.</p>
            </div>

            <div className="glass-card animate-slide-up stagger-2">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Briefcase size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Smart Job Matching</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Stop manual searching. Our algorithm matches your skills, CGPA, and branch with exactly the right opportunities automatically.</p>
            </div>

            <div className="glass-card animate-slide-up stagger-3">
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
