import React from 'react';
import { Building2, MapPin, Users, Briefcase, Star, ExternalLink, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const companies = [
  { name: 'Google India', industry: 'Technology', location: 'Bangalore, Hyderabad', employees: '10,000+', openJobs: 12, rating: 4.8, logo: 'G', color: '#4285F4', desc: 'Organizing the world\'s information and making it universally accessible and useful.' },
  { name: 'Microsoft', industry: 'Technology', location: 'Hyderabad, Noida', employees: '8,000+', openJobs: 8, rating: 4.7, logo: 'M', color: '#00A4EF', desc: 'Empowering every person and organization on the planet to achieve more.' },
  { name: 'Amazon', industry: 'E-Commerce / Cloud', location: 'Bangalore, Chennai', employees: '15,000+', openJobs: 23, rating: 4.3, logo: 'A', color: '#FF9900', desc: 'Earth\'s most customer-centric company, building technology for everyone.' },
  { name: 'Flipkart', industry: 'E-Commerce', location: 'Bangalore', employees: '5,000+', openJobs: 15, rating: 4.2, logo: 'F', color: '#2874F0', desc: 'India\'s leading e-commerce marketplace offering millions of products.' },
  { name: 'Tata Consultancy Services', industry: 'IT Services', location: 'Multiple Cities', employees: '600,000+', openJobs: 45, rating: 4.0, logo: 'T', color: '#0066B3', desc: 'Global leader in IT services, consulting and business solutions.' },
  { name: 'Infosys', industry: 'IT Services', location: 'Pune, Mysore, Bangalore', employees: '350,000+', openJobs: 38, rating: 3.9, logo: 'I', color: '#007CC3', desc: 'Digital services and consulting enabling enterprises to navigate their digital transformation.' },
  { name: 'Razorpay', industry: 'Fintech', location: 'Bangalore', employees: '3,000+', openJobs: 7, rating: 4.5, logo: 'R', color: '#3395FF', desc: 'India\'s leading full-stack payments platform for businesses of all sizes.' },
  { name: 'Zomato', industry: 'Food Tech', location: 'Gurugram', employees: '4,000+', openJobs: 6, rating: 4.1, logo: 'Z', color: '#E23744', desc: 'Connecting customers, restaurant partners and delivery partners, serving food on-demand.' },
  { name: 'PhonePe', industry: 'Fintech', location: 'Bangalore', employees: '5,000+', openJobs: 9, rating: 4.3, logo: 'P', color: '#5F259F', desc: 'India\'s leading digital payments platform with 400M+ registered users.' },
  { name: 'Wipro', industry: 'IT Services', location: 'Multiple Cities', employees: '250,000+', openJobs: 30, rating: 3.8, logo: 'W', color: '#471352', desc: 'Leading technology services and consulting company focused on building innovative solutions.' },
  { name: 'Swiggy', industry: 'Food Tech', location: 'Bangalore', employees: '6,000+', openJobs: 11, rating: 4.0, logo: 'S', color: '#FC8019', desc: 'India\'s largest online food ordering and delivery platform.' },
  { name: 'CRED', industry: 'Fintech', location: 'Bangalore', employees: '1,200+', openJobs: 4, rating: 4.6, logo: 'C', color: '#1A1A2E', desc: 'A members-only credit card bill payment platform rewarding financial discipline.' },
];

export default function CompaniesPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1200px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Explore</div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>
          Company <span className="text-gradient">Profiles</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore top companies hiring on ALTS. Find your dream workplace.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {[
          { icon: Building2, value: '2,500+', label: 'Companies' },
          { icon: Briefcase, value: '15,000+', label: 'Open Positions' },
          { icon: TrendingUp, value: '94%', label: 'Avg Match Rate' },
          { icon: Users, value: '50,000+', label: 'Students Placed' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <s.icon size={24} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-gradient">{s.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Company Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {companies.map((c, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: 'var(--radius-md)',
                background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: 800, color: '#fff', flexShrink: 0
              }}>{c.logo}</div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.1rem' }}>{c.name}</h3>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{c.industry}</span>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>{c.desc}</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> {c.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={13} /> {c.employees}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={13} color="var(--warning)" /> {c.rating}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>{c.openJobs} open positions</span>
              <Link to="/jobs" className="btn-secondary btn-sm" style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}>
                View Jobs <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
