import React from 'react';
import { FileText, AlertTriangle, Ban, Scale, CreditCard, RefreshCw, Gavel, Mail } from 'lucide-react';

const sections = [
  {
    icon: FileText,
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using the ALTS platform ("Service"), you agree to be bound by these Terms of Service ("Terms").',
      'If you do not agree to all of these Terms, you must not use the Service.',
      'We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.',
      'You must be at least 16 years old to create an account. Users under 18 must have consent from a parent or legal guardian.',
    ]
  },
  {
    icon: FileText,
    title: '2. Account Responsibilities',
    content: [
      'You are responsible for maintaining the confidentiality of your login credentials.',
      'All activities that occur under your account are your responsibility.',
      'You must provide accurate, current, and complete information during registration and keep your profile up to date.',
      'You must notify us immediately of any unauthorized access to your account by emailing security@alts-placement.com.',
      'One person may maintain only one account. Creating multiple accounts to circumvent restrictions is prohibited.',
    ]
  },
  {
    icon: Ban,
    title: '3. Prohibited Conduct',
    content: [
      'Posting false, misleading, or fraudulent information in job listings or student profiles.',
      'Impersonating another person, company, or institution.',
      'Attempting to scrape, harvest, or collect user data through automated means (bots, crawlers, etc.).',
      'Uploading malicious files, viruses, or any harmful code.',
      'Harassing, threatening, or discriminating against other users.',
      'Using the platform for any purpose that violates applicable local, state, national, or international laws.',
      'Circumventing or manipulating the AI matching, scoring, or ranking algorithms.',
    ]
  },
  {
    icon: FileText,
    title: '4. Student Terms',
    content: [
      'Students may create profiles, upload resumes, and apply to job postings free of charge.',
      'By applying to a job, you consent to sharing your profile information (name, skills, education, projects, resume) with the recruiting company.',
      'ALTS does not guarantee employment, interviews, or responses from companies.',
      'Students are responsible for the accuracy of information in their profiles and applications.',
      'Misrepresenting qualifications, skills, or academic records may result in permanent account suspension.',
    ]
  },
  {
    icon: FileText,
    title: '5. Company/Recruiter Terms',
    content: [
      'Companies must provide valid business registration and authorized HR contact information.',
      'Job postings must comply with all applicable labor laws and anti-discrimination regulations.',
      'Companies may not post misleading job descriptions, fake listings, or unpaid internships disguised as jobs.',
      'Candidate data accessed through the platform may only be used for recruitment purposes related to the specific job posting.',
      'Companies must respond to applicants in a reasonable timeframe and update application statuses.',
    ]
  },
  {
    icon: CreditCard,
    title: '6. Payments & Subscriptions',
    content: [
      'Certain features may require a paid subscription. Pricing details are available on the Pricing page.',
      'All payments are processed securely through Razorpay/Stripe. ALTS does not store credit card information.',
      'Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date.',
      'Refunds are available within 7 days of purchase if no premium features have been used.',
      'ALTS reserves the right to change pricing with 30 days\' prior notice.',
    ]
  },
  {
    icon: Scale,
    title: '7. Intellectual Property',
    content: [
      'All content on the ALTS platform — including logos, designs, text, software, and AI algorithms — is the intellectual property of ALTS Technologies Pvt. Ltd.',
      'Users retain ownership of the content they submit (resumes, profiles, projects). By uploading, you grant ALTS a non-exclusive license to display and process this content for platform functionality.',
      'You may not reproduce, distribute, or create derivative works from ALTS proprietary content without written permission.',
    ]
  },
  {
    icon: AlertTriangle,
    title: '8. Limitation of Liability',
    content: [
      'ALTS is provided "as-is" without warranties of any kind, express or implied.',
      'We do not guarantee uninterrupted service, error-free operation, or specific outcomes (employment, matches, etc.).',
      'ALTS is not responsible for the actions, omissions, or conduct of any user (student or company) on the platform.',
      'Our total liability for any claim shall not exceed the amount you paid to ALTS in the 12 months preceding the claim.',
      'ALTS is not liable for any indirect, incidental, or consequential damages.',
    ]
  },
  {
    icon: RefreshCw,
    title: '9. Termination',
    content: [
      'You may delete your account at any time from your profile settings.',
      'ALTS reserves the right to suspend or terminate accounts that violate these Terms, without prior notice.',
      'Upon termination, your right to access the platform ceases immediately.',
      'Data deletion following termination is governed by our Privacy Policy.',
    ]
  },
  {
    icon: Gavel,
    title: '10. Governing Law & Disputes',
    content: [
      'These Terms are governed by the laws of India.',
      'Any disputes shall be resolved through arbitration in Hyderabad, Telangana, under the Arbitration and Conciliation Act, 1996.',
      'If any provision of these Terms is found unenforceable, the remaining provisions shall continue in full effect.',
    ]
  },
];

export default function TermsPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '900px' }}>
      
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Legal</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Gavel size={32} color="var(--accent-primary)" /> Terms of Service
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Last updated: August 1, 2026 · Please read carefully before using ALTS
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
                <li key={j} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
        <Mail size={24} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Questions about these terms?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Contact our legal team at <a href="mailto:legal@alts-placement.com" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>legal@alts-placement.com</a>
        </p>
      </div>
    </div>
  );
}
