import React from 'react';
import { ShieldCheck, Eye, Database, Lock, UserCheck, Globe, AlertTriangle, Mail } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: '1. Information We Collect',
    content: [
      '**Account Information:** Name, email address, phone number, college, degree, and graduation year when you create an account.',
      '**Profile Data:** Skills, projects, work experience, certifications, social links, and any other details you add to your profile.',
      '**Resume Data:** Uploaded resumes are stored securely. Our AI analyzes resume content for skill matching and ATS scoring — this data is never shared with third parties.',
      '**Usage Data:** We collect anonymized analytics including pages visited, features used, session duration, and device information to improve our platform.',
      '**Application Data:** Records of jobs you apply to, application status, and match scores.',
    ]
  },
  {
    icon: Eye,
    title: '2. How We Use Your Information',
    content: [
      'To create and manage your account and profile.',
      'To match you with relevant job opportunities using our AI algorithms.',
      'To enable companies to view your profile and application when you apply for their jobs.',
      'To provide resume analysis, ATS scoring, and career suggestions.',
      'To send notifications about application status updates, new matching jobs, and platform announcements.',
      'To improve our services through anonymized analytics.',
    ]
  },
  {
    icon: UserCheck,
    title: '3. Information Sharing',
    content: [
      '**With Companies:** When you apply to a job, the recruiting company can see your profile, resume, and match score. Your email and phone are shared only after shortlisting.',
      '**With Service Providers:** We use trusted third-party services for hosting (AWS), email delivery (SendGrid), and analytics (Mixpanel). These providers are contractually bound to protect your data.',
      '**We never sell your personal data** to advertisers, data brokers, or any third party.',
      '**Legal Requirements:** We may disclose data if required by law or to protect the safety and rights of our users.',
    ]
  },
  {
    icon: Lock,
    title: '4. Data Security',
    content: [
      'All data is transmitted over HTTPS with TLS 1.3 encryption.',
      'Passwords are hashed using bcrypt with salt rounds.',
      'Database access is restricted with role-based authentication and IP whitelisting.',
      'We conduct regular security audits and vulnerability assessments.',
      'File uploads (resumes) are stored in encrypted S3 buckets with restricted access.',
    ]
  },
  {
    icon: Globe,
    title: '5. Cookies & Tracking',
    content: [
      '**Essential Cookies:** Used for authentication and session management. Cannot be disabled.',
      '**Analytics Cookies:** Help us understand how users interact with the platform. You can opt out in your account settings.',
      '**We do not use** advertising cookies or cross-site tracking pixels.',
    ]
  },
  {
    icon: UserCheck,
    title: '6. Your Rights',
    content: [
      '**Access:** Request a copy of all personal data we hold about you.',
      '**Correction:** Update or correct inaccurate information from your profile page.',
      '**Deletion:** Request permanent deletion of your account and all associated data. This action is irreversible.',
      '**Portability:** Export your profile data in JSON format from Settings.',
      '**Opt-out:** Unsubscribe from marketing emails at any time. Transactional emails (application updates) cannot be disabled.',
      'To exercise any of these rights, contact us at privacy@alts-placement.com.',
    ]
  },
  {
    icon: AlertTriangle,
    title: '7. Data Retention',
    content: [
      'Active accounts: Data is retained as long as your account is active.',
      'Deleted accounts: All personal data is permanently removed within 30 days of deletion request.',
      'Application records: Anonymized application statistics may be retained for platform analytics.',
      'Uploaded files: Resumes and documents are deleted within 7 days of account deletion.',
    ]
  },
];

export default function PrivacyPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '900px' }}>
      
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Legal</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={32} color="var(--accent-primary)" /> Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Last updated: August 1, 2026 · Effective for all users
        </p>
      </div>

      {/* Intro */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          At ALTS, your privacy is fundamental to our mission. This Privacy Policy explains what information we collect, how we use it, who we share it with, and your rights regarding your data. By using our platform, you agree to the practices described in this policy.
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sections.map((section, i) => (
          <div key={i} className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <section.icon size={20} color="var(--accent-primary)" /> {section.title}
            </h2>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {section.content.map((item, j) => (
                <li key={j} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>') }}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
        <Mail size={24} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Questions about your privacy?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Contact our Data Protection Officer at <a href="mailto:privacy@alts-placement.com" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>privacy@alts-placement.com</a>
        </p>
      </div>
    </div>
  );
}
