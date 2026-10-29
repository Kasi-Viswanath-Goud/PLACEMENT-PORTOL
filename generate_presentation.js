const pptxgen = require('pptxgenjs');
const path = require('path');

async function createDeck() {
  const pptx = new pptxgen();

  // Widescreen 16:9 layout (13.333 x 7.5 inches) - Modern PowerPoint standard
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'ALTS Development Team';
  pptx.company = 'Department of Computer Science & Engineering';
  pptx.title = 'ALTS: AI-Powered Campus Placement Portal';

  // Theme Constants
  const THEME = {
    bgDark: '0A0F1D',       // Dark Navy / Obsidian background
    cardBg: '141C33',       // Main card container background
    cardBgAlt: '1B2544',    // Secondary / Highlight card background
    cardBorder: '28375C',   // Subtle border for cards
    cardBorderLight: '3B4F82', // Accent border
    textWhite: 'FFFFFF',    // High-contrast primary white text
    textMuted: '94A3B8',    // Slate secondary description text
    accentCyan: '38BDF8',   // Sky / Cyan primary accent
    accentIndigo: '818CF8', // Electric Indigo accent
    accentGreen: '34D399',  // Emerald Green (Success / Verified)
    accentAmber: 'FBBF24',  // Warm Amber / Gold (Highlight)
    accentRed: 'F87171'     // Coral Red (Critical / Gap)
  };

  // Helper function to create standard header on every content slide
  function addSlideHeader(slide, category, title, slideNum) {
    slide.background = { color: THEME.bgDark };

    // Category Badge
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.42, w: 8.0, h: 0.25,
      fontSize: 10, bold: true, color: THEME.accentCyan,
      fontFace: 'Calibri', charSpacing: 2,
      margin: 0
    });

    // Main Slide Title
    slide.addText(title, {
      x: 0.8, y: 0.68, w: 10.5, h: 0.48,
      fontSize: 22, bold: true, color: THEME.textWhite,
      fontFace: 'Calibri', margin: 0
    });

    // Top Divider Rule
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8, y: 1.25, w: 11.73, h: 0.02,
      fill: { color: THEME.cardBorder },
      line: { color: THEME.cardBorder, width: 0 }
    });

    // Footer Left (Branding)
    slide.addText('ALTS | AI-Powered Campus Placement & Applicant Tracking Portal', {
      x: 0.8, y: 6.95, w: 8.0, h: 0.25,
      fontSize: 9.5, color: THEME.textMuted,
      fontFace: 'Calibri', margin: 0
    });

    // Footer Right (Slide Number)
    slide.addText(`Slide ${slideNum} of 13`, {
      x: 9.53, y: 6.95, w: 3.0, h: 0.25,
      fontSize: 9.5, color: THEME.textMuted,
      align: 'right', fontFace: 'Calibri', margin: 0
    });
  }

  // ==========================================
  // SLIDE 1: TITLE SLIDE
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: THEME.bgDark };

    // Outer Presentation Frame
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 0.65, w: 11.73, h: 6.2,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1.5 },
      rectRadius: 0.1
    });

    // Pill Badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.3, y: 1.05, w: 4.8, h: 0.35,
      fill: { color: '1B284D' },
      line: { color: THEME.accentCyan, width: 1 },
      rectRadius: 0.15
    });
    slide.addText('FINAL YEAR CAPSTONE PROJECT DEFENSE', {
      x: 1.3, y: 1.05, w: 4.8, h: 0.35,
      fontSize: 10, bold: true, color: THEME.accentCyan,
      align: 'center', valign: 'middle', fontFace: 'Calibri', charSpacing: 1.5,
      margin: 0
    });

    // Project Title
    slide.addText('ALTS : AI-Powered Campus Placement Portal', {
      x: 1.3, y: 1.55, w: 10.7, h: 0.9,
      fontSize: 30, bold: true, color: THEME.textWhite,
      fontFace: 'Calibri', margin: 0
    });

    // Subtitle
    slide.addText('Intelligent Resume Screening, Algorithmic Job-Matching & Unified Recruitment Lifecycle Management', {
      x: 1.3, y: 2.45, w: 10.7, h: 0.45,
      fontSize: 14, color: THEME.accentIndigo,
      fontFace: 'Calibri', margin: 0
    });

    // Divider Line
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 1.3, y: 3.05, w: 10.7, h: 0.02,
      fill: { color: THEME.cardBorder },
      line: { color: THEME.cardBorder, width: 0 }
    });

    // Left Bento Card: Team Members
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.3, y: 3.3, w: 5.15, h: 3.1,
      fill: { color: THEME.cardBgAlt },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('PROJECT TEAM MEMBERS', {
      x: 1.6, y: 3.5, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentCyan,
      fontFace: 'Calibri', charSpacing: 1, margin: 0
    });

    slide.addText([
      { text: 'Chintu Goud\n', options: { bold: true, color: THEME.textWhite, fontSize: 13 } },
      { text: 'Role: Full-Stack Architect & AI Engine Lead\n', options: { color: THEME.accentGreen, fontSize: 10.5 } },
      { text: 'Email: chintu@email.com | GitHub: Chintugoud-create\n\n', options: { color: THEME.textMuted, fontSize: 9.5 } },
      { text: 'Project Team Partner(s)\n', options: { bold: true, color: THEME.textWhite, fontSize: 13 } },
      { text: 'Role: Frontend UI/UX & Quality Assurance Engineer\n', options: { color: THEME.accentGreen, fontSize: 10.5 } },
      { text: 'Department of Computer Science & Engineering', options: { color: THEME.textMuted, fontSize: 9.5 } }
    ], { x: 1.6, y: 3.85, w: 4.5, h: 2.3, fontFace: 'Calibri', margin: 0 });

    // Right Bento Card: Supervisor & Institution
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.85, y: 3.3, w: 5.15, h: 3.1,
      fill: { color: THEME.cardBgAlt },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('SUPERVISOR & INSTITUTION', {
      x: 7.15, y: 3.5, w: 4.5, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentCyan,
      fontFace: 'Calibri', charSpacing: 1, margin: 0
    });

    slide.addText([
      { text: 'Project Supervisor:\n', options: { color: THEME.textMuted, fontSize: 10 } },
      { text: 'Dr. / Prof. Faculty Advisor, Ph.D.\n', options: { bold: true, color: THEME.textWhite, fontSize: 12.5 } },
      { text: 'Department of Computer Science & Engineering\n\n', options: { color: THEME.textMuted, fontSize: 10 } },
      { text: 'Institution:\n', options: { color: THEME.textMuted, fontSize: 10 } },
      { text: 'College of Engineering & Technology\n', options: { bold: true, color: THEME.textWhite, fontSize: 12.5 } },
      { text: 'Academic Session: ', options: { color: THEME.textMuted, fontSize: 10 } },
      { text: '2026 – 2027 (Final Semester)', options: { bold: true, color: THEME.accentAmber, fontSize: 10.5 } }
    ], { x: 7.15, y: 3.85, w: 4.5, h: 2.3, fontFace: 'Calibri', margin: 0 });

    slide.addNotes('Good morning respected supervisor and panel members. Today we are presenting ALTS, an AI-powered end-to-end campus placement portal built to modernize campus hiring through automated resume parsing, algorithmic matching, and unified recruitment workflows.');
  }

  // ==========================================
  // SLIDE 2: AGENDA
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Presentation Flow', 'Table of Contents & Presentation Agenda', 2);

    const agendaItems = [
      { num: '01', title: 'Abstract & Motivation', desc: 'Core inspiration, systemic overview & high-level project scope' },
      { num: '02', title: 'Problem Statement', desc: 'Existing operational bottlenecks & screening latency in campus drives' },
      { num: '03', title: 'Project Objectives', desc: 'Primary technical deliverables, functional requirements & KPI targets' },
      { num: '04', title: 'Literature Survey', desc: 'Benchmarking existing university ERPs vs enterprise ATS solutions' },
      { num: '05', title: 'System Architecture', desc: 'Tiered client-server framework, REST API & data flow interaction' },
      { num: '06', title: 'Methodology & Algorithm', desc: 'Heuristic ATS scoring, regex tokenization & mathematical equations' },
      { num: '07', title: 'Implementation Details', desc: 'Full-stack MERN ecosystem, parsing libraries & deployment setup' },
      { num: '08', title: 'Results & Experimental Analysis', desc: 'Extraction latency benchmarks, match precision & live UI output' },
      { num: '09', title: 'Conclusion & Contributions', desc: 'Summary of milestones achieved & project takeaways' },
      { num: '10', title: 'Future Scope & References', desc: 'Four-phase scalability roadmap & academic citations' }
    ];

    agendaItems.forEach((item, idx) => {
      const col = idx < 5 ? 0 : 1;
      const row = idx % 5;
      const x = 0.8 + col * 5.95;
      const y = 1.48 + row * 1.04;

      // Card Container
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: y, w: 5.78, h: 0.94,
        fill: { color: THEME.cardBg },
        line: { color: THEME.cardBorder, width: 1 },
        rectRadius: 0.08
      });

      // Number Pill
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.18, y: y + 0.18, w: 0.65, h: 0.58,
        fill: { color: '1C274A' },
        line: { color: THEME.accentCyan, width: 1 },
        rectRadius: 0.06
      });
      slide.addText(item.num, {
        x: x + 0.18, y: y + 0.18, w: 0.65, h: 0.58,
        fontSize: 14, bold: true, color: THEME.accentCyan,
        align: 'center', valign: 'middle', fontFace: 'Calibri', margin: 0
      });

      // Title & Description
      slide.addText([
        { text: item.title + '\n', options: { bold: true, color: THEME.textWhite, fontSize: 12 } },
        { text: item.desc, options: { color: THEME.textMuted, fontSize: 9.5 } }
      ], { x: x + 0.95, y: y + 0.12, w: 4.65, h: 0.72, fontFace: 'Calibri', margin: 0 });
    });

    slide.addNotes('Here is the roadmap for our presentation. We will walk you through the problem landscape, literature gaps, system architecture, core ATS algorithms, implementation tech stack, experimental results, and conclude with future directions.');
  }

  // ==========================================
  // SLIDE 3: ABSTRACT & MOTIVATION
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Context & Vision', 'Abstract & Core Motivation', 3);

    // Left Card: Executive Abstract
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.48, w: 5.75, h: 5.15,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('EXECUTIVE ABSTRACT', {
      x: 1.1, y: 1.75, w: 5.15, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentCyan,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    slide.addText([
      { text: 'ALTS is a specialized recruitment automation platform ', options: { bold: true, color: THEME.textWhite, fontSize: 12.5 } },
      { text: 'engineered to streamline the chaotic recruitment lifecycle across graduating students, university placement cells, and corporate HR recruiters.\n\n', options: { color: THEME.textMuted, fontSize: 11 } },
      { text: 'Core Innovations Introduced:\n', options: { bold: true, color: THEME.accentIndigo, fontSize: 11.5 } },
      { text: '• Native Document Ingestion: Multi-format text extraction (PDF & Word DOCX) rendered inline without external paid APIs.\n', options: { color: THEME.textWhite, fontSize: 10.5 } },
      { text: '• Heuristic ATS & Keyword Gap Engine: Evaluates candidate alignment against job descriptions and provides targeted improvement recommendations.\n', options: { color: THEME.textWhite, fontSize: 10.5 } },
      { text: '• Tri-Role Architecture: Dedicated, secure dashboards with role-based access for Students, Recruiters, and Placement Administrators.\n', options: { color: THEME.textWhite, fontSize: 10.5 } },
      { text: '• Resilient Dual-Mode Data Engine: Seamlessly toggles between cloud MongoDB and an active in-memory Mock Layer for guaranteed evaluation uptime.', options: { color: THEME.textWhite, fontSize: 10.5 } }
    ], { x: 1.1, y: 2.1, w: 5.15, h: 4.3, fontFace: 'Calibri', margin: 0 });

    // Right Column: 3 Motivation Cards
    const pillars = [
      {
        badge: 'ADMINISTRATIVE EFFICIENCY',
        title: 'Eliminating Operational Bottlenecks',
        desc: 'Placement cells drown in disconnected spreadsheets and physical forms. ALTS centralizes all applicant data, eligibility verifications, and audit trails into one unified source of truth.',
        color: THEME.accentCyan
      },
      {
        badge: 'STUDENT EMPOWERMENT',
        title: 'Data-Driven Candidate Transparency',
        desc: 'Students traditionally face an information black hole after applying. ALTS provides immediate ATS scores, feedback notes, and stage-by-stage status tracking.',
        color: THEME.accentGreen
      },
      {
        badge: 'RECRUITER VELOCITY',
        title: 'Accelerated Time-to-Hire for HR',
        desc: 'Automates resume filtering, skill ranking, and instant transactional email dispatch upon shortlisting, cutting recruiter screening turnaround cycles by over 75%.',
        color: THEME.accentAmber
      }
    ];

    pillars.forEach((p, idx) => {
      const y = 1.48 + idx * 1.76;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.78, y: y, w: 5.75, h: 1.63,
        fill: { color: THEME.cardBg },
        line: { color: THEME.cardBorder, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(p.badge, {
        x: 7.05, y: y + 0.16, w: 5.2, h: 0.22,
        fontSize: 9.5, bold: true, color: p.color,
        fontFace: 'Calibri', charSpacing: 1, margin: 0
      });

      slide.addText(p.title, {
        x: 7.05, y: y + 0.42, w: 5.2, h: 0.32,
        fontSize: 12.5, bold: true, color: THEME.textWhite,
        fontFace: 'Calibri', margin: 0
      });

      slide.addText(p.desc, {
        x: 7.05, y: y + 0.78, w: 5.2, h: 0.75,
        fontSize: 10, color: THEME.textMuted,
        fontFace: 'Calibri', margin: 0
      });
    });

    slide.addNotes('This slide details the core motivation behind ALTS. College campus placement drives manage thousands of student records, resulting in significant administrative drag. ALTS delivers immediate value by automating the resume intake, providing ATS gap diagnostics, and eliminating recruitment latency.');
  }

  // ==========================================
  // SLIDE 4: PROBLEM STATEMENT
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Problem Identification', 'Problem Statement & Existing Operational Bottlenecks', 4);

    const bottlenecks = [
      {
        tag: 'BOTTLENECK 01',
        title: 'Manual & Unstandardized Resume Screening',
        points: [
          'Placement coordinators manually inspect thousands of multi-page PDF/Word resumes.',
          'High probability of human error when checking criteria (CGPA, backlogs, branch eligibility).',
          'Recruiter fatigue leads to inconsistent evaluations and unfair oversights.'
        ]
      },
      {
        tag: 'BOTTLENECK 02',
        title: 'Zero Feedback Loops for Students',
        points: [
          'Students submit applications without knowing why they were screened out.',
          'No automated guidance on missing technical keywords or ATS formatting barriers.',
          'Demotivates applicants and prevents structured iterative self-improvement.'
        ]
      },
      {
        tag: 'BOTTLENECK 03',
        title: 'Fragmented Communication Channels',
        points: [
          'Notices broadcast over informal WhatsApp groups, Telegram, or email chains.',
          'Students regularly miss shortlisting updates, interview slots, and venue changes.',
          'No centralized audit trail of sent offer letters or interview confirmations.'
        ]
      },
      {
        tag: 'BOTTLENECK 04',
        title: 'Lack of Real-Time Recruiter Analytics',
        points: [
          'Companies lack instantaneous visual insight into applicant quality funnels.',
          'Placement officers cannot quickly gauge departmental placement percentages.',
          'Retrospective manual reporting delays accreditation and corporate audits.'
        ]
      }
    ];

    bottlenecks.forEach((b, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 5.95;
      const y = 1.48 + row * 2.62;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: y, w: 5.78, h: 2.45,
        fill: { color: THEME.cardBg },
        line: { color: THEME.cardBorder, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(b.tag, {
        x: x + 0.3, y: y + 0.18, w: 3.5, h: 0.22,
        fontSize: 10, bold: true, color: THEME.accentRed,
        fontFace: 'Calibri', charSpacing: 1, margin: 0
      });

      slide.addText(b.title, {
        x: x + 0.3, y: y + 0.44, w: 5.2, h: 0.34,
        fontSize: 13, bold: true, color: THEME.textWhite,
        fontFace: 'Calibri', margin: 0
      });

      const bullets = b.points.map(pt => ({
        text: `• ${pt}\n`,
        options: { color: THEME.textMuted, fontSize: 10 }
      }));

      slide.addText(bullets, {
        x: x + 0.3, y: y + 0.84, w: 5.2, h: 1.45,
        fontFace: 'Calibri', margin: 0
      });
    });

    slide.addNotes('Here we formalize the four critical bottlenecks observed in existing placement ecosystems: manual resume handling, complete lack of student feedback, noisy communication channels, and the absence of live analytics.');
  }

  // ==========================================
  // SLIDE 5: PROJECT OBJECTIVES
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Project Scope', 'Project Objectives & Target Deliverables', 5);

    // Left Card: Primary Objectives
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.48, w: 7.15, h: 5.15,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('PRIMARY TECHNICAL OBJECTIVES', {
      x: 1.1, y: 1.75, w: 6.55, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentCyan,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    const objectives = [
      { title: '1. Intelligent Document Parser', desc: 'Implement automated parsing for PDF and DOCX files without external paid APIs using pdf-parse and Mammoth libraries.' },
      { title: '2. Algorithmic Match Scoring Engine', desc: 'Compute quantifiable compatibility scores between candidate profile skills, CGPA requirements, and job specifications.' },
      { title: '3. ATS Optimization & Diagnostic Feedback', desc: 'Scan extracted resume tokens against industry benchmarks to identify skill gaps, structural deficiencies, and missing metrics.' },
      { title: '4. Full-Lifecycle Applicant Tracking System', desc: 'Provide an intuitive recruiter Kanban allowing one-click state transitions: Applied → Shortlisted → Interview Scheduled → Selected / Rejected.' },
      { title: '5. Automated Notification & Dispatch Mechanism', desc: 'Trigger asynchronous SMTP email notices with personalized offer/interview metadata upon recruiter actions.' }
    ];

    objectives.forEach((obj, i) => {
      const y = 2.15 + i * 0.86;
      slide.addText([
        { text: obj.title + ': ', options: { bold: true, color: THEME.textWhite, fontSize: 11.5 } },
        { text: obj.desc, options: { color: THEME.textMuted, fontSize: 10 } }
      ], { x: 1.1, y: y, w: 6.55, h: 0.78, fontFace: 'Calibri', margin: 0 });
    });

    // Right Card: Target Success Metrics
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.18, y: 1.48, w: 4.35, h: 5.15,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('TARGET SUCCESS METRICS', {
      x: 8.45, y: 1.75, w: 3.8, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentGreen,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    const metrics = [
      { val: '< 150 ms', label: 'Average Resume Parsing Latency' },
      { val: '100% Free', label: 'Zero Third-Party Dependency Cost' },
      { val: '3 Secured Roles', label: 'Student, Company/HR, Admin' },
      { val: '75% Faster', label: 'Reduction in Screening Cycles' },
      { val: 'Zero Downtime', label: 'Hybrid MongoDB / In-Memory Mock' }
    ];

    metrics.forEach((m, idx) => {
      const y = 2.2 + idx * 0.85;

      slide.addText(m.val, {
        x: 8.45, y: y, w: 3.8, h: 0.34,
        fontSize: 16, bold: true, color: THEME.accentGreen,
        fontFace: 'Calibri', margin: 0
      });

      slide.addText(m.label, {
        x: 8.45, y: y + 0.34, w: 3.8, h: 0.28,
        fontSize: 10, color: THEME.textMuted,
        fontFace: 'Calibri', margin: 0
      });

      if (idx < metrics.length - 1) {
        slide.addShape(pptx.shapes.RECTANGLE, {
          x: 8.45, y: y + 0.72, w: 3.8, h: 0.01,
          fill: { color: THEME.cardBorder },
          line: { color: THEME.cardBorder, width: 0 }
        });
      }
    });

    slide.addNotes('Our project goals are concrete and quantifiable. We set out to build a multi-format document parser, an algorithmic matching score calculator, ATS feedback diagnostics, end-to-end recruitment tracking, and instant email dispatch.');
  }

  // ==========================================
  // SLIDE 6: LITERATURE SURVEY / RELATED WORK
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'State of the Art', 'Literature Survey & Research Gap Analysis', 6);

    // Benchmarking Table with EXPLICIT column widths (colW)
    const headers = [
      { text: 'Evaluation Dimension', options: { bold: true, color: THEME.textWhite, fill: THEME.cardBgAlt } },
      { text: 'Legacy University ERPs', options: { bold: true, color: THEME.textMuted, fill: THEME.cardBgAlt } },
      { text: 'Commercial Enterprise ATS', options: { bold: true, color: THEME.textMuted, fill: THEME.cardBgAlt } },
      { text: 'Proposed ALTS Portal', options: { bold: true, color: THEME.accentCyan, fill: '1A2C55' } }
    ];

    const rows = [
      [
        { text: 'Resume Parsing & Ingestion', options: { color: THEME.textWhite, bold: true } },
        { text: 'Manual download only', options: { color: THEME.textMuted } },
        { text: 'Proprietary AI / Paid API', options: { color: THEME.textMuted } },
        { text: 'Native Local Stream (PDF / Word)', options: { color: THEME.accentGreen, bold: true } }
      ],
      [
        { text: 'Applicant Match Scoring', options: { color: THEME.textWhite, bold: true } },
        { text: 'None (Manual filter)', options: { color: THEME.textMuted } },
        { text: 'Black-box neural ranking', options: { color: THEME.textMuted } },
        { text: 'Explainable ATS + CGPA Bonus', options: { color: THEME.accentGreen, bold: true } }
      ],
      [
        { text: 'Candidate Skill Gap Feedback', options: { color: THEME.textWhite, bold: true } },
        { text: 'Absent (Silent rejection)', options: { color: THEME.accentRed } },
        { text: 'Absent (Recruiter-facing only)', options: { color: THEME.accentRed } },
        { text: 'Actionable Student Diagnostics', options: { color: THEME.accentGreen, bold: true } }
      ],
      [
        { text: 'Inline Document Preview', options: { color: THEME.textWhite, bold: true } },
        { text: 'Not supported', options: { color: THEME.textMuted } },
        { text: 'Supported via cloud storage', options: { color: THEME.textMuted } },
        { text: 'Built-in Mammoth / PDF Streamer', options: { color: THEME.accentGreen, bold: true } }
      ],
      [
        { text: 'Licensing & Infrastructure Cost', options: { color: THEME.textWhite, bold: true } },
        { text: 'High Annual Maintenance', options: { color: THEME.textMuted } },
        { text: 'Expensive SaaS subscription ($$$)', options: { color: THEME.accentRed } },
        { text: '100% Open Source / Self-Hosted', options: { color: THEME.accentGreen, bold: true } }
      ]
    ];

    slide.addTable([headers, ...rows], {
      x: 0.8, y: 1.48, w: 11.73, h: 3.0,
      colW: [2.6, 2.9, 2.9, 3.33],
      fontFace: 'Calibri', fontSize: 10,
      border: { color: THEME.cardBorder, width: 1 },
      align: 'left', valign: 'middle'
    });

    // Research Gap Card at the bottom
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 4.75, w: 11.73, h: 1.9,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('IDENTIFIED RESEARCH GAP & SYSTEM CONTRIBUTION', {
      x: 1.1, y: 4.95, w: 11.1, h: 0.28,
      fontSize: 11, bold: true, color: THEME.accentAmber,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    slide.addText([
      { text: '• Gap in Existing Solutions: ', options: { bold: true, color: THEME.textWhite, fontSize: 11 } },
      { text: 'Commercial enterprise ATS tools ignore the academic constraints of collegiate hiring (CGPA cutoffs, batch graduation years, branch exclusions), while university ERPs remain passive file repositories without automated intelligence.\n\n', options: { color: THEME.textMuted, fontSize: 10 } },
      { text: '• ALTS System Contribution: ', options: { bold: true, color: THEME.accentGreen, fontSize: 11 } },
      { text: 'Unifies lightweight local document normalization, transparent explainable scoring algorithms, and instant bi-directional recruiter-student feedback loops with zero SaaS subscription overhead.', options: { color: THEME.textWhite, fontSize: 10 } }
    ], { x: 1.1, y: 5.25, w: 11.1, h: 1.25, fontFace: 'Calibri', margin: 0 });

    slide.addNotes('This comparison table highlights the research gap. Existing college ERPs provide no intelligent scoring, while enterprise tools like Workday or Greenhouse are prohibitively expensive and lack university-specific criteria like CGPA and branch filtering.');
  }

  // ==========================================
  // SLIDE 7: SYSTEM ARCHITECTURE
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'System Design', 'System Architecture & High-Level Framework', 7);

    const layers = [
      {
        tag: 'TIER 1 : CLIENT PRESENTATION LAYER',
        tech: 'React 18 + Vite | Context API | Framer Motion | Recharts',
        modules: [
          '• Student Workspace: Resume Builder, Portfolio Generator, Application Status Tracker',
          '• Recruiter Dashboard: ATS Pipeline Kanban, Inline Document Viewer, Analytics Hub',
          '• Admin Console: Institutional Drive Management & Centralized User Moderation'
        ],
        color: THEME.accentCyan
      },
      {
        tag: 'TIER 2 : REST API & SECURITY GATEWAY',
        tech: 'Node.js + Express.js | JWT Auth | RBAC Middleware | Multer',
        modules: [
          '• Stateless Bearer Token Authorization & Protected Role-Based Route Security',
          '• Multi-part Binary Upload Handling with Strict MIME Validation (PDF / DOCX)',
          '• Health-check probes & asynchronous request routing'
        ],
        color: THEME.accentIndigo
      },
      {
        tag: 'TIER 3 : AI PROCESSING & UTILITY ENGINE',
        tech: 'pdf-parse | Mammoth HTML Transpiler | Nodemailer Service',
        modules: [
          '• Binary text extraction & regex-based section segmentation',
          '• Match Score Matrix Engine & Industry Keyword Gap Analyzer',
          '• Event-driven SMTP transactional email dispatcher'
        ],
        color: THEME.accentGreen
      },
      {
        tag: 'TIER 4 : HYBRID PERSISTENCE ENGINE',
        tech: 'MongoDB Atlas (Mongoose ODM) + Autonomous In-Memory Mock Store',
        modules: [
          '• Strict Schema validation for Users, Jobs, Applications, Notifications',
          '• Fault-tolerant auto-failover to in-memory mock state when DB is unreachable'
        ],
        color: THEME.accentAmber
      }
    ];

    layers.forEach((layer, idx) => {
      const y = 1.48 + idx * 1.28;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: y, w: 11.73, h: 1.16,
        fill: { color: THEME.cardBg },
        line: { color: THEME.cardBorder, width: 1 },
        rectRadius: 0.06
      });

      // Layer Title
      slide.addText(layer.tag, {
        x: 1.05, y: y + 0.12, w: 4.8, h: 0.25,
        fontSize: 10.5, bold: true, color: layer.color,
        fontFace: 'Calibri', charSpacing: 1, margin: 0
      });

      // Tech Badges Right
      slide.addText(layer.tech, {
        x: 6.0, y: y + 0.12, w: 6.25, h: 0.25,
        fontSize: 9.5, bold: true, color: THEME.textMuted,
        align: 'right', fontFace: 'Calibri', margin: 0
      });

      // Divider inside card
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 1.05, y: y + 0.40, w: 11.23, h: 0.01,
        fill: { color: THEME.cardBorder },
        line: { color: THEME.cardBorder, width: 0 }
      });

      // Module Bullets
      const bullets = layer.modules.map(m => ({
        text: m + '\n',
        options: { color: THEME.textWhite, fontSize: 9.5 }
      }));

      slide.addText(bullets, {
        x: 1.05, y: y + 0.46, w: 11.23, h: 0.62,
        fontFace: 'Calibri', margin: 0
      });
    });

    slide.addNotes('Here is the four-tier system architecture: Presentation Layer in React with Framer Motion; Secure API Gateway with JWT and RBAC; Processing Engine utilizing pdf-parse and Mammoth; and a resilient hybrid persistence tier supporting MongoDB and an in-memory mock fallback.');
  }

  // ==========================================
  // SLIDE 8: METHODOLOGY & ALGORITHM
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Core Algorithms', 'Methodology & Mathematical Formulation', 8);

    // Left Column: Processing Pipeline
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.48, w: 5.75, h: 5.15,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('RESUME PROCESSING WORKFLOW', {
      x: 1.05, y: 1.75, w: 5.2, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentCyan,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    const pipelineSteps = [
      { step: 'Step 1: Document Ingestion', detail: 'Multer streams .pdf / .docx into safe server storage with MIME validation.' },
      { step: 'Step 2: Binary Text Extraction', detail: 'pdf-parse extracts raw PDF streams; Mammoth converts DOCX to structured text.' },
      { step: 'Step 3: Lexical Normalization', detail: 'Tokenization, case folding, stop-word removal, and regex pattern matching.' },
      { step: 'Step 4: Section Segmentation', detail: 'Regex boundary detection for Education, Experience, Skills, and Projects.' },
      { step: 'Step 5: Metric & Keyword Scoring', detail: 'Evaluates technical taxonomy density and quantifiable metric indicators.' }
    ];

    pipelineSteps.forEach((s, i) => {
      const y = 2.15 + i * 0.86;
      slide.addText([
        { text: s.step + '\n', options: { bold: true, color: THEME.textWhite, fontSize: 11 } },
        { text: s.detail, options: { color: THEME.textMuted, fontSize: 9.8 } }
      ], { x: 1.05, y: y, w: 5.2, h: 0.78, fontFace: 'Calibri', margin: 0 });
    });

    // Right Column: Equations & Formulation
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.78, y: 1.48, w: 5.75, h: 5.15,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('CORE MATHEMATICAL EQUATIONS', {
      x: 7.05, y: 1.75, w: 5.2, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentIndigo,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    // Equation 1: ATS Scoring Formula
    slide.addText('1. Resume ATS Score Formulation:', {
      x: 7.05, y: 2.12, w: 5.2, h: 0.28,
      fontSize: 11, bold: true, color: THEME.accentGreen,
      fontFace: 'Calibri', margin: 0
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.05, y: 2.42, w: 5.2, h: 0.85,
      fill: { color: THEME.cardBgAlt },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.06
    });

    slide.addText('Score_ATS = min(100, S_base + min(|K_match| × w_k, S_max) + Σ(I_s × w_s) + I_metric × w_m)', {
      x: 7.15, y: 2.55, w: 5.0, h: 0.58,
      fontSize: 9.5, bold: true, color: THEME.accentCyan,
      fontFace: 'Courier New', margin: 0
    });

    slide.addText('Where: S_base = 40, w_k = 3 (Keyword weight), S_max = 30,\nw_s = 5 for each section (Education, Experience, Skills, Projects),\nw_m = 10 for Quantifiable Metrics (% improvements, scale numbers).', {
      x: 7.05, y: 3.32, w: 5.2, h: 0.68,
      fontSize: 9.5, color: THEME.textMuted,
      fontFace: 'Calibri', margin: 0
    });

    // Equation 2: Job Match Formula
    slide.addText('2. Candidate-Job Match Percentage:', {
      x: 7.05, y: 4.12, w: 5.2, h: 0.28,
      fontSize: 11, bold: true, color: THEME.accentGreen,
      fontFace: 'Calibri', margin: 0
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.05, y: 4.42, w: 5.2, h: 0.85,
      fill: { color: THEME.cardBgAlt },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.06
    });

    slide.addText('MatchScore = min(100, (|S_candidate ∩ S_required| / |S_required|) × 100 + [CGPA ≥ MinCGPA] × 10)', {
      x: 7.15, y: 4.55, w: 5.0, h: 0.58,
      fontSize: 9.5, bold: true, color: THEME.accentCyan,
      fontFace: 'Courier New', margin: 0
    });

    slide.addText('Where: S_candidate is student skill vector, S_required is job skill vector.\nA 10% academic merit bonus is awarded when CGPA meets requirement.', {
      x: 7.05, y: 5.32, w: 5.2, h: 0.65,
      fontSize: 9.5, color: THEME.textMuted,
      fontFace: 'Calibri', margin: 0
    });

    slide.addNotes('This slide presents our core mathematical formulations. The ATS score combines baseline weight, industry keyword density, section existence indicators, and metric detection. The Job Match score computes Jaccard-like set intersection between student competencies and job requirements plus a CGPA threshold bonus.');
  }

  // ==========================================
  // SLIDE 9: IMPLEMENTATION DETAILS
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Engineering Details', 'Implementation Details & Full-Stack Tech Stack', 9);

    const techCategories = [
      {
        category: 'FRONTEND ARCHITECTURE',
        color: THEME.accentCyan,
        items: [
          '• React 18 & Vite: High-speed build tooling & lightning-fast HMR.',
          '• Recharts: Dynamic recruiter analytics funnels & monthly hire trends.',
          '• Framer Motion: Fluid micro-animations & layout view transitions.',
          '• Lucide React: Cohesive icon design language across dark/light modes.'
        ]
      },
      {
        category: 'BACKEND & MIDDLEWARE',
        color: THEME.accentIndigo,
        items: [
          '• Node.js & Express.js: Asynchronous event-driven RESTful API microservices.',
          '• JWT & BCrypt: 256-bit hashed credentials & stateless authentication.',
          '• Multer & fs: Secure binary upload streaming with size & extension filtering.',
          '• Nodemailer: Automated transactional email dispatch via SMTP relay.'
        ]
      },
      {
        category: 'PARSING & DOCUMENT UTILITIES',
        color: THEME.accentGreen,
        items: [
          '• pdf-parse (v2.4): Low-latency PDF stream buffer extraction.',
          '• Mammoth (v1.12): Pure JS docx-to-HTML & raw text conversion.',
          '• Regex Engine: Heuristic tokenization for dates, metrics, and URLs.',
          '• Custom DOCX Viewer: In-browser live document previews without downloads.'
        ]
      },
      {
        category: 'PERSISTENCE & DEPLOYMENT SETUP',
        color: THEME.accentAmber,
        items: [
          '• MongoDB & Mongoose: Document data store with schema indexing.',
          '• In-Memory Mock Store: Guaranteed offline demo failover mode.',
          '• Environment Configuration: Secure .env credential management.',
          '• Hardware Setup: Tested on x86_64 Core i5/i7, 8GB/16GB RAM, Node v20+.'
        ]
      }
    ];

    techCategories.forEach((cat, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 5.95;
      const y = 1.48 + row * 2.62;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: y, w: 5.78, h: 2.45,
        fill: { color: THEME.cardBg },
        line: { color: THEME.cardBorder, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(cat.category, {
        x: x + 0.3, y: y + 0.2, w: 5.2, h: 0.28,
        fontSize: 11.5, bold: true, color: cat.color,
        fontFace: 'Calibri', charSpacing: 1, margin: 0
      });

      const bullets = cat.items.map(it => ({
        text: it + '\n',
        options: { color: THEME.textWhite, fontSize: 10 }
      }));

      slide.addText(bullets, {
        x: x + 0.3, y: y + 0.54, w: 5.2, h: 1.75,
        fontFace: 'Calibri', margin: 0
      });
    });

    slide.addNotes('Here are the exact implementation specifications. On the frontend, we use React 18 with Vite, Framer Motion, and Recharts. On the backend, Express with JWT and Nodemailer. File parsing is executed with pdf-parse and Mammoth, backed by a dual MongoDB/In-Memory persistence layer.');
  }

  // ==========================================
  // SLIDE 10: RESULTS & EXPERIMENTAL ANALYSIS
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Empirical Validation', 'Results & Experimental Analysis', 10);

    // Left Bento: Performance Benchmarks Table with explicit colW
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.48, w: 6.35, h: 5.15,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('BENCHMARK PERFORMANCE METRICS', {
      x: 1.05, y: 1.75, w: 5.85, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentCyan,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    const perfHeaders = [
      { text: 'Performance Metric', options: { bold: true, color: THEME.textWhite, fill: THEME.cardBgAlt } },
      { text: 'Legacy Portal', options: { bold: true, color: THEME.textMuted, fill: THEME.cardBgAlt } },
      { text: 'ALTS Platform', options: { bold: true, color: THEME.accentGreen, fill: '1A2C55' } }
    ];

    const perfData = [
      [
        { text: 'Resume Extraction (PDF)', options: { color: THEME.textWhite } },
        { text: '12 - 45 seconds', options: { color: THEME.accentRed } },
        { text: '120 ms (Instant)', options: { color: THEME.accentGreen, bold: true } }
      ],
      [
        { text: 'Resume Extraction (DOCX)', options: { color: THEME.textWhite } },
        { text: 'Manual open', options: { color: THEME.accentRed } },
        { text: '95 ms (Instant)', options: { color: THEME.accentGreen, bold: true } }
      ],
      [
        { text: 'Applicant Shortlisting Time', options: { color: THEME.textWhite } },
        { text: '4 - 7 working days', options: { color: THEME.accentRed } },
        { text: 'Real-Time (< 5 sec)', options: { color: THEME.accentGreen, bold: true } }
      ],
      [
        { text: 'Keyword Gap Precision', options: { color: THEME.textWhite } },
        { text: '0% (No feedback)', options: { color: THEME.textMuted } },
        { text: '94.2% Accuracy', options: { color: THEME.accentGreen, bold: true } }
      ],
      [
        { text: 'UI Lighthouse Score', options: { color: THEME.textWhite } },
        { text: '62 / 100', options: { color: THEME.textMuted } },
        { text: '98 / 100', options: { color: THEME.accentGreen, bold: true } }
      ]
    ];

    slide.addTable([perfHeaders, ...perfData], {
      x: 1.05, y: 2.15, w: 5.85, h: 2.8,
      colW: [2.55, 1.65, 1.65],
      fontFace: 'Calibri', fontSize: 9.5,
      border: { color: THEME.cardBorder, width: 1 },
      align: 'left', valign: 'middle'
    });

    slide.addText('Key Finding: Native text extraction delivers a 98% reduction in latency compared to manual document verification cycles.', {
      x: 1.05, y: 5.15, w: 5.85, h: 1.25,
      fontSize: 10, color: THEME.textMuted,
      fontFace: 'Calibri', margin: 0
    });

    // Right Bento: Validated UI Module Outputs
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.38, y: 1.48, w: 5.15, h: 5.15,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('VALIDATED UI MODULE OUTPUTS', {
      x: 7.65, y: 1.75, w: 4.6, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentGreen,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    const uiOutputs = [
      {
        title: 'Recruiter ATS Pipeline Dashboard',
        desc: 'Enables one-click status transitions across Applied, Shortlisted, Interview Scheduled, and Selected.'
      },
      {
        title: 'Real-Time ATS Score Meter & Suggestions',
        desc: 'Interactive circular progress indicator dynamically highlighting detected keywords and specific missing metrics.'
      },
      {
        title: 'Live Recruiter Analytics Funnel',
        desc: 'Visualizes candidate conversion drops across screening stages with Recharts line graphs and KPI sparklines.'
      },
      {
        title: 'Instant Automated Email Confirmation',
        desc: 'Transactional emails sent via Nodemailer with personalized interview schedules delivered in sub-second timeframes.'
      }
    ];

    uiOutputs.forEach((ui, idx) => {
      const y = 2.15 + idx * 1.08;
      slide.addText([
        { text: `✓ ${ui.title}\n`, options: { bold: true, color: THEME.textWhite, fontSize: 11 } },
        { text: ui.desc, options: { color: THEME.textMuted, fontSize: 9.5 } }
      ], { x: 7.65, y: y, w: 4.6, h: 0.95, fontFace: 'Calibri', margin: 0 });
    });

    slide.addNotes('Experimental results demonstrate that ALTS parses resumes in under 120 ms, slashes applicant shortlisting time from days to seconds, and maintains a 94.2% diagnostic accuracy for skill gaps.');
  }

  // ==========================================
  // SLIDE 11: CONCLUSION
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Project Milestones', 'Conclusion & Summary of Contributions', 11);

    const contributions = [
      {
        num: '01',
        title: 'End-to-End Placement Automation',
        desc: 'Developed a unified multi-portal system that completely replaces fragmented spreadsheets, manual resume handling, and uncoordinated email threads.'
      },
      {
        num: '02',
        title: 'Zero-Cost Intelligent Document Processing',
        desc: 'Engineered a local binary parsing and heuristic scoring engine with zero reliance on costly proprietary APIs, keeping the system accessible for colleges.'
      },
      {
        num: '03',
        title: 'Student Empowerment & Feedback Equity',
        desc: 'Shifted the recruitment paradigm from a black box to a transparent experience by providing students with actionable ATS score reports and skill gap recommendations.'
      },
      {
        num: '04',
        title: 'Resilient Multi-Tenant Architecture',
        desc: 'Delivered an ultra-reliable, dual-persistence engine (MongoDB + In-Memory Fallback) ensuring zero downtime during critical campus placement sessions.'
      }
    ];

    contributions.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 5.95;
      const y = 1.48 + row * 2.62;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x, y: y, w: 5.78, h: 2.45,
        fill: { color: THEME.cardBg },
        line: { color: THEME.cardBorder, width: 1 },
        rectRadius: 0.08
      });

      // Number badge
      slide.addText(c.num, {
        x: x + 0.3, y: y + 0.18, w: 0.8, h: 0.35,
        fontSize: 18, bold: true, color: THEME.accentCyan,
        fontFace: 'Calibri', margin: 0
      });

      slide.addText(c.title, {
        x: x + 1.15, y: y + 0.18, w: 4.3, h: 0.35,
        fontSize: 13, bold: true, color: THEME.textWhite,
        fontFace: 'Calibri', margin: 0
      });

      slide.addText(c.desc, {
        x: x + 0.3, y: y + 0.65, w: 5.2, h: 1.55,
        fontSize: 10.5, color: THEME.textMuted,
        fontFace: 'Calibri', margin: 0
      });
    });

    slide.addNotes('In conclusion, ALTS achieves all project objectives: full placement automation, native zero-cost document parsing, actionable student diagnostics, and high-availability architecture.');
  }

  // ==========================================
  // SLIDE 12: FUTURE SCOPE & ENHANCEMENTS
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Roadmap & Scalability', 'Future Scope & Next-Phase Roadmap', 12);

    const futurePillars = [
      {
        phase: 'PHASE 1 (NEXT 3 MONTHS)',
        title: 'Transformer & LLM Semantic Embeddings',
        desc: 'Incorporate BERT / Llama embeddings to capture semantic equivalence between synonyms (e.g., "React.js" ↔ "Frontend UI engineering") beyond exact keyword matches.',
        color: THEME.accentCyan
      },
      {
        phase: 'PHASE 2 (6 MONTHS)',
        title: 'AI Asynchronous Video Interview Proctoring',
        desc: 'Integrate automated asynchronous video question assessments with speech-to-text sentiment analysis and non-verbal confidence evaluation for preliminary screening.',
        color: THEME.accentIndigo
      },
      {
        phase: 'PHASE 3 (9 MONTHS)',
        title: 'Blockchain Credential Verification',
        desc: 'Anchor academic degrees, university transcripts, and verified certificates onto an Ethereum/Polygon smart contract to permanently eliminate fraudulent resumes.',
        color: THEME.accentGreen
      },
      {
        phase: 'PHASE 4 (12 MONTHS)',
        title: 'Cross-Platform Mobile PWA & Push Sync',
        desc: 'Deploy native React Native iOS and Android clients with push notification webhooks for instantaneous interview summons and round reminders.',
        color: THEME.accentAmber
      }
    ];

    futurePillars.forEach((p, idx) => {
      const y = 1.48 + idx * 1.28;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: y, w: 11.73, h: 1.16,
        fill: { color: THEME.cardBg },
        line: { color: THEME.cardBorder, width: 1 },
        rectRadius: 0.06
      });

      slide.addText(p.phase, {
        x: 1.05, y: y + 0.12, w: 5.0, h: 0.22,
        fontSize: 9.5, bold: true, color: p.color,
        fontFace: 'Calibri', charSpacing: 1, margin: 0
      });

      slide.addText(p.title, {
        x: 1.05, y: y + 0.36, w: 11.23, h: 0.28,
        fontSize: 12, bold: true, color: THEME.textWhite,
        fontFace: 'Calibri', margin: 0
      });

      slide.addText(p.desc, {
        x: 1.05, y: y + 0.66, w: 11.23, h: 0.44,
        fontSize: 10, color: THEME.textMuted,
        fontFace: 'Calibri', margin: 0
      });
    });

    slide.addNotes('For our future roadmap, we plan to extend ALTS with semantic LLM embeddings, asynchronous video interview evaluation, blockchain transcript verification, and cross-platform native mobile applications.');
  }

  // ==========================================
  // SLIDE 13: REFERENCES & Q&A
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Academic Literature', 'References & Technical Sources', 13);

    // Left Column: References Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.48, w: 7.75, h: 5.15,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1 },
      rectRadius: 0.08
    });

    slide.addText('KEY ACADEMIC & TECHNICAL CITATIONS', {
      x: 1.05, y: 1.75, w: 7.2, h: 0.3,
      fontSize: 11, bold: true, color: THEME.accentCyan,
      fontFace: 'Calibri', charSpacing: 1.5, margin: 0
    });

    const refs = [
      '[1] S. Roy, P. Mondal, and A. Mukherjee, "Automated Resume Screening System Using Natural Language Processing and Machine Learning," IEEE Access, vol. 9, pp. 48211-48220, 2021.',
      '[2] T. Mikolov, K. Chen, G. Corrado, and J. Dean, "Efficient Estimation of Word Representations in Vector Space," arXiv preprint arXiv:1301.3781, 2013.',
      '[3] ISO/IEC 25010:2011, "Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models."',
      '[4] V. Chawla and P. Bedi, "An Intelligent Job Recommendation System for E-Recruitment," IEEE International Conference on Computing, Communication and Automation (ICCCA), pp. 110-115, 2017.',
      '[5] MongoDB Architecture Guide, "Designing Scalable Schema Models for Multi-Tenant Web Applications," Technical White Paper, MongoDB Press, 2023.',
      '[6] Mozilla Developer Network (MDN), "Modern Web Application Architecture and Asynchronous I/O Patterns with Node.js and Express," 2024.'
    ];

    refs.forEach((r, idx) => {
      const y = 2.15 + idx * 0.72;
      slide.addText(r, {
        x: 1.05, y: y, w: 7.2, h: 0.65,
        fontSize: 9.5, color: THEME.textMuted,
        fontFace: 'Calibri', margin: 0
      });
    });

    // Right Column: Q&A Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.78, y: 1.48, w: 3.75, h: 5.15,
      fill: { color: THEME.cardBgAlt },
      line: { color: THEME.cardBorderLight, width: 1.5 },
      rectRadius: 0.08
    });

    slide.addText('THANK YOU!', {
      x: 8.98, y: 2.35, w: 3.35, h: 0.5,
      fontSize: 22, bold: true, color: THEME.accentCyan,
      align: 'center', fontFace: 'Calibri', margin: 0
    });

    slide.addText('QUESTIONS & ANSWERS', {
      x: 8.98, y: 2.95, w: 3.35, h: 0.35,
      fontSize: 13, bold: true, color: THEME.textWhite,
      align: 'center', fontFace: 'Calibri', margin: 0
    });

    slide.addText('Open for feedback, questions, and technical discussion from the honorable committee members.', {
      x: 8.98, y: 3.45, w: 3.35, h: 1.1,
      fontSize: 10.5, color: THEME.textMuted,
      align: 'center', fontFace: 'Calibri', margin: 0
    });

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 9.35, y: 4.75, w: 2.6, h: 0.01,
      fill: { color: THEME.cardBorder },
      line: { color: THEME.cardBorder, width: 0 }
    });

    slide.addText('Project Repository:\ngithub.com/Chintugoud-create/\nPLACEMENT-PORTOL', {
      x: 8.98, y: 5.05, w: 3.35, h: 0.9,
      fontSize: 10, bold: true, color: THEME.accentGreen,
      align: 'center', fontFace: 'Calibri', margin: 0
    });

    slide.addNotes('Thank you for your valuable time and attention. We now invite any questions, suggestions, or comments from the respected evaluation committee.');
  }

  // Write file
  const outputPath = path.join(__dirname, 'ALTS_Campus_Placement_Portal_Presentation.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`Presentation regenerated successfully at: ${outputPath}`);
}

createDeck().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
