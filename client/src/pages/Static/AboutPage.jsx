import React from 'react';
import { Users, Target, Award, Zap, Globe, ShieldCheck, GraduationCap, Building2, Briefcase, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: '50,000+', label: 'Students Placed' },
  { icon: Building2, value: '2,500+', label: 'Partner Companies' },
  { icon: Briefcase, value: '15,000+', label: 'Jobs Posted' },
  { icon: GraduationCap, value: '500+', label: 'Colleges Connected' },
];

const values = [
  { icon: Target, title: 'Mission-Driven', desc: 'We believe every student deserves equal access to career opportunities regardless of their background or location.' },
  { icon: Zap, title: 'AI-Powered Matching', desc: 'Our proprietary algorithms match candidates to roles with 94% accuracy, saving time for both students and recruiters.' },
  { icon: ShieldCheck, title: 'Trust & Transparency', desc: 'Verified company profiles, real-time application tracking, and honest feedback loops build confidence in the process.' },
  { icon: Globe, title: 'Global Reach', desc: 'Connecting talent from tier-1 and tier-2 cities with Fortune 500 companies and innovative startups worldwide.' },
];

const team = [
  { name: 'Priya Sharma', role: 'CEO & Co-Founder', bio: 'Ex-Google, IIT Delhi alumna. 10+ years in EdTech.' },
  { name: 'Arjun Mehta', role: 'CTO & Co-Founder', bio: 'Ex-Microsoft, built scalable platforms serving 100M+ users.' },
  { name: 'Sneha Reddy', role: 'Head of Partnerships', bio: 'Built recruitment networks across 500+ institutions.' },
  { name: 'Rahul Verma', role: 'Lead AI Engineer', bio: 'PhD in ML from IISc. Specializes in NLP and recommendation systems.' },
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
          ALTS (Advanced Learning & Talent System) was founded in 2023 with a simple mission: eliminate the friction between talented students and the companies that need them. We use AI to make placements smarter, faster, and fairer.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <stat.icon size={28} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }} className="text-gradient">{stat.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Our Story */}
      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TrendingUp size={24} color="var(--accent-primary)" /> Our Story
        </h2>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            It started in a college placement cell. Our founders watched as hundreds of talented students missed opportunities — not because they lacked skills, but because the system was broken. Resumes got lost in email threads, companies couldn't filter candidates efficiently, and students had zero visibility into where they stood.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We built ALTS to fix this. Our platform combines AI-powered resume analysis, smart job matching, real-time tracking, and a beautiful portfolio builder into one seamless experience. Companies post jobs and receive pre-scored, ranked candidates. Students get matched to roles that truly fit their skills.
          </p>
          <p>
            Today, ALTS powers placements at over 500 colleges across India, connecting students with companies ranging from startups to Fortune 500 enterprises. And we're just getting started.
          </p>
        </div>
      </div>

      {/* Core Values */}
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

      {/* Team */}
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
    </div>
  );
}
