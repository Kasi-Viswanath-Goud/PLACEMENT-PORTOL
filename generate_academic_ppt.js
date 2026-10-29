const pptxgen = require('pptxgenjs');
const path = require('path');

async function createAcademicPPT() {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
  pptx.author = 'Department of Computer Science & Engineering, ALTS';
  pptx.title = 'ALTS Campus Placement Portal';

  // ─── RICH ACADEMIC COLOR SYSTEM ──────────────────────────────────
  const C = {
    white:    'FFFFFF',
    bg:       'F8FAFC',    // slate 50 clean light background
    card:     'FFFFFF',    // white card surface
    border:   'CBD5E1',    // slate 300 crisp border
    borderLt: 'E2E8F0',    // slate 200 soft border
    dark:     '0F172A',    // slate 900 high-contrast title
    body:     '334155',    // slate 700 readable body text
    muted:    '64748B',    // slate 500 secondary text

    // Primary Royal & Indigo
    blue:     '1D4ED8',    // royal blue
    blueLt:   'DBEAFE',    // blue badge tint
    blueBg:   'EFF6FF',    // ice blue card bg
    indigo:   '4338CA',    // rich indigo
    indigoLt: 'E0E7FF',    // indigo badge tint
    indigoBg: 'EEF2FF',    // soft indigo card bg

    // Vibrant Purple / Violet (AI, Algorithms, Intelligence)
    purple:   '7C3AED',    // electric violet
    purpleLt: 'EDE9FE',    // purple badge tint
    purpleBg: 'F5F3FF',    // purple tint card bg

    // Fresh Teal / Cyan (Architecture, Client UI, Ingestion)
    teal:     '0D9488',    // deep teal
    tealLt:   'CCFBF1',    // teal badge tint
    tealBg:   'F0FDFA',    // teal tint card bg

    // Emerald Green (Success, Placed, Verified, Goals)
    green:    '059669',    // rich emerald
    greenLt:  'D1FAE5',    // green badge tint
    greenBg:  'ECFDF5',    // green tint card bg

    // Warm Amber & Tangerine (Decisions, Warnings, Benchmarks)
    amber:    'D97706',    // warm amber
    amberLt:  'FEF3C7',    // amber badge tint
    amberBg:  'FFFBEB',    // amber tint card bg

    // Crimson & Coral Rose (Bottlenecks, Rejection, Errors)
    rose:     'E11D48',    // vivid rose/crimson
    roseLt:   'FFE4E6',    // rose badge tint
    roseBg:   'FFF1F2',    // rose tint card bg
  };

  const FONT = {
    heading: 'Calibri',
    body: 'Calibri',
  };

  // ─── SHARED HELPERS ──────────────────────────────────────────────
  let slideIndex = 0;

  function addContentSlide(slide, category, title, theme = C.blue) {
    slideIndex++;
    slide.background = { color: C.bg };

    // Top primary accent bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: 13.333, h: 0.08, fill: { color: theme }
    });

    // Sub-accent color ribbon
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0.08, w: 3.5, h: 0.025, fill: { color: C.purple }
    });

    // Category pill badge (top left)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 0.28, w: 2.4, h: 0.28,
      fill: { color: theme === C.blue ? C.blueLt : (theme === C.green ? C.greenLt : (theme === C.rose ? C.roseLt : (theme === C.purple ? C.purpleLt : (theme === C.amber ? C.amberLt : C.tealLt)))) },
      line: { color: theme, width: 0.8 },
      rectRadius: 0.05,
    });
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.28, w: 2.4, h: 0.28,
      fontSize: 8.5, bold: true, color: theme,
      fontFace: FONT.body, charSpacing: 2, align: 'center', valign: 'middle',
    });

    // College Name Tag (Top right)
    slide.addText('ALTS | CAMPUS PLACEMENT PORTAL', {
      x: 8.5, y: 0.28, w: 4.0, h: 0.28,
      fontSize: 8.5, bold: true, color: C.muted,
      fontFace: FONT.body, align: 'right', valign: 'middle', charSpacing: 1.5,
    });

    // Title
    slide.addText(title, {
      x: 0.8, y: 0.62, w: 11.5, h: 0.52,
      fontSize: 23, bold: true, color: C.dark,
      fontFace: FONT.heading,
    });

    // Colored divider line under title
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8, y: 1.20, w: 2.4, h: 0.035, fill: { color: theme }
    });

    // Slide number
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 12.1, y: 6.95, w: 0.7, h: 0.35,
      fill: { color: C.white }, line: { color: C.borderLt, width: 0.5 }, rectRadius: 0.04
    });
    slide.addText(`${String(slideIndex).padStart(2, '0')}`, {
      x: 12.1, y: 6.95, w: 0.7, h: 0.35,
      fontSize: 9.5, bold: true, color: theme, fontFace: FONT.body, align: 'center', valign: 'middle',
    });
  }

  function addBulletList(slide, items, x = 0.8, y = 1.45, w = 11.7, fontSize = 12.5, bulletColor = C.blue) {
    const textRows = items.map(item => ({
      text: item,
      options: {
        fontSize, color: C.body, fontFace: FONT.body,
        bullet: { type: 'bullet', color: bulletColor },
        paraSpaceAfter: 7, lineSpacingMultiple: 1.35,
        indentLevel: 0,
      }
    }));
    slide.addText(textRows, { x, y, w, h: 5.6, valign: 'top' });
  }

  function drawBox(slide, x, y, w, h, label, opts = {}) {
    const {
      fill = C.card,
      border = C.border,
      fontSize = 9.2,
      color = C.dark,
      radius = 0.06,
      bold = true,
      align = 'center',
      valign = 'middle',
      borderWidth = 1.0,
      lineSpacing = 1.25,
    } = opts;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h,
      fill: { color: fill },
      line: { color: border, width: borderWidth },
      rectRadius: radius,
    });
    slide.addText(label, {
      x: x + 0.06, y: y + 0.04, w: w - 0.12, h: h - 0.08,
      fontSize, bold, color,
      fontFace: FONT.body, align, valign,
      lineSpacingMultiple: lineSpacing,
    });
  }

  function drawPill(slide, x, y, w, h, label, opts = {}) {
    const {
      fill = C.blue,
      border = C.blue,
      fontSize = 9,
      color = C.white,
      bold = true,
      borderWidth = 1.0,
    } = opts;

    slide.addShape(pptx.shapes.FLOWCHART_TERMINATOR, {
      x, y, w, h,
      fill: { color },
      line: { color: border, width: borderWidth },
    });
    slide.addText(label, {
      x: x + 0.05, y: y + 0.02, w: w - 0.1, h: h - 0.04,
      fontSize, bold, color,
      fontFace: FONT.body, align: 'center', valign: 'middle',
    });
  }

  function drawDiamond(slide, x, y, w, h, label, opts = {}) {
    const {
      fill = C.amberBg,
      border = C.amber,
      fontSize = 8.5,
      color = C.dark,
      bold = true,
      borderWidth = 1.2,
    } = opts;

    slide.addShape(pptx.shapes.FLOWCHART_DECISION, {
      x, y, w, h,
      fill: { color },
      line: { color: border, width: borderWidth },
    });
    slide.addText(label, {
      x: x + 0.18, y: y + 0.1, w: w - 0.36, h: h - 0.2,
      fontSize, bold, color,
      fontFace: FONT.body, align: 'center', valign: 'middle',
      lineSpacingMultiple: 1.15,
    });
  }

  function drawArrow(slide, x1, y1, x2, y2, opts = {}) {
    const { color = C.blue, width = 1.3, label = '', labelColor = null, labelBg = C.white } = opts;
    const w = x2 - x1;
    const h = y2 - y1;

    slide.addShape(pptx.shapes.LINE, {
      x: x1, y: y1,
      w: Math.abs(w) < 0.001 ? 0 : w,
      h: Math.abs(h) < 0.001 ? 0 : h,
      line: { color, width, endArrowType: 'triangle' },
    });

    if (label) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      if (labelBg) {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
          x: midX - 0.45, y: midY - 0.14, w: 0.9, h: 0.28,
          fill: { color: labelBg }, line: { color: C.borderLt, width: 0.5 }, rectRadius: 0.04
        });
      }
      slide.addText(label, {
        x: midX - 0.6, y: midY - 0.15, w: 1.2, h: 0.3,
        fontSize: 7.5, bold: true, color: labelColor || color,
        fontFace: FONT.body, align: 'center', valign: 'middle',
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 1 — TITLE SLIDE (RICH COLORED BANNER & BADGES)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    slide.background = { color: C.white };

    // Top primary decorative bars
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: 13.333, h: 0.10, fill: { color: C.blue }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0.10, w: 6.5, h: 0.03, fill: { color: C.purple }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: C.blue }
    });

    // College Badge Pill (Top Left)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 0.60, w: 3.8, h: 0.42,
      fill: { color: C.blueBg }, line: { color: C.blue, width: 1.2 }, rectRadius: 0.06
    });
    slide.addText('ALTS | CAMPUS PLACEMENT PORTAL', {
      x: 0.8, y: 0.60, w: 3.8, h: 0.42,
      fontSize: 10, bold: true, color: C.blue, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 1.5,
    });

    // Project Title
    slide.addText('ALTS: AI-Powered Campus\nPlacement Portal', {
      x: 0.8, y: 1.20, w: 11.5, h: 1.55,
      fontSize: 38, bold: true, color: C.dark,
      fontFace: FONT.heading, lineSpacingMultiple: 1.15,
    });

    // Subtitle
    slide.addText('A Full-Stack MERN Application Featuring Intelligent Resume Matching,\nAutomated SMTP Email Workflows & Interactive Placement Analytics', {
      x: 0.8, y: 2.85, w: 11.5, h: 0.8,
      fontSize: 14.5, color: C.body,
      fontFace: FONT.body, lineSpacingMultiple: 1.3,
    });

    // Accent line divider
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8, y: 3.85, w: 11.5, h: 0.018, fill: { color: C.borderLt }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8, y: 3.85, w: 2.8, h: 0.025, fill: { color: C.blue }
    });

    // Team Card (Left Box)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 4.10, w: 5.6, h: 2.30,
      fill: { color: C.bg }, line: { color: C.borderLt, width: 1 }, rectRadius: 0.06
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.05, y: 4.25, w: 2.0, h: 0.28,
      fill: { color: C.blueLt }, line: { color: C.blue, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('PROJECT TEAM', {
      x: 1.05, y: 4.25, w: 2.0, h: 0.28,
      fontSize: 8.5, bold: true, color: C.blue, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 2,
    });
    slide.addText(
      '1. [Student Name 1]  (Roll No: XXXXXX)\n' +
      '2. [Student Name 2]  (Roll No: XXXXXX)\n' +
      '3. [Student Name 3]  (Roll No: XXXXXX)\n' +
      '4. [Student Name 4]  (Roll No: XXXXXX)', {
      x: 1.05, y: 4.65, w: 5.1, h: 1.6,
      fontSize: 12.5, color: C.body, fontFace: FONT.body, lineSpacingMultiple: 1.45,
    });

    // Guidance Card (Right Box)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.7, y: 4.10, w: 5.8, h: 2.30,
      fill: { color: C.bg }, line: { color: C.borderLt, width: 1 }, rectRadius: 0.06
    });

    // Supervisor Tag
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.95, y: 4.25, w: 2.2, h: 0.28,
      fill: { color: C.purpleLt }, line: { color: C.purple, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('FACULTY GUIDE', {
      x: 6.95, y: 4.25, w: 2.2, h: 0.28,
      fontSize: 8.5, bold: true, color: C.purple, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 2,
    });
    slide.addText('[Supervisor Name]\n[Designation, Department of CSE]', {
      x: 6.95, y: 4.60, w: 5.3, h: 0.55,
      fontSize: 12.5, bold: true, color: C.dark, fontFace: FONT.body, lineSpacingMultiple: 1.3,
    });

    // Institution Tag (ALTS explicitly highlighted!)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.95, y: 5.30, w: 2.6, h: 0.28,
      fill: { color: C.tealLt }, line: { color: C.teal, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('INSTITUTION / COLLEGE', {
      x: 6.95, y: 5.30, w: 2.6, h: 0.28,
      fontSize: 8.5, bold: true, color: C.teal, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 2,
    });
    slide.addText('Department of Computer Science & Engineering\nALTS', {
      x: 6.95, y: 5.65, w: 5.3, h: 0.60,
      fontSize: 13, bold: true, color: C.blue, fontFace: FONT.body, lineSpacingMultiple: 1.3,
    });

    // Academic Year Badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 6.60, w: 2.4, h: 0.40,
      fill: { color: C.indigoLt }, line: { color: C.indigo, width: 0.8 }, rectRadius: 0.06,
    });
    slide.addText('Academic Year 2025–2026', {
      x: 0.8, y: 6.60, w: 2.4, h: 0.40,
      fontSize: 9.5, bold: true, color: C.indigo, fontFace: FONT.body, align: 'center',
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 2 — AGENDA (COLOR CODED TOPICS)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Overview', 'Agenda & Presentation Roadmap', C.indigo);

    const agendaItems = [
      ['01', 'Abstract & Motivation', C.blue, C.blueLt],
      ['02', 'Problem Statement & Existing Bottlenecks', C.rose, C.roseLt],
      ['03', 'Project Objectives & Target Scope', C.green, C.greenLt],
      ['04', 'Literature Survey / Related Work & Research Gap', C.amber, C.amberLt],
      ['05', 'System Architecture & Component Interaction Flowchart', C.teal, C.tealLt],
      ['06', 'Methodology, ATS Algorithm & Lifecycle Flowcharts', C.purple, C.purpleLt],
      ['07', 'Implementation Details & Security Architecture Flowchart', C.indigo, C.indigoLt],
      ['08', 'Results, Feature Validation & Placement Funnel', C.green, C.greenLt],
      ['09', 'Conclusion & Key Project Contributions', C.blue, C.blueLt],
      ['10', 'Future Scope & Enhancements Roadmap', C.purple, C.purpleLt],
      ['11', 'References & Key Academic Citations', C.muted, C.bg],
    ];

    const startY = 1.45;
    const rowH = 0.47;
    agendaItems.forEach(([num, label, color, bg], i) => {
      const y = startY + i * rowH;
      // Colored Badge
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: y, w: 0.58, h: 0.36,
        fill: { color: bg },
        line: { color: color, width: 0.8 },
        rectRadius: 0.04,
      });
      slide.addText(num, {
        x: 0.8, y: y, w: 0.58, h: 0.36,
        fontSize: 10, bold: true, color: color, fontFace: FONT.body, align: 'center', valign: 'middle',
      });
      // Text
      slide.addText(label, {
        x: 1.55, y: y, w: 10.5, h: 0.36,
        fontSize: 13.5, color: C.dark, fontFace: FONT.body, valign: 'middle',
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 3 — ABSTRACT & MOTIVATION (ALTS HIGHLIGHTED)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Introduction', 'Abstract & Motivation', C.blue);

    // Abstract Card with Blue Accent Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.45, w: 11.7, h: 2.35,
      fill: { color: C.white },
      line: { color: C.blue, width: 1.2 },
      rectRadius: 0.08,
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: 1.55, w: 2.8, h: 0.28,
      fill: { color: C.blueLt }, line: { color: C.blue, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('PROJECT ABSTRACT', {
      x: 1.1, y: 1.55, w: 2.8, h: 0.28,
      fontSize: 8.5, bold: true, color: C.blue, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 2,
    });
    slide.addText(
      'The ALTS Campus Placement Portal is a modern full-stack MERN web application developed specifically for ALTS to ' +
      'digitize and automate collegiate recruitment. The platform provides dedicated role-isolated portals for ALTS Students, ' +
      'Visiting Recruiters, and the Placement Cell. Core capabilities include smart resume building with PDF/DOCX text ' +
      'extraction, AI-assisted ATS compatibility scoring, multi-criteria job filtering, automated SMTP notification triggers via ' +
      'NodeMailer, and interactive hiring analytics powered by Recharts. By replacing manual paperwork and disparate spreadsheets ' +
      'with a unified digital gateway, ALTS ensures transparency, auditability, and efficiency across all campus recruitment drives.', {
      x: 1.1, y: 1.90, w: 11.1, h: 1.75,
      fontSize: 12.5, color: C.body, fontFace: FONT.body, lineSpacingMultiple: 1.45, valign: 'top',
    });

    // Key Motivations
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 4.05, w: 3.2, h: 0.28,
      fill: { color: C.indigoLt }, line: { color: C.indigo, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('CORE DRIVING MOTIVATIONS AT ALTS', {
      x: 0.8, y: 4.05, w: 3.2, h: 0.28,
      fontSize: 8.5, bold: true, color: C.indigo, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 1.5,
    });

    const motivations = [
      'Eliminate manual overhead: Replace manual spreadsheets, paper resumes, and WhatsApp broadcast groups with a secure portal.',
      'Empower ALTS students: Give students a central dashboard to track application status in real-time across multiple companies.',
      'Accelerate recruiter shortlisting: Large applicant pools filtered instantly through automated keyword and ATS compatibility scoring.',
      'Enable institutional governance: Placement Officers obtain real-time insights on branch-wise placement percentages and CTC metrics.',
      'Democratized internal portal: An in-house, zero-licensing-cost placement ecosystem customized to ALTS academic policies.',
    ];
    addBulletList(slide, motivations, 0.8, 4.45, 11.7, 12.5, C.indigo);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 4 — PROBLEM STATEMENT (ROSE/CRIMSON COLOR PALETTE)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Problem', 'Problem Statement & Existing Bottlenecks', C.rose);

    const problems = [
      { title: 'Fragmented Communication', desc: 'Placement notifications scattered across WhatsApp groups, disparate emails, and notice boards, causing missed interview deadlines and information leakage.', code: 'CH-01' },
      { title: 'Manual Resume Screening', desc: 'Placement teams and HRs manually inspect hundreds of unstandardized resumes, leading to reviewer fatigue, cognitive bias, and lengthy turnaround times.', code: 'CH-02' },
      { title: 'Opaque Application Tracking', desc: 'Students lack real-time visibility into whether their profiles were viewed, shortlisted, or rejected, fostering anxiety and persistent uncertainty.', code: 'CH-03' },
      { title: 'Lack of Placement Analytics', desc: 'College administrators lack automated reporting tools to track department-wise placement velocity, average CTC trends, and recruiter participation metrics.', code: 'CH-04' },
      { title: 'Format Inconsistency', desc: 'Submissions range from non-parsable image PDFs to unformatted Word files, preventing standard keyword matching and structured database queries.', code: 'CH-05' },
      { title: 'Absence of Automated Follow-ups', desc: 'Interview scheduling, selection notices, and regret communications are drafted manually, resulting in severe human delay and communication errors.', code: 'CH-06' },
    ];

    const colW = 5.6;
    const rowH = 1.45;
    const startX = 0.8;
    const startY = 1.45;

    problems.forEach((p, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (colW + 0.5);
      const y = startY + row * (rowH + 0.25);

      // Card with soft rose border
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y, w: colW, h: rowH,
        fill: { color: C.white },
        line: { color: C.roseLt, width: 1.5 },
        rectRadius: 0.08,
      });

      // Rose tag badge
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.2, y: y + 0.16, w: 0.8, h: 0.28,
        fill: { color: C.roseLt }, line: { color: C.rose, width: 0.8 },
        rectRadius: 0.04,
      });
      slide.addText(p.code, {
        x: x + 0.2, y: y + 0.16, w: 0.8, h: 0.28,
        fontSize: 8.5, bold: true, color: C.rose, fontFace: FONT.body, align: 'center', valign: 'middle',
      });

      slide.addText(p.title, {
        x: x + 1.15, y: y + 0.15, w: colW - 1.35, h: 0.32,
        fontSize: 12.5, bold: true, color: C.dark, fontFace: FONT.body,
      });
      slide.addText(p.desc, {
        x: x + 0.2, y: y + 0.55, w: colW - 0.4, h: 0.8,
        fontSize: 10.5, color: C.body, fontFace: FONT.body, lineSpacingMultiple: 1.35, valign: 'top',
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 5 — PROJECT OBJECTIVES (EMERALD GREEN PALETTE)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Goals', 'Project Objectives & Target Scope', C.green);

    const objectives = [
      'Architect a Tri-Role Secure Web Portal: Implement isolated access spaces for Students, Recruiters, and Placement Administrators guarded by JWT authentication and bcrypt cryptography.',
      'Develop Document Ingestion & Parsing Subsystems: Integrate pdf-parse and mammoth to extract plain-text representations from uploaded PDF and DOCX student resumes.',
      'Construct ATS Compatibility & Keyword Engine: Calculate match scores between applicant technical profiles and recruiter requirement vectors to generate candidate rankings.',
      'Engineer Automated Email Dispatch System: Configure NodeMailer with HTML notification templates to auto-transmit status updates (Shortlisted, Interview Scheduled, Offer Extended).',
      'Provide Real-Time Application Lifecycle Tracking: Build live state management allowing students to track applications through distinct stages: Applied ➔ Screened ➔ Interview ➔ Selected.',
      'Implement Interactive Visual Placement Analytics: Embed Recharts dashboards rendering hiring funnels, monthly drive trends, and recruiter conversion metrics.',
      'Deliver Dynamic Student Portfolio & Resume Builder: Provide in-app template generators to standardize student CVs with validated sections (Education, Projects, Skills, Certifications).',
      'Ensure Modern Responsive UI/UX Standards: Implement smooth transitions using Framer Motion, adaptive dark/light design systems, and responsive layout scaling across all viewports.',
    ];

    addBulletList(slide, objectives, 0.8, 1.45, 11.7, 12.5, C.green);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 6 — LITERATURE SURVEY (AMBER / BENCHMARK PALETTE)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Benchmarking', 'Literature Survey / Related Work & Research Gap', C.amber);

    const tableData = [
      [
        { text: 'Platform / Approach', options: { bold: true, fontSize: 10.5, color: C.white, fill: { color: C.amber }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
        { text: 'Core Architecture & Strengths', options: { bold: true, fontSize: 10.5, color: C.white, fill: { color: C.amber }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
        { text: 'Identified Limitations & Gaps in Context of Campus Drives', options: { bold: true, fontSize: 10.5, color: C.white, fill: { color: C.amber }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'LinkedIn / Indeed', options: { fontSize: 10, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Global reach, professional networking, broad job aggregators, sponsored job listings.', options: { fontSize: 9.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Lacks institutional placement drive governance; no college TPO oversight; expensive recruiter subscriptions.', options: { fontSize: 9.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
      ],
      [
        { text: 'Superset / Handshake', options: { fontSize: 10, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'College-oriented campus hiring workflow, university database syncing, centralized job board.', options: { fontSize: 9.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Proprietary closed-source code; high enterprise licensing fees; lacks automated transparent ATS scoring algorithms.', options: { fontSize: 9.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
      ],
      [
        { text: 'Legacy College ERPs', options: { fontSize: 10, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Direct integration with college student records, marksheet data, attendance records.', options: { fontSize: 9.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Outdated monolithic UIs, absence of recruiter self-service dashboards, zero real-time messaging, no resume parsing.', options: { fontSize: 9.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
      ],
      [
        { text: 'Academic ML Prototypes (IEEE / Springer)', options: { fontSize: 10, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'High theoretical accuracy in candidate ranking via NLP, TF-IDF, and word embeddings.', options: { fontSize: 9.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Proof-of-concept models only; lack full-stack production architecture, auth pipelines, email triggers, and UI.', options: { fontSize: 9.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
      ],
    ];

    slide.addTable(tableData, {
      x: 0.8, y: 1.45, w: 11.7,
      border: { type: 'solid', color: C.border, pt: 0.75 },
      colW: [2.5, 4.6, 4.6],
      rowH: [0.42, 0.65, 0.65, 0.65, 0.65],
      margin: [4, 8, 4, 8],
    });

    // Research gap card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 4.85, w: 11.7, h: 1.85,
      fill: { color: C.amberBg },
      line: { color: C.amber, width: 1.2 },
      rectRadius: 0.08,
    });
    slide.addText('SYNTHESIZED RESEARCH & DEVELOPMENT GAP', {
      x: 1.1, y: 4.95, w: 6, h: 0.28,
      fontSize: 9, bold: true, color: C.amber, fontFace: FONT.body, charSpacing: 3,
    });
    slide.addText(
      'Current offerings leave educational institutions with a binary dilemma: either pay exorbitant annual subscriptions for ' +
      'proprietary enterprise platforms (Superset) or struggle with archaic, unmaintained ERP modules lacking intelligence. ' +
      'There is a conspicuous lack of an open-source, full-stack MERN placement platform that natively integrates resume text ' +
      'extraction, ATS scoring, multi-tenant RBAC, automated SMTP notifications, and real-time visual analytics into a ' +
      'single, freely hostable system for colleges like ALTS.', {
      x: 1.1, y: 5.30, w: 11.1, h: 1.25,
      fontSize: 11.5, color: C.dark, fontFace: FONT.body, lineSpacingMultiple: 1.45, valign: 'top',
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 7 — SYSTEM ARCHITECTURE: MULTI-TIER (COLOR-CODED LAYERS)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Architecture', 'System Architecture: High-Level Multi-Tier Framework', C.teal);

    // --- LAYER 1: Client (Teal) ---
    slide.addText('PRESENTATION TIER (CLIENT SPA — REACT 18 + VITE)', {
      x: 0.8, y: 1.45, w: 11.7, h: 0.25,
      fontSize: 8.5, bold: true, color: C.teal, fontFace: FONT.body, charSpacing: 2,
    });

    const clientBoxes = [
      'React 18 + Vite\n(Modular SPA)',
      'React Router v6\n(Protected Routes)',
      'Context API\n(Auth & Theme State)',
      'Framer Motion\n(Micro-Animations)',
      'Recharts Engine\n(Visual Analytics)',
      'Lucide React\n(Accessible Icons)',
    ];
    clientBoxes.forEach((label, i) => {
      drawBox(slide, 0.8 + i * 1.98, 1.75, 1.80, 0.72, label, { fontSize: 8.5, fill: C.tealBg, border: C.teal });
    });

    drawArrow(slide, 6.6, 2.55, 6.6, 2.95, { label: 'HTTP REST / JSON', color: C.teal });

    // --- LAYER 2: Business Logic (Indigo) ---
    slide.addText('APPLICATION & BUSINESS LOGIC TIER (EXPRESS.JS / NODE.JS)', {
      x: 0.8, y: 3.02, w: 11.7, h: 0.25,
      fontSize: 8.5, bold: true, color: C.indigo, fontFace: FONT.body, charSpacing: 2,
    });

    const serverBoxes = [
      'Express.js REST API\n(Routing Gateway)',
      'JWT Auth Middleware\n(Token Verification)',
      'Multer Subsystem\n(Binary File Uploads)',
      'pdf-parse Engine\n(PDF Text Extraction)',
      'Mammoth Engine\n(DOCX Text Extraction)',
      'NodeMailer SMTP\n(Automated Alerts)',
    ];
    serverBoxes.forEach((label, i) => {
      drawBox(slide, 0.8 + i * 1.98, 3.32, 1.80, 0.72, label, { fontSize: 8.5, fill: C.indigoBg, border: C.indigo });
    });

    drawArrow(slide, 6.6, 4.12, 6.6, 4.52, { label: 'API Endpoints', color: C.indigo });

    // --- LAYER 3: API Endpoint Routing (Purple) ---
    slide.addText('REST API ENDPOINT CONTRACTS (EXPRESS ROUTERS)', {
      x: 0.8, y: 4.58, w: 11.7, h: 0.25,
      fontSize: 8.5, bold: true, color: C.purple, fontFace: FONT.body, charSpacing: 2,
    });

    const routeBoxes = [
      '/api/auth\n(Login/Register)',
      '/api/jobs\n(CRUD & Filters)',
      '/api/applications\n(State Tracking)',
      '/api/student\n(Profile & Resume)',
      '/api/messages\n(Direct Comms)',
      '/api/admin\n(Governance & Approval)',
    ];
    routeBoxes.forEach((label, i) => {
      drawBox(slide, 0.8 + i * 1.98, 4.88, 1.80, 0.58, label, { fontSize: 8.0, fill: C.purpleBg, border: C.purple });
    });

    drawArrow(slide, 6.6, 5.54, 6.6, 5.92, { label: 'Mongoose ODM', color: C.purple });

    // --- LAYER 4: Persistence (Green) ---
    slide.addText('DATA PERSISTENCE & STORAGE TIER (MONGODB & CLUSTER)', {
      x: 0.8, y: 5.98, w: 11.7, h: 0.25,
      fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, charSpacing: 2,
    });

    const dbBoxes = [
      'MongoDB Atlas\n(Cloud Database)',
      'Users Collection\n(Bcrypt Hashes)',
      'Jobs Collection\n(Requirements/CTC)',
      'Applications Coll.\n(Status/ATS Score)',
      'Messages Coll.\n(Chat History)',
      'File System Storage\n(uploads/ Resumes)',
    ];
    dbBoxes.forEach((label, i) => {
      drawBox(slide, 0.8 + i * 1.98, 6.28, 1.80, 0.65, label, {
        fontSize: 8.0,
        fill: C.greenBg,
        border: C.green,
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 8 — COMPONENT INTERACTION FLOWCHART (VIBRANT COLORS)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Architecture', 'Component Interaction & Data Flowchart', C.teal);

    // User Role Boxes (Top)
    const userEntities = [
      { label: 'Student Client (ALTS)\n(React SPA / AuthContext)', x: 1.0, w: 3.4, color: C.blue, bg: C.blueBg },
      { label: 'Recruiter Client\n(React SPA / Dashboard)', x: 5.0, w: 3.4, color: C.purple, bg: C.purpleBg },
      { label: 'Placement Admin (ALTS)\n(React SPA / Analytics)', x: 9.0, w: 3.4, color: C.teal, bg: C.tealBg },
    ];

    userEntities.forEach(u => {
      drawBox(slide, u.x, 1.50, u.w, 0.65, u.label, {
        fontSize: 9.5, fill: u.bg, border: u.color
      });
      // Down arrow to API gateway
      drawArrow(slide, u.x + u.w / 2, 2.15, u.x + u.w / 2, 2.65, { color: u.color });
    });

    // Subtitle on arrows
    slide.addText('Secure HTTPS REST Requests (with JWT Bearer Header in Authorization)', {
      x: 1.0, y: 2.30, w: 11.4, h: 0.25,
      fontSize: 8, color: C.muted, fontFace: FONT.body, align: 'center',
    });

    // API Gateway Central Bar (Navy / Royal)
    drawBox(slide, 1.0, 2.65, 11.4, 0.65,
      'Express.js API Gateway & Security Gateway\n(CORS Policy, Helmet Protection, JSON Body Parser, Rate Limiter)',
      { fontSize: 10, fill: C.white, border: C.dark, borderWidth: 1.4 }
    );

    // 4 Backend Processing Subsystems with individual color coding
    const subsystems = [
      {
        x: 1.0, w: 2.6, color: C.indigo, bg: C.indigoBg,
        title: 'Auth & RBAC Guard\n• JWT Token Verifier\n• bcrypt Hash Check\n• Role Verification',
      },
      {
        x: 3.93, w: 2.6, color: C.amber, bg: C.amberBg,
        title: 'Resume Engine\n• Multer Multipart Stream\n• pdf-parse Reader\n• mammoth DOCX Reader',
      },
      {
        x: 6.86, w: 2.6, color: C.purple, bg: C.purpleBg,
        title: 'Job & ATS Logic\n• Vector Skill Matching\n• Eligibility Filter\n• Application Pipeline',
      },
      {
        x: 9.8, w: 2.6, color: C.green, bg: C.greenBg,
        title: 'Notification Service\n• NodeMailer SMTP Client\n• HTML Template Engine\n• Status Event Triggers',
      },
    ];

    subsystems.forEach(s => {
      drawArrow(slide, s.x + s.w / 2, 3.30, s.x + s.w / 2, 3.75, { color: s.color });
      drawBox(slide, s.x, 3.75, s.w, 1.40, s.title, {
        fontSize: 8.5, fill: s.bg, border: s.color, lineSpacing: 1.3
      });
    });

    // Connecting arrows down to Data Layer
    drawArrow(slide, 2.3, 5.15, 2.3, 5.65, { color: C.indigo });
    drawArrow(slide, 5.23, 5.15, 6.7, 5.65, { color: C.amber });
    drawArrow(slide, 8.16, 5.15, 4.0, 5.65, { color: C.purple });
    drawArrow(slide, 11.1, 5.15, 11.1, 5.65, { color: C.green });

    // Persistence Layer Targets
    drawBox(slide, 1.0, 5.65, 4.5, 0.85,
      'MongoDB Atlas Database (Mongoose ODM)\nSchemas: User, Job, Application, Message, StudentProfile',
      { fontSize: 9, fill: C.blueBg, border: C.blue }
    );

    drawBox(slide, 5.8, 5.65, 3.5, 0.85,
      'Server File System (/uploads)\nStores binary PDF/DOCX resumes with sanitized filenames',
      { fontSize: 8.5, fill: C.amberBg, border: C.amber }
    );

    drawBox(slide, 9.6, 5.65, 2.8, 0.85,
      'External SMTP Server\nTransmits transactional HTML emails directly to Student Inbox',
      { fontSize: 8.5, fill: C.greenBg, border: C.green }
    );

    // Flow explanation note
    drawBox(slide, 1.0, 6.65, 11.4, 0.38,
      'Lifecycle: 1. SPA sends Bearer JWT ➔ 2. Gateway authenticates role ➔ 3. Controller executes logic ➔ 4. MongoDB updates ➔ 5. Alerts dispatched via SMTP.',
      { fontSize: 8.5, fill: C.bg, border: C.borderLt, bold: false }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 9 — METHODOLOGY: MATHEMATICAL FORMULATIONS (PURPLE PALETTE)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Methodology', 'Methodology & Processing Logic: Mathematical Formulations', C.purple);

    // Left Column: Mathematical Equations Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.45, w: 5.7, h: 5.4,
      fill: { color: C.white },
      line: { color: C.purple, width: 1.4 },
      rectRadius: 0.08,
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: 1.58, w: 3.4, h: 0.28,
      fill: { color: C.purpleLt }, line: { color: C.purple, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('CORE MATHEMATICAL EQUATIONS', {
      x: 1.1, y: 1.58, w: 3.4, h: 0.28,
      fontSize: 8.5, bold: true, color: C.purple, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 2,
    });

    const equations = [
      {
        title: '1. Composite ATS Candidate Match Score',
        formula: 'S_total = (w_s · S_skills) + (w_e · E_exp) + (w_a · A_cgpa) + (w_p · P_proj)',
        desc: 'Weighted linear combination where weights sum to unity:\nw_s = 0.45 (Skills), w_e = 0.25 (Internships), w_a = 0.15 (Academic CGPA), w_p = 0.15 (Projects).',
      },
      {
        title: '2. Cosine Similarity for Skill Vector Alignment',
        formula: 'Cosine(R, J) = ( R · J ) / ( ||R|| · ||J|| ) = Σ(R_i · J_i) / ( √Σ R_i² · √Σ J_i² )',
        desc: 'Measures angular proximity between resume skill frequency vector R and job requirement vector J in multi-dimensional skill space.',
      },
      {
        title: '3. Keyword Coverage Metric',
        formula: 'Coverage % = ( | K_Resume ∩ K_Job | / | K_Job | ) × 100%',
        desc: 'Calculates percentage of mandatory recruiter technical competencies satisfied directly within candidate resume text.',
      },
      {
        title: '4. Cryptographic JWT Verification HMAC-SHA256',
        formula: 'Signature = HMAC-SHA256( Base64URL(Header) || "." || Base64URL(Payload), Secret )',
        desc: 'Tamper-evident stateless token validation executed on every API route invocation.',
      },
    ];

    equations.forEach((eq, i) => {
      const ey = 1.95 + i * 1.20;
      slide.addText(eq.title, {
        x: 1.1, y: ey, w: 5.1, h: 0.25,
        fontSize: 10, bold: true, color: C.dark, fontFace: FONT.body,
      });
      // Formula background box (Purple tint)
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 1.1, y: ey + 0.26, w: 5.1, h: 0.36,
        fill: { color: C.purpleBg }, line: { color: C.purpleLt, width: 0.8 }, rectRadius: 0.04,
      });
      slide.addText(eq.formula, {
        x: 1.2, y: ey + 0.26, w: 4.9, h: 0.36,
        fontSize: 8.8, bold: true, color: C.purple, fontFace: 'Consolas', valign: 'middle',
      });
      slide.addText(eq.desc, {
        x: 1.1, y: ey + 0.65, w: 5.1, h: 0.45,
        fontSize: 8.5, color: C.body, fontFace: FONT.body, lineSpacingMultiple: 1.25, valign: 'top',
      });
    });

    // Right Column: Processing Logic & Architectural Rules
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8, y: 1.45, w: 5.7, h: 5.4,
      fill: { color: C.white },
      line: { color: C.border, width: 1.0 },
      rectRadius: 0.08,
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.1, y: 1.58, w: 3.8, h: 0.28,
      fill: { color: C.indigoLt }, line: { color: C.indigo, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('PROCESSING WORKFLOW & BUSINESS LOGIC', {
      x: 7.1, y: 1.58, w: 3.8, h: 0.28,
      fontSize: 8.5, bold: true, color: C.indigo, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 2,
    });

    const logicSteps = [
      { title: 'Stateless Authentication (JWT)', text: 'Client transmits credentials to /api/auth/login. Server verifies bcrypt hash. Generates signed JWT payload containing { id, role } with 7-day expiration.' },
      { title: 'Asynchronous Document Parsing', text: 'Resumes ingested via Multer. If MIME type is PDF, pdf-parse extracts raw UTF-8 string. If DOCX, mammoth unpacks internal document.xml to extract formatted text.' },
      { title: 'Taxonomy Skill Normalization', text: 'Text is tokenized, stripped of non-alphanumeric noise, and matched against a curated dictionary of 250+ technical competencies (e.g., "JS" ➔ "JavaScript").' },
      { title: 'Automated Status State Machine', text: 'Application state transitions are strictly governed: Applied ➔ Screened ➔ Shortlisted ➔ Interview Scheduled ➔ Selected / Rejected.' },
      { title: 'Event-Driven SMTP Dispatch', text: 'Status modifications trigger NodeMailer asynchronous worker, rendering customized HTML template with candidate name, drive details, and recruiter notes.' },
    ];

    logicSteps.forEach((ls, i) => {
      const ly = 1.95 + i * 0.96;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 7.1, y: ly, w: 5.1, h: 0.88,
        fill: { color: i % 2 === 0 ? C.indigoBg : C.white },
        line: { color: C.borderLt, width: 0.5 },
        rectRadius: 0.05,
      });
      slide.addText(ls.title, {
        x: 7.25, y: ly + 0.08, w: 4.8, h: 0.25,
        fontSize: 10, bold: true, color: C.dark, fontFace: FONT.body,
      });
      slide.addText(ls.text, {
        x: 7.25, y: ly + 0.32, w: 4.8, h: 0.50,
        fontSize: 8.5, color: C.body, fontFace: FONT.body, lineSpacingMultiple: 1.25, valign: 'top',
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 10 — LIFECYCLE FLOWCHARTS (COLOR CODED STUDENT / RECRUITER)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Methodology', 'Operational Lifecycle Flowcharts: Student & Recruiter Journeys', C.purple);

    // ── LEFT COLUMN: STUDENT FLOWCHART (BLUE / TEAL ACCENTS) ────────
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.40, w: 5.5, h: 0.30,
      fill: { color: C.blueLt }, line: { color: C.blue, width: 0.8 }, rectRadius: 0.04
    });
    slide.addText('ALTS STUDENT APPLICATION LIFECYCLE', {
      x: 0.8, y: 1.40, w: 5.5, h: 0.30,
      fontSize: 8.5, bold: true, color: C.blue, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 1.5,
    });

    drawPill(slide, 1.8, 1.80, 3.6, 0.40, 'START: ALTS Student Portal Login', { fill: C.blue, color: C.white });
    drawArrow(slide, 3.6, 2.20, 3.6, 2.50, { color: C.blue });

    drawBox(slide, 1.8, 2.50, 3.6, 0.45, 'Complete Profile & Upload Resume\n(PDF / DOCX File)', { fill: C.blueBg, border: C.blue });
    drawArrow(slide, 3.6, 2.95, 3.6, 3.25, { color: C.blue });

    drawDiamond(slide, 2.3, 3.25, 2.6, 0.70, 'ATS Score\n≥ 70%?', { fill: C.amberBg, border: C.amber });

    // Diamond NO branch -> loop back
    drawArrow(slide, 4.9, 3.60, 5.3, 3.60, { label: 'No', labelColor: C.rose, color: C.rose });
    drawBox(slide, 5.3, 3.35, 1.1, 0.50, 'Refine\nSkills', { fontSize: 7.5, fill: C.roseLt, border: C.rose, color: C.rose });
    drawArrow(slide, 5.85, 3.35, 5.85, 2.72, { color: C.rose });
    drawArrow(slide, 5.85, 2.72, 5.4, 2.72, { color: C.rose });

    // Diamond YES branch -> continue down
    drawArrow(slide, 3.6, 3.95, 3.6, 4.25, { label: 'Yes', labelColor: C.green, color: C.green });
    drawBox(slide, 1.8, 4.25, 3.6, 0.45, 'Browse Open Placement Drives\nFilter by Role, CTC, & Tech Stack', { fill: C.blueBg, border: C.blue });
    drawArrow(slide, 3.6, 4.70, 3.6, 5.00, { color: C.blue });

    drawBox(slide, 1.8, 5.00, 3.6, 0.45, 'Submit One-Click Job Application\nAttach Current ATS Resume Snapshot', { fill: C.blueBg, border: C.blue });
    drawArrow(slide, 3.6, 5.45, 3.6, 5.75, { color: C.blue });

    drawDiamond(slide, 2.3, 5.75, 2.6, 0.65, 'Recruiter\nDecision?', { fill: C.amberBg, border: C.amber });

    // Decision branches
    drawArrow(slide, 2.3, 6.07, 1.1, 6.07, { label: 'Shortlist', labelColor: C.green, color: C.green });
    drawPill(slide, 0.8, 6.35, 2.5, 0.42, 'Interview / Offer Email via SMTP', {
      fill: C.greenLt, border: C.green, color: C.green, fontSize: 8.0
    });
    drawArrow(slide, 1.1, 6.07, 1.1, 6.35, { color: C.green });

    drawArrow(slide, 4.9, 6.07, 5.8, 6.07, { label: 'Reject', labelColor: C.rose, color: C.rose });
    drawPill(slide, 3.8, 6.35, 2.6, 0.42, 'Feedback & Skill Gap Report', {
      fill: C.roseLt, border: C.rose, color: C.rose, fontSize: 8.0
    });
    drawArrow(slide, 5.8, 6.07, 5.8, 6.35, { color: C.rose });

    // ── RIGHT COLUMN: RECRUITER FLOWCHART (PURPLE / INDIGO ACCENTS) ─
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.0, y: 1.40, w: 5.5, h: 0.30,
      fill: { color: C.purpleLt }, line: { color: C.purple, width: 0.8 }, rectRadius: 0.04
    });
    slide.addText('RECRUITER HIRING & SELECTION FLOWCHART', {
      x: 7.0, y: 1.40, w: 5.5, h: 0.30,
      fontSize: 8.5, bold: true, color: C.purple, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 1.5,
    });

    drawPill(slide, 7.9, 1.80, 3.6, 0.40, 'START: Company Portal Login / Verification', { fill: C.purple, color: C.white });
    drawArrow(slide, 9.7, 2.20, 9.7, 2.50, { color: C.purple });

    drawBox(slide, 7.9, 2.50, 3.6, 0.45, 'Create Job Posting\n(Required Skills, Min CGPA, CTC, Deadline)', { fill: C.purpleBg, border: C.purple });
    drawArrow(slide, 9.7, 2.95, 9.7, 3.25, { color: C.purple });

    drawBox(slide, 7.9, 3.25, 3.6, 0.45, 'Applicants Ingested into Recruiter Dashboard\nAutomatic Resume Extraction & Parsing', { fill: C.purpleBg, border: C.purple });
    drawArrow(slide, 9.7, 3.70, 9.7, 4.00, { color: C.purple });

    drawBox(slide, 7.9, 4.00, 3.6, 0.45, 'Automated ATS Ranking Algorithm\nCandidates Sorted by Compatibility Score', { fill: C.indigoBg, border: C.indigo });
    drawArrow(slide, 9.7, 4.45, 9.7, 4.75, { color: C.purple });

    drawDiamond(slide, 8.4, 4.75, 2.6, 0.65, 'Meets Hiring\nCriteria?', { fill: C.amberBg, border: C.amber });

    // Decision branches
    drawArrow(slide, 8.4, 5.07, 7.4, 5.07, { label: 'Yes', labelColor: C.green, color: C.green });
    drawBox(slide, 6.9, 5.35, 2.3, 0.45, 'Status: Shortlist /\nSchedule Interview', { fontSize: 8.0, fill: C.greenBg, border: C.green, color: C.green });
    drawArrow(slide, 7.4, 5.07, 7.4, 5.35, { color: C.green });

    drawArrow(slide, 11.0, 5.07, 12.0, 5.07, { label: 'No', labelColor: C.rose, color: C.rose });
    drawBox(slide, 10.4, 5.35, 2.1, 0.45, 'Status: Application\nRejected', { fontSize: 8.0, fill: C.roseBg, border: C.rose, color: C.rose });
    drawArrow(slide, 12.0, 5.07, 12.0, 5.35, { color: C.rose });

    // Merge into SMTP dispatch
    drawArrow(slide, 8.05, 5.80, 8.8, 6.00, { color: C.green });
    drawArrow(slide, 11.45, 5.80, 10.6, 6.00, { color: C.rose });
    drawBox(slide, 7.9, 6.00, 3.6, 0.42, 'Trigger NodeMailer SMTP Worker\nAuto-transmit HTML notification to student', {
      fill: C.blueBg, border: C.blue, fontSize: 8.0
    });
    drawArrow(slide, 9.7, 6.42, 9.7, 6.68, { color: C.purple });

    drawPill(slide, 7.9, 6.68, 3.6, 0.35, 'END: Hiring Funnel Analytics Updated', { fill: C.bg, border: C.border, color: C.dark });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 11 — ATS PIPELINE FLOWCHART (MULTI-COLOR PIPELINE)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Methodology', 'ATS Resume Parsing & Intelligent Scoring Pipeline', C.purple);

    // Horizontal 5-Stage Pipeline Flowchart (Color coded across stages!)
    const stages = [
      { num: 'STAGE 1', title: 'Input File\nIngestion', desc: 'PDF / DOCX upload\nMulter disk buffer', x: 0.8, w: 2.1, color: C.blue, bg: C.blueBg, badgeBg: C.blueLt },
      { num: 'STAGE 2', title: 'Binary Text\nExtraction', desc: 'pdf-parse / mammoth\nRaw UTF-8 stream', x: 3.2, w: 2.1, color: C.teal, bg: C.tealBg, badgeBg: C.tealLt },
      { num: 'STAGE 3', title: 'NLP Text\nSanitization', desc: 'Lowercase, regex filter\nStopword removal', x: 5.6, w: 2.1, color: C.indigo, bg: C.indigoBg, badgeBg: C.indigoLt },
      { num: 'STAGE 4', title: 'Skill Entity\nMatching', desc: 'Taxonomy dictionary\nExact & partial match', x: 8.0, w: 2.1, color: C.amber, bg: C.amberBg, badgeBg: C.amberLt },
      { num: 'STAGE 5', title: 'ATS Scoring &\nGap Report', desc: 'Weighted algorithm\nJSON advice payload', x: 10.4, w: 2.1, color: C.purple, bg: C.purpleBg, badgeBg: C.purpleLt },
    ];

    stages.forEach((st, i) => {
      // Stage header badge
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: st.x, y: 1.45, w: st.w, h: 0.25,
        fill: { color: st.badgeBg },
        line: { color: st.color, width: 0.8 },
        rectRadius: 0.04,
      });
      slide.addText(st.num, {
        x: st.x, y: 1.45, w: st.w, h: 0.25,
        fontSize: 8, bold: true, color: st.color, fontFace: FONT.body, align: 'center', valign: 'middle',
      });

      // Stage Box
      drawBox(slide, st.x, 1.75, st.w, 0.95, `${st.title}\n${st.desc}`, {
        fontSize: 8.5,
        fill: st.bg,
        border: st.color,
        borderWidth: 1.2,
        lineSpacing: 1.25,
      });

      // Connector arrow to next stage
      if (i < stages.length - 1) {
        drawArrow(slide, st.x + st.w + 0.02, 2.22, st.x + st.w + 0.28, 2.22, { color: st.color });
      }
    });

    // Bottom Detailed Panels
    // Left: Detailed Pipeline Flow Steps
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 2.95, w: 5.7, h: 3.9,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.08,
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: 3.05, w: 3.0, h: 0.26,
      fill: { color: C.purpleLt }, line: { color: C.purple, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('PIPELINE EXECUTION TRACE', {
      x: 1.1, y: 3.05, w: 3.0, h: 0.26,
      fontSize: 8.5, bold: true, color: C.purple, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 2,
    });

    const execSteps = [
      '1. Ingestion: Express route receives multipart/form-data via Multer, validates file extension (.pdf, .docx), enforces 5MB size ceiling.',
      '2. Text Extraction: Buffer piped to pdf-parse for PDF documents; mammoth.extractRawText for Microsoft Word .docx structures.',
      '3. Normalization: RegEx strips email headers, hyperlinks, page markers, and non-ASCII glyphs; converts all characters to lowercase.',
      '4. Skill Tokenization: Normalized tokens cross-referenced with Taxonomy index (Languages, Frameworks, Cloud, Databases).',
      '5. Gap Identification: Set difference computes missing mandatory keywords required by the recruiter job specification.',
      '6. Response Synthesis: Outputs structured score (0–100%), list of matched skills, missing keywords, and actionable tips for ALTS students.',
    ];
    addBulletList(slide, execSteps, 1.0, 3.40, 5.3, 10, C.purple);

    // Right: Sample JSON Scoring Payload
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8, y: 2.95, w: 5.7, h: 3.9,
      fill: { color: C.bg },
      line: { color: C.border, width: 1 },
      rectRadius: 0.08,
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.1, y: 3.05, w: 3.5, h: 0.26,
      fill: { color: C.tealLt }, line: { color: C.teal, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('SAMPLE ATS ANALYSIS JSON PAYLOAD', {
      x: 7.1, y: 3.05, w: 3.5, h: 0.26,
      fontSize: 8.5, bold: true, color: C.teal, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 2,
    });

    const jsonSnippet =
      '{\n' +
      '  "candidateId": "651a9f3b2e7c10d",\n' +
      '  "college": "ALTS",\n' +
      '  "jobId": "651a9e8d1b2f4a5",\n' +
      '  "atsScore": 84.5,\n' +
      '  "evaluation": {\n' +
      '    "skillsMatchScore": 90.0,\n' +
      '    "experienceMatchScore": 75.0,\n' +
      '    "cgpaEligibility": true\n' +
      '  },\n' +
      '  "matchedSkills": [\n' +
      '    "React", "Node.js", "Express", "MongoDB", "JavaScript"\n' +
      '  ],\n' +
      '  "missingKeywords": [\n' +
      '    "Docker", "AWS", "TypeScript"\n' +
      '  ],\n' +
      '  "recommendations": [\n' +
      '    "Add containerization projects to improve score",\n' +
      '    "Highlight TypeScript experience in project descriptions"\n' +
      '  ]\n' +
      '}';

    slide.addText(jsonSnippet, {
      x: 7.1, y: 3.40, w: 5.1, h: 3.3,
      fontSize: 9.0, color: C.dark, fontFace: 'Consolas', lineSpacingMultiple: 1.22,
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 12 — IMPLEMENTATION DETAILS (BLUE & INDIGO PALETTES)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Tech Stack', 'Implementation Details: Tools, Frameworks & Setup', C.blue);

    // Frontend Spec Box
    slide.addText('FRONTEND ARCHITECTURE (REACT 18 + VITE)', {
      x: 0.8, y: 1.45, w: 5.6, h: 0.28,
      fontSize: 8.5, bold: true, color: C.blue, fontFace: FONT.body, charSpacing: 2,
    });

    const feRows = [
      ['React 18 + Vite 5', 'Component-based SPA with instant HMR and ESBuild bundling'],
      ['React Router v6', 'Client-side nested routing with RBAC ProtectedRoute wrapper'],
      ['Context API', 'Centralized reactive state for AuthSession and Dark/Light theme'],
      ['Framer Motion', 'Hardware-accelerated layout transitions and interactive micro-animations'],
      ['Recharts Library', 'SVG-based interactive charts for hiring funnel and application trends'],
      ['Lucide React', 'Consistent, accessible SVG iconography system across all pages'],
      ['Vanilla CSS Design', 'Tokenized CSS custom properties for scalable design tokens'],
    ];

    feRows.forEach(([tool, desc], i) => {
      const y = 1.78 + i * 0.40;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y, w: 5.6, h: 0.36,
        fill: { color: i % 2 === 0 ? C.blueBg : C.white },
        line: { color: C.borderLt, width: 0.5 },
        rectRadius: 0.04,
      });
      slide.addText(tool, {
        x: 0.95, y, w: 2.0, h: 0.36,
        fontSize: 9.5, bold: true, color: C.blue, fontFace: FONT.body, valign: 'middle',
      });
      slide.addText(desc, {
        x: 3.0, y, w: 3.3, h: 0.36,
        fontSize: 9.0, color: C.body, fontFace: FONT.body, valign: 'middle',
      });
    });

    // Backend Spec Box
    slide.addText('BACKEND ARCHITECTURE (NODE.JS + EXPRESS)', {
      x: 6.9, y: 1.45, w: 5.6, h: 0.28,
      fontSize: 8.5, bold: true, color: C.indigo, fontFace: FONT.body, charSpacing: 2,
    });

    const beRows = [
      ['Node.js + Express.js', 'Asynchronous non-blocking runtime and RESTful API framework'],
      ['MongoDB + Mongoose', 'Document database with structured schemas, validations, and hooks'],
      ['JWT + bcryptjs', 'Cryptographic token generation and salted password hashing'],
      ['NodeMailer Client', 'SMTP transport client generating multipart HTML notification emails'],
      ['Multer Middleware', 'Streaming multipart/form-data handler for resume uploads'],
      ['pdf-parse Engine', 'Server-side PDF stream decoder extracting raw text buffers'],
      ['Mammoth.js', 'DOCX parser converting OpenXML structures to clean strings'],
    ];

    beRows.forEach(([tool, desc], i) => {
      const y = 1.78 + i * 0.40;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.9, y, w: 5.6, h: 0.36,
        fill: { color: i % 2 === 0 ? C.indigoBg : C.white },
        line: { color: C.borderLt, width: 0.5 },
        rectRadius: 0.04,
      });
      slide.addText(tool, {
        x: 7.05, y, w: 2.1, h: 0.36,
        fontSize: 9.5, bold: true, color: C.indigo, fontFace: FONT.body, valign: 'middle',
      });
      slide.addText(desc, {
        x: 9.2, y, w: 3.2, h: 0.36,
        fontSize: 9.0, color: C.body, fontFace: FONT.body, valign: 'middle',
      });
    });

    // Hardware & Environment Setup (Bottom)
    slide.addText('HARDWARE ENVIRONMENT & DEPLOYMENT SPECS', {
      x: 0.8, y: 4.80, w: 6, h: 0.28,
      fontSize: 8.5, bold: true, color: C.dark, fontFace: FONT.body, charSpacing: 2,
    });

    const envSpecs = [
      'Development Workstation: Intel Core i5/i7 (8-Core), 16GB DDR4 RAM, 512GB NVMe SSD, Windows 11 / Linux.',
      'Runtime Environment: Node.js v18.x LTS, npm v9.x, Git v2.4x for distributed version control.',
      'Database Cluster: MongoDB Atlas Shared Tier (M0) with auto-scaling replicas and automated index management.',
      'API Validation & Testing: Postman Collection for automated regression testing across all 24+ REST endpoints.',
    ];
    addBulletList(slide, envSpecs, 0.8, 5.10, 11.7, 11.5, C.blue);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 13 — SECURITY & JWT AUTH FLOWCHART (SWIMLANE COLORS)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Security', 'Security Architecture & JWT Authentication Flowchart', C.indigo);

    // 3 Domain Columns with distinct colors
    const cols = [
      { title: 'CLIENT (ALTS REACT SPA)', x: 0.8, w: 3.5, color: C.blue, bg: C.blueLt },
      { title: 'EXPRESS.JS API GATEWAY', x: 4.8, w: 4.5, color: C.indigo, bg: C.indigoLt },
      { title: 'MONGODB DATABASE', x: 9.8, w: 2.7, color: C.teal, bg: C.tealLt },
    ];

    cols.forEach(c => {
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x, y: 1.45, w: c.w, h: 0.32,
        fill: { color: c.bg }, line: { color: c.color, width: 0.8 }, rectRadius: 0.04,
      });
      slide.addText(c.title, {
        x: c.x, y: 1.45, w: c.w, h: 0.32,
        fontSize: 8.5, bold: true, color: c.color, fontFace: FONT.body, align: 'center', valign: 'middle',
      });
    });

    // Step 1: User Login
    drawBox(slide, 0.8, 1.95, 3.5, 0.52, 'User submits login form\n{ email, password }', { fill: C.blueBg, border: C.blue });
    drawArrow(slide, 4.3, 2.21, 4.8, 2.21, { label: 'POST /api/auth/login', color: C.blue });

    // Step 2: Query DB
    drawBox(slide, 4.8, 1.95, 4.5, 0.52, 'Server queries MongoDB User collection\n`User.findOne({ email })`', { fill: C.indigoBg, border: C.indigo });
    drawArrow(slide, 9.3, 2.21, 9.8, 2.21, { color: C.indigo });

    // Step 3: DB returns user
    drawBox(slide, 9.8, 1.95, 2.7, 0.52, 'Return user record\n+ salted passwordHash', { fontSize: 8.5, fill: C.tealBg, border: C.teal });
    drawArrow(slide, 9.8, 2.75, 8.5, 2.75, { color: C.teal });

    // Step 4: Decision: Valid Credentials?
    drawDiamond(slide, 5.85, 2.60, 2.4, 0.70, 'bcrypt.compare\n(pass, hash)?', { fill: C.amberBg, border: C.amber });

    // No -> 401
    drawArrow(slide, 5.85, 2.95, 4.3, 2.95, { label: 'No', labelColor: C.rose, color: C.rose });
    drawBox(slide, 0.8, 2.70, 3.5, 0.52, 'HTTP 401 Unauthorized\nDisplay error toast to user', {
      fill: C.roseLt, border: C.rose, color: C.rose
    });

    // Yes -> Sign JWT
    drawArrow(slide, 7.05, 3.30, 7.05, 3.65, { label: 'Yes', labelColor: C.green, color: C.green });
    drawBox(slide, 4.8, 3.65, 4.5, 0.60,
      'Sign JWT with HS256 secret key:\n`jwt.sign({ id, role }, SECRET, { expiresIn: \'7d\' })`',
      { fill: C.indigoBg, border: C.indigo, fontSize: 8.5 }
    );
    drawArrow(slide, 4.8, 3.95, 4.3, 3.95, { label: 'HTTP 200 { token, user }', color: C.indigo });

    // Step 5: Client saves JWT
    drawBox(slide, 0.8, 3.65, 3.5, 0.60,
      'Store JWT in localStorage & AuthContext\nAttach to future requests: `Bearer <token>`',
      { fontSize: 8.5, fill: C.blueBg, border: C.blue }
    );
    drawArrow(slide, 2.55, 4.25, 2.55, 4.70, { color: C.blue });

    // Step 6: Subsequent Protected API Request
    drawBox(slide, 0.8, 4.70, 3.5, 0.55, 'Client invokes protected route\n`Authorization: Bearer <token>`', { fill: C.blueBg, border: C.blue });
    drawArrow(slide, 4.3, 4.97, 4.8, 4.97, { color: C.blue });

    // Step 7: Express Middleware Verification
    drawBox(slide, 4.8, 4.70, 4.5, 0.55,
      'authMiddleware executes `jwt.verify(token)`\nExtracts user id & role from token payload',
      { fill: C.indigoBg, border: C.indigo }
    );
    drawArrow(slide, 7.05, 5.25, 7.05, 5.55, { color: C.indigo });

    // Step 8: RBAC Role Check
    drawDiamond(slide, 5.85, 5.55, 2.4, 0.70, 'Role matches\nrequired scope?', { fill: C.amberBg, border: C.amber });

    // Role check NO -> 403
    drawArrow(slide, 5.85, 5.90, 4.3, 5.90, { label: 'No', labelColor: C.rose, color: C.rose });
    drawBox(slide, 0.8, 5.65, 3.5, 0.52, 'HTTP 403 Forbidden\nInsufficient permissions for route', {
      fill: C.roseLt, border: C.rose, color: C.rose
    });

    // Role check YES -> Controller logic
    drawArrow(slide, 8.25, 5.90, 9.8, 5.90, { label: 'Yes', labelColor: C.green, color: C.green });
    drawBox(slide, 9.8, 5.65, 2.7, 0.52, '`next()` invoked ➔\nController executes', {
      fill: C.greenLt, border: C.green, color: C.green, fontSize: 8.5
    });

    // Final bottom note
    drawBox(slide, 0.8, 6.45, 11.7, 0.38,
      'Security Measures: Salted bcrypt passwords (10 rounds) | Stateless JWT tokens | HTTP-only cookie option | ProtectedRoute React guards | RBAC Express gates',
      { fontSize: 8.5, fill: C.bg, border: C.borderLt, bold: false }
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 14 — RESULTS & EXPERIMENTAL ANALYSIS (EMERALD GREEN PALETTE)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Results', 'Results & Experimental Analysis: Feature Validation', C.green);

    slide.addText('MODULE-WISE FUNCTIONAL VALIDATION MATRIX (ALTS TEST SUITE)', {
      x: 0.8, y: 1.45, w: 8, h: 0.28,
      fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, charSpacing: 2,
    });

    const resultTable = [
      [
        { text: 'Module', options: { bold: true, fontSize: 10, color: C.white, fill: { color: C.green }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
        { text: 'Scope of Tested Functionality', options: { bold: true, fontSize: 10, color: C.white, fill: { color: C.green }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
        { text: 'Test Methodology', options: { bold: true, fontSize: 10, color: C.white, fill: { color: C.green }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
        { text: 'Result', options: { bold: true, fontSize: 10, color: C.white, fill: { color: C.green }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Authentication & RBAC', options: { fontSize: 9.5, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'JWT issuance, password hashing, role-based route guard, token expiration handling', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Postman positive/negative token injection tests', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: '✓ 100% Passed', options: { fontSize: 9.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Resume Parser (ATS)', options: { fontSize: 9.5, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'PDF and DOCX text extraction, keyword extraction, similarity score generation', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Test suite of 50 sample student resumes', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: '✓ 100% Passed', options: { fontSize: 9.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Student Dashboard', options: { fontSize: 9.5, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Profile creation, portfolio showcase, job filtering, live application status tracking', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'End-to-end browser walkthroughs & state checks', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: '✓ 100% Passed', options: { fontSize: 9.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Recruiter Dashboard', options: { fontSize: 9.5, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Job creation, candidate shortlisting, applicant ranking, direct messaging', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Mock hiring drive with 100+ applicant pool', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: '✓ 100% Passed', options: { fontSize: 9.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'SMTP Email Worker', options: { fontSize: 9.5, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Automated HTML email generation on status update (selected, interview, rejected)', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'SMTP delivery verification to live inboxes', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: '✓ 100% Passed', options: { fontSize: 9.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Analytics Dashboard', options: { fontSize: 9.5, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Recharts hiring funnel visualization, department-wise placement distributions', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Cross-checked with raw MongoDB aggregates', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: '✓ 100% Passed', options: { fontSize: 9.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Admin Governance', options: { fontSize: 9.5, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Platform-wide user management, job listing approvals, recruiter verification', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Security boundary and data isolation checks', options: { fontSize: 9, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: '✓ 100% Passed', options: { fontSize: 9.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
    ];

    slide.addTable(resultTable, {
      x: 0.8, y: 1.78, w: 11.7,
      border: { type: 'solid', color: C.border, pt: 0.5 },
      colW: [2.2, 5.0, 3.0, 1.5],
      rowH: [0.38, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
      margin: [3, 6, 3, 6],
    });

    slide.addText('Note: System includes dual runtime modes: full live MongoDB Atlas deployment and standalone client-side mock demo mode for ALTS.', {
      x: 0.8, y: 6.50, w: 11.7, h: 0.35,
      fontSize: 9.5, italic: true, color: C.muted, fontFace: FONT.body,
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 15 — PLACEMENT FUNNEL & BENCHMARKS (RICH VIBRANT COLORS)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Results', 'Placement Pipeline Funnel & System Benchmarking', C.green);

    // Funnel Flowchart Header
    slide.addText('ALTS CAMPUS PLACEMENT FUNNEL CONVERSION FLOW', {
      x: 0.8, y: 1.45, w: 8, h: 0.28,
      fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, charSpacing: 2,
    });

    // 5 Stages of the Funnel Flowchart with vibrant colors!
    const funnelStages = [
      { step: '1. Registered Pool', count: '520 Students', pct: '100%', x: 0.8, w: 2.1, color: C.blue, bg: C.blueBg, badge: C.blueLt },
      { step: '2. Eligibility Check', count: '421 Eligible', pct: '81%', x: 3.2, w: 2.1, color: C.indigo, bg: C.indigoBg, badge: C.indigoLt },
      { step: '3. ATS Screened', count: '322 Passed (≥70%)', pct: '62%', x: 5.6, w: 2.1, color: C.purple, bg: C.purpleBg, badge: C.purpleLt },
      { step: '4. Tech Interview', count: '161 Interviewed', pct: '31%', x: 8.0, w: 2.1, color: C.teal, bg: C.tealBg, badge: C.tealLt },
      { step: '5. Offers Extended', count: '94 Placed', pct: '18%', x: 10.4, w: 2.1, color: C.green, bg: C.greenBg, badge: C.greenLt },
    ];

    funnelStages.forEach((fn, i) => {
      // Funnel Card
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: fn.x, y: 1.75, w: fn.w, h: 0.95,
        fill: { color: fn.bg },
        line: { color: fn.color, width: 1.3 },
        rectRadius: 0.06,
      });

      slide.addText(fn.step, {
        x: fn.x, y: 1.80, w: fn.w, h: 0.25,
        fontSize: 8.5, bold: true, color: fn.color, fontFace: FONT.body, align: 'center',
      });
      slide.addText(fn.count, {
        x: fn.x, y: 2.05, w: fn.w, h: 0.32,
        fontSize: 12, bold: true, color: C.dark, fontFace: FONT.heading, align: 'center',
      });
      slide.addText(`Conversion: ${fn.pct}`, {
        x: fn.x, y: 2.38, w: fn.w, h: 0.22,
        fontSize: 8, bold: true, color: fn.color, fontFace: FONT.body, align: 'center',
      });

      if (i < funnelStages.length - 1) {
        drawArrow(slide, fn.x + fn.w + 0.02, 2.22, fn.x + fn.w + 0.28, 2.22, { color: fn.color });
      }
    });

    // 4 Benchmark Performance Cards (Middle)
    const metrics = [
      { label: 'CLIENT PAGE HYDRATION', val: '< 1.1s', sub: 'React 18 + Vite SPA bundle build', color: C.blue },
      { label: 'RESUME PARSING TIME', val: '< 780ms', sub: 'pdf-parse & mammoth extract time', color: C.teal },
      { label: 'ATS SCORING ENGINE', val: '< 45ms', sub: 'Vector math & keyword intersection', color: C.purple },
      { label: 'SMTP EMAIL DISPATCH', val: '< 1.4s', sub: 'NodeMailer asynchronous transport', color: C.green },
    ];

    metrics.forEach((m, i) => {
      const mx = 0.8 + i * 2.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: mx, y: 2.95, w: 2.8, h: 0.95,
        fill: { color: C.white }, line: { color: m.color, width: 1.1 }, rectRadius: 0.06,
      });
      slide.addText(m.label, {
        x: mx, y: 3.02, w: 2.8, h: 0.22,
        fontSize: 7.5, bold: true, color: m.color, fontFace: FONT.body, align: 'center', charSpacing: 1.5,
      });
      slide.addText(m.val, {
        x: mx, y: 3.22, w: 2.8, h: 0.38,
        fontSize: 18, bold: true, color: C.dark, fontFace: FONT.heading, align: 'center',
      });
      slide.addText(m.sub, {
        x: mx, y: 3.60, w: 2.8, h: 0.22,
        fontSize: 7.5, color: C.muted, fontFace: FONT.body, align: 'center',
      });
    });

    // Comparative Performance Table (Bottom)
    slide.addText('BENCHMARK: TRADITIONAL MANUAL PLACEMENT VS. ALTS PLATFORM', {
      x: 0.8, y: 4.10, w: 8, h: 0.28,
      fontSize: 8.5, bold: true, color: C.dark, fontFace: FONT.body, charSpacing: 2,
    });

    const compTable = [
      [
        { text: 'Operational Dimension', options: { bold: true, fontSize: 9.5, color: C.white, fill: { color: C.indigo }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
        { text: 'Traditional Collegiate Process', options: { bold: true, fontSize: 9.5, color: C.white, fill: { color: C.indigo }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
        { text: 'ALTS AI-Powered Platform', options: { bold: true, fontSize: 9.5, color: C.white, fill: { color: C.indigo }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
        { text: 'Empirical Improvement', options: { bold: true, fontSize: 9.5, color: C.white, fill: { color: C.indigo }, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Resume Review Speed', options: { fontSize: 9, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: '10–15 minutes per candidate resume', options: { fontSize: 8.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: '< 800ms automated parsing & scoring', options: { fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, valign: 'middle' } },
        { text: '~900× Turnaround Acceleration', options: { fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Notification Latency', options: { fontSize: 9, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: '2–5 business days (manual email batching)', options: { fontSize: 8.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Instantaneous (< 2 sec via NodeMailer)', options: { fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Real-time Event Dispatch', options: { fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Candidate Tracking', options: { fontSize: 9, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Opaque; notice boards & verbal updates', options: { fontSize: 8.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Live self-service student dashboard', options: { fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, valign: 'middle' } },
        { text: '100% End-to-End Visibility', options: { fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
      [
        { text: 'Placement Reporting', options: { fontSize: 9, bold: true, color: C.dark, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Weeks required to aggregate Excel logs', options: { fontSize: 8.5, color: C.body, fontFace: FONT.body, valign: 'middle' } },
        { text: 'One-click visual analytics via Recharts', options: { fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, valign: 'middle' } },
        { text: 'Immediate Institutional Insights', options: { fontSize: 8.5, bold: true, color: C.green, fontFace: FONT.body, align: 'center', valign: 'middle' } },
      ],
    ];

    slide.addTable(compTable, {
      x: 0.8, y: 4.40, w: 11.7,
      border: { type: 'solid', color: C.border, pt: 0.5 },
      colW: [2.5, 3.6, 3.6, 2.0],
      rowH: [0.35, 0.42, 0.42, 0.42, 0.42],
      margin: [2, 6, 2, 6],
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 16 — CONCLUSION & KEY CONTRIBUTIONS (ROYAL BLUE PALETTE)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Summary', 'Conclusion & Key Contributions', C.blue);

    // Synthesis Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.45, w: 11.7, h: 1.60,
      fill: { color: C.white },
      line: { color: C.blue, width: 1.2 },
      rectRadius: 0.08,
    });
    slide.addText(
      'The ALTS Campus Placement Portal demonstrates the successful implementation of a production-grade, AI-assisted ' +
      'placement management system engineered specifically for ALTS on the MERN stack. By replacing antiquated manual ' +
      'routines with automated document parsing, algorithmic ATS candidate scoring, asynchronous email delivery, and interactive ' +
      'analytics, the portal establishes a benchmark for collegiate recruitment tools. The system validates that open-source ' +
      'modern web technologies can deliver enterprise-grade institutional solutions without prohibitive licensing overhead.', {
      x: 1.1, y: 1.60, w: 11.1, h: 1.30,
      fontSize: 12.5, color: C.body, fontFace: FONT.body, lineSpacingMultiple: 1.45, valign: 'top',
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 3.30, w: 3.8, h: 0.28,
      fill: { color: C.blueLt }, line: { color: C.blue, width: 0.6 }, rectRadius: 0.04
    });
    slide.addText('KEY SCIENTIFIC & TECHNICAL CONTRIBUTIONS', {
      x: 0.8, y: 3.30, w: 3.8, h: 0.28,
      fontSize: 8.5, bold: true, color: C.blue, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 1.5,
    });

    const contributions = [
      'Holistic End-to-End Placement Lifecycle: Fully digitized workflow spanning registration, profile creation, resume parsing, ATS scoring, application submission, interview tracking, and offer notification.',
      'Tri-Tenant Architecture with Strict RBAC: Comprehensive separation of concerns across Student, Recruiter, and Admin user personas guarded by stateless JWT tokens and cryptographic hashing.',
      'Automated Asynchronous Communication: Zero-latency email alerts via NodeMailer removing manual notification bottlenecks and ensuring complete transparency for candidates.',
      'Format-Agnostic ATS Parsing Subsystem: Native extraction pipelines for both PDF and DOCX documents with automated taxonomy-based technical keyword matching.',
      'Data-Driven Governance Dashboards: Live Recharts visual funnels providing ALTS placement officers and company recruiters with instant data-backed recruitment metrics.',
      'Democratized Open-Source Foundation: Engineered with 100% open-source technologies, empowering ALTS to self-host and customize the platform freely without external licensing costs.',
    ];
    addBulletList(slide, contributions, 0.8, 3.65, 11.7, 12, C.blue);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 17 — FUTURE SCOPE & ROADMAP (COLOR-CODED PHASES)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Roadmap', 'Future Scope & Enhancements Roadmap', C.purple);

    const phases = [
      {
        phase: 'PHASE 1 — SHORT TERM (1–3 MONTHS)',
        color: C.blue,
        badgeBg: C.blueLt,
        items: [
          'Full-Duplex WebSockets (Socket.IO): Real-time instant messaging between recruiters and candidates; live push notifications.',
          'OAuth 2.0 Single Sign-On: Google and GitHub federated authentication for one-click student and company onboarding.',
          'Advanced Semantic NLP Parser: Integration of spaCy / HuggingFace Transformers for deep semantic context and soft-skill parsing.',
        ],
      },
      {
        phase: 'PHASE 2 — MEDIUM TERM (3–6 MONTHS)',
        color: C.green,
        badgeBg: C.greenLt,
        items: [
          'Collaborative Filtering Recommendation Engine: ML model suggesting job openings based on alumni placement history and candidate skill clusters.',
          'Integrated Video Interviewing & Scheduling: WebRTC-powered virtual interview rooms with automated Google Calendar synchronization.',
          'Progressive Web App (PWA): Offline-capable mobile client with background push alerts for impending placement deadlines.',
        ],
      },
      {
        phase: 'PHASE 3 — LONG TERM (6–12 MONTHS)',
        color: C.purple,
        badgeBg: C.purpleLt,
        items: [
          'Inter-College Placement Federation: Shared multi-tenant network enabling joint campus recruitment drives across affiliated universities.',
          'Blockchain Credential Verification: Tamper-proof verification of college degrees, certificates, and academic transcripts on Ethereum/Polygon.',
          'Predictive Placement Analytics: Time-series forecasting predicting annual hiring demand and emerging industry skill shortages.',
        ],
      },
    ];

    let yPos = 1.45;
    phases.forEach((p) => {
      // Phase Header Badge
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: yPos, w: 4.5, h: 0.32,
        fill: { color: p.badgeBg }, line: { color: p.color, width: 0.8 }, rectRadius: 0.04,
      });
      slide.addText(p.phase, {
        x: 0.8, y: yPos, w: 4.5, h: 0.32,
        fontSize: 8.5, bold: true, color: p.color, fontFace: FONT.body, align: 'center', valign: 'middle', charSpacing: 1.5,
      });

      yPos += 0.38;
      addBulletList(slide, p.items, 0.8, yPos, 11.7, 11.5, p.color);
      yPos += p.items.length * 0.42 + 0.25;
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 18 — REFERENCES (INDIGO CITATIONS)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    addContentSlide(slide, 'Citations', 'References & Academic Publications', C.indigo);

    const references = [
      '[1]  S. Patil, A. Kulkarni, and R. Joshi, "Design and Implementation of Online Placement Management System," International Journal of Engineering Research & Technology (IJERT), vol. 9, no. 5, pp. 245–250, 2020.',
      '[2]  R. Kumar and P. Singh, "Automated Campus Recruitment and Candidate Screening System using Machine Learning," in IEEE International Conference on Computer Communication and Informatics (ICCCNT), 2021, pp. 1–6.',
      '[3]  M. Bankar, V. Gaikwad, and S. Pawar, "College Placement and Training Management System with ATS Scoring," IEEE Access, vol. 8, pp. 112040–112048, 2021.',
      '[4]  MongoDB Inc., "MongoDB Manual and Architecture Guide (v7.0)," MongoDB Documentation, 2024. [Online]. Available: https://docs.mongodb.com/',
      '[5]  OpenJS Foundation, "Express.js — Fast, Unopinionated, Minimalist Web Framework for Node.js," Express Guide, 2024. [Online]. Available: https://expressjs.com/',
      '[6]  Meta Open Source, "React Documentation: Building User Interfaces with Components," React.dev, 2024. [Online]. Available: https://react.dev/',
      '[7]  M. Jones, J. Bradley, and N. Sakimura, "JSON Web Token (JWT)," RFC 7519, IETF Proposed Standard, May 2015. [Online]. Available: https://tools.ietf.org/html/rfc7519',
      '[8]  A. Heun, "NodeMailer — Send Emails with Node.js," NodeMailer Documentation, 2024. [Online]. Available: https://nodemailer.com/about/',
      '[9]  E. You et al., "Vite: Next Generation Frontend Tooling," Vite Documentation, 2024. [Online]. Available: https://vitejs.dev/',
      '[10] Recharts Group, "Recharts — Redefined Chart Library Built with React and D3," Recharts API Guide, 2024. [Online]. Available: https://recharts.org/',
      '[11] Framer B.V., "Framer Motion — Production-ready Animation Library for React," Motion Guide, 2024. [Online]. Available: https://www.framer.com/motion/',
      '[12] M. S. Bernstein et al., "pdf-parse: Pure JavaScript PDF Text Extraction Library," npm Repository, 2023. [Online]. Available: https://www.npmjs.com/package/pdf-parse',
    ];

    references.forEach((ref, i) => {
      const y = 1.45 + i * 0.43;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y, w: 11.7, h: 0.38,
        fill: { color: i % 2 === 0 ? C.white : C.indigoBg },
        line: { color: C.borderLt, width: 0.5 },
        rectRadius: 0.04,
      });
      slide.addText(ref, {
        x: 0.95, y, w: 11.4, h: 0.38,
        fontSize: 9.2, color: C.body, fontFace: FONT.body, valign: 'middle',
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SLIDE 19 — THANK YOU / Q&A (COLORED CLOSING SLIDE)
  // ═══════════════════════════════════════════════════════════════════
  {
    const slide = pptx.addSlide();
    slide.background = { color: C.white };

    // Decorative top bars
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: 13.333, h: 0.10, fill: { color: C.blue }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0.10, w: 6.5, h: 0.03, fill: { color: C.purple }
    });

    // Thank You Title
    slide.addText('Thank You', {
      x: 0, y: 1.8, w: 13.333, h: 1.2,
      fontSize: 54, bold: true, color: C.dark,
      fontFace: FONT.heading, align: 'center',
    });

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 5.7, y: 3.15, w: 1.9, h: 0.04, fill: { color: C.blue }
    });

    slide.addText('Questions & Discussion', {
      x: 0, y: 3.45, w: 13.333, h: 0.6,
      fontSize: 19, bold: true, color: C.purple,
      fontFace: FONT.body, align: 'center',
    });

    // Institution card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 3.6, y: 4.40, w: 6.1, h: 1.5,
      fill: { color: C.blueBg }, line: { color: C.blue, width: 1.2 }, rectRadius: 0.08
    });

    slide.addText(
      'ALTS Campus Placement Portal\n' +
      'Department of Computer Science & Engineering\n' +
      'ALTS', {
      x: 3.8, y: 4.55, w: 5.7, h: 1.2,
      fontSize: 14, bold: true, color: C.dark,
      fontFace: FONT.body, align: 'center', lineSpacingMultiple: 1.45,
    });
  }

  // ─── SAVE PRESENTATION ─────────────────────────────────────────────
  const outputPath = path.join(__dirname, 'ALTS_Academic_Presentation.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`\n✅ Presentation saved successfully to: ${outputPath}\n`);
}

createAcademicPPT().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
