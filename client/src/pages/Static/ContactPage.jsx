import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, CheckCircle2, BookOpen, Users, Headphones } from 'lucide-react';

// TODO: Replace with your real FAQs
const faqs = [
  // { q: 'Your question?', a: 'Your answer.' },
];

// TODO: Replace with your real contact methods
const contactMethods = [
  // { icon: Mail, title: 'Email Support', detail: 'your@email.com', sub: 'Response time' },
  // { icon: Phone, title: 'Phone', detail: '+91 XXXXX XXXXX', sub: 'Availability' },
  // { icon: MapPin, title: 'Office', detail: 'Your address', sub: 'Visit info' },
  // { icon: Clock, title: 'Business Hours', detail: 'Days', sub: 'Timing' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1100px' }}>
      
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Support</div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>
          Contact & <span className="text-gradient">Support</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Have a question or need help? Our team is here for you.
        </p>
      </div>

      {/* Contact Methods */}
      {contactMethods.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {contactMethods.map((m, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <m.icon size={22} color="var(--accent-primary)" />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.35rem', fontSize: '1rem' }}>{m.title}</h4>
              <div style={{ fontWeight: 500, marginBottom: '0.2rem', fontSize: '0.9rem' }}>{m.detail}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Form + FAQs */}
      <div style={{ display: 'grid', gridTemplateColumns: faqs.length > 0 ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={20} color="var(--accent-primary)" /> Send a Message
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Fill out the form below and we'll get back to you shortly.
          </p>

          {submitted && (
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> Your message has been sent! We'll respond within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What is this regarding?" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Message</label>
              <textarea className="form-textarea" rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." required></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--accent-primary)" /> FAQs
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Quick answers to common questions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card" style={{ padding: 0, cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.4 }}>{faq.q}</h4>
                    <span style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', fontWeight: 700, flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                  </div>
                  {openFaq === i && (
                    <div style={{ padding: '0 1.25rem 1rem', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '-0.25rem' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
