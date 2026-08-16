import React from 'react';
import { Check, Star, Zap, Crown, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    desc: 'Perfect for small companies starting their campus hiring journey.',
    icon: Zap,
    color: 'var(--text-secondary)',
    features: [
      '3 job postings per month',
      'Basic candidate search',
      'Application tracking',
      'Email notifications',
      'Standard support',
    ],
    notIncluded: ['AI candidate matching', 'Bulk messaging', 'Analytics dashboard', 'Priority listing'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '₹4,999',
    period: '/month',
    desc: 'For growing companies with active hiring needs.',
    icon: Star,
    color: 'var(--accent-primary)',
    features: [
      'Unlimited job postings',
      'AI-powered candidate matching',
      'Advanced filters & search',
      'Bulk messaging (up to 200/mo)',
      'Analytics dashboard',
      'Priority listing in search',
      'Resume download access',
      'Email + chat support',
    ],
    notIncluded: ['Dedicated account manager'],
    cta: 'Start 14-day Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large organizations with high-volume campus recruitment.',
    icon: Crown,
    color: 'var(--warning)',
    features: [
      'Everything in Professional',
      'Unlimited bulk messaging',
      'Dedicated account manager',
      'Custom branding on listings',
      'API access for ATS integration',
      'Campus drive management',
      'White-label career portal',
      'SLA-backed support (99.9% uptime)',
      'Custom analytics & reports',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1200px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Pricing</div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>
          Plans for Every <span className="text-gradient">Hiring Need</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Students always free. Companies pick the plan that fits their scale.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {plans.map((plan, i) => (
          <div key={i} className="glass-panel" style={{
            padding: '2.5rem 2rem',
            border: plan.highlighted ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {plan.highlighted && (
              <div style={{
                position: 'absolute', top: '16px', right: '-32px',
                background: 'var(--accent-gradient)', color: '#fff',
                padding: '0.25rem 2.5rem', fontSize: '0.7rem', fontWeight: 700,
                transform: 'rotate(45deg)', textTransform: 'uppercase', letterSpacing: '1px'
              }}>Popular</div>
            )}
            
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <plan.icon size={22} color={plan.color} />
            </div>
            
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>{plan.name}</h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800 }}>{plan.price}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{plan.period}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>{plan.desc}</p>
            
            <button className={plan.highlighted ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', marginBottom: '1.75rem' }}>
              {plan.cta} <ArrowRight size={16} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Student Note */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.06))' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.2rem' }}>🎓 Free Forever for Students</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
          Students get unlimited access to all features — job search, resume builder, AI analysis, portfolio, and more. Always free, no credit card required.
        </p>
      </div>
    </div>
  );
}
