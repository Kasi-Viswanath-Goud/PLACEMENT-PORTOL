import React from 'react';
import { Users, Target, Award, Zap, Globe, ShieldCheck, GraduationCap, Building2, Briefcase, TrendingUp } from 'lucide-react';

// TODO: Replace with your real stats
const stats = [
  // { icon: Users, value: '---', label: 'Students Placed' },
  // { icon: Building2, value: '---', label: 'Partner Companies' },
  // { icon: Briefcase, value: '---', label: 'Jobs Posted' },
  // { icon: GraduationCap, value: '---', label: 'Colleges Connected' },
];

// TODO: Replace with your real core values
const values = [
  // { icon: Target, title: 'Your Value', desc: 'Description of this value.' },
];

// TODO: Replace with your real team members
const team = [
  // { name: 'Full Name', role: 'Role Title', bio: 'Short bio.' },
];

export default function AboutPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1100px' }}>
      
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>About ALTS</div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15 }}>
          Transforming Campus <span className="text-gradient">Placements</span> with AI
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
          The official campus placement portal of ALTS, connecting students, premier recruiters, and the placement cell through AI-assisted resume matching, real-time tracking, and automated recruitment workflows.
        </p>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {stats.map((stat, i) => (
            <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <stat.icon size={28} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }} className="text-gradient">{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Our Story */}
      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TrendingUp size={24} color="var(--accent-primary)" /> Our Story
        </h2>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Built at ALTS, this platform modernizes collegiate hiring by replacing spreadsheets and paper resumes with a centralized digital ecosystem. By integrating automated ATS resume scoring, instant SMTP updates, and dynamic placement analytics, the portal ensures complete transparency and efficiency for students and recruiters alike.
          </p>
        </div>
      </div>

      {/* Core Values */}
      {values.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>Core Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {values.map((v, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <v.icon size={22} color="var(--accent-primary)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team */}
      {team.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>Leadership Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {team.map((t, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem',
                  background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 700, color: '#fff'
                }}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.15rem' }}>{t.name}</h4>
                <div style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t.role}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
