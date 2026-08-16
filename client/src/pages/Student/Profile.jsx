import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, Plus, Trash2, Github, Linkedin, Globe, MapPin, Briefcase, GraduationCap, Award, BookOpen, AlertCircle, User, CheckCircle2, Zap, Upload, FileText, Sparkles, Download, X, Printer, Mail, Phone, ExternalLink } from 'lucide-react';

export const Profile = () => {
  const { user, token, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    headline: user?.headline || '',
    summary: user?.summary || '',
    college: user?.college || '',
    degree: user?.degree || 'B.Tech',
    branch: user?.branch || '',
    cgpa: user?.cgpa || '',
    passingYear: user?.passingYear || '',
    skills: user?.skills?.join(', ') || '',
    programmingLanguages: user?.programmingLanguages?.join(', ') || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
    projects: user?.projects || [],
  });

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects];
    if (field === 'techStack') {
      newProjects[index][field] = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      newProjects[index][field] = value;
    }
    setFormData({ ...formData, projects: newProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }]
    });
  };

  const removeProject = (index) => {
    const newProjects = [...formData.projects];
    newProjects.splice(index, 1);
    setFormData({ ...formData, projects: newProjects });
  };

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [resumeData, setResumeData] = useState({
    url: user?.resumeUrl || '',
    name: user?.resumeOriginalName || ''
  });

  // Resume generation state
  const [generating, setGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile({
        ...formData,
        cgpa: parseFloat(formData.cgpa) || 0,
        passingYear: parseInt(formData.passingYear) || 2026
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setMessage({ type: '', text: '' });
    
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const res = await fetch('/api/student/resume', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setResumeData({ url: data.resumeUrl, name: data.resumeOriginalName });
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload resume.' });
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateResume = async () => {
    setGenerating(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/student/generate-resume', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGeneratedResume(data.resume);
      setShowResumeModal(true);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to generate resume.' });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrintResume = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const r = generatedResume;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${r.name} - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4; margin: 0; }
    body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 28px 36px; }
    .header { text-align: center; padding-bottom: 14px; border-bottom: 2.5px solid #6366f1; margin-bottom: 16px; }
    .header h1 { font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 3px; }
    .header .headline { font-size: 13px; color: #6366f1; font-weight: 600; margin-bottom: 8px; }
    .contact-row { display: flex; justify-content: center; gap: 18px; flex-wrap: wrap; font-size: 11.5px; color: #475569; }
    .contact-row a { color: #6366f1; text-decoration: none; }
    .section { margin-bottom: 14px; }
    .section-title { font-size: 12px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 8px; }
    .summary-text { font-size: 12px; line-height: 1.6; color: #334155; }
    .edu-row { display: flex; justify-content: space-between; align-items: baseline; }
    .edu-row .degree { font-size: 13px; font-weight: 600; color: #0f172a; }
    .edu-row .year { font-size: 11.5px; color: #64748b; font-weight: 500; }
    .edu-college { font-size: 12px; color: #475569; margin-top: 1px; }
    .edu-detail { font-size: 11.5px; color: #64748b; margin-top: 1px; }
    .skills-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
    .skill-tag { background: #eef2ff; color: #4338ca; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 500; }
    .project-item { margin-bottom: 10px; }
    .project-item h4 { font-size: 13px; font-weight: 600; color: #0f172a; }
    .project-item .tech { font-size: 11px; color: #6366f1; margin: 2px 0; }
    .project-item p { font-size: 11.5px; color: #475569; line-height: 1.5; }
    .project-item .links { font-size: 11px; color: #6366f1; }
    .project-item .links a { color: #6366f1; text-decoration: none; margin-right: 12px; }
    .exp-item { margin-bottom: 10px; }
    .exp-item .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
    .exp-item .exp-header h4 { font-size: 13px; font-weight: 600; color: #0f172a; }
    .exp-item .exp-header span { font-size: 11px; color: #64748b; }
    .exp-item .exp-company { font-size: 12px; color: #475569; }
    .exp-item p { font-size: 11.5px; color: #475569; line-height: 1.5; margin-top: 2px; }
    .cert-item { margin-bottom: 4px; font-size: 12px; }
    .cert-item strong { color: #0f172a; }
    .cert-item span { color: #64748b; }
    .links-row { display: flex; gap: 16px; flex-wrap: wrap; font-size: 11.5px; }
    .links-row a { color: #6366f1; text-decoration: none; }
    @media print { body { background: #fff; } .page { padding: 24px 32px; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>${r.name}</h1>
      ${r.headline ? `<div class="headline">${r.headline}</div>` : ''}
      <div class="contact-row">
        ${r.email ? `<span>✉ ${r.email}</span>` : ''}
        ${r.phone ? `<span>☎ ${r.phone}</span>` : ''}
        ${r.github ? `<a href="${r.github}" target="_blank">GitHub</a>` : ''}
        ${r.linkedin ? `<a href="${r.linkedin}" target="_blank">LinkedIn</a>` : ''}
        ${r.portfolio ? `<a href="${r.portfolio}" target="_blank">Portfolio</a>` : ''}
      </div>
    </div>

    ${r.summary ? `
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="summary-text">${r.summary}</p>
    </div>` : ''}

    ${(r.college || r.degree) ? `
    <div class="section">
      <div class="section-title">Education</div>
      <div class="edu-row">
        <span class="degree">${r.degree}${r.branch ? ` in ${r.branch}` : ''}</span>
        <span class="year">${r.passingYear ? `Batch of ${r.passingYear}` : ''}</span>
      </div>
      ${r.college ? `<div class="edu-college">${r.college}</div>` : ''}
      ${r.cgpa > 0 ? `<div class="edu-detail">CGPA: ${r.cgpa}/10</div>` : ''}
    </div>` : ''}

    ${(r.skills.length > 0 || r.programmingLanguages.length > 0) ? `
    <div class="section">
      <div class="section-title">Technical Skills</div>
      <div class="skills-wrap">
        ${r.programmingLanguages.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        ${r.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </div>` : ''}

    ${r.experience.length > 0 ? `
    <div class="section">
      <div class="section-title">Experience</div>
      ${r.experience.map(e => `
        <div class="exp-item">
          <div class="exp-header">
            <h4>${e.position}</h4>
            <span>${e.duration}</span>
          </div>
          <div class="exp-company">${e.company}</div>
          ${e.description ? `<p>${e.description}</p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${r.internships.length > 0 ? `
    <div class="section">
      <div class="section-title">Internships</div>
      ${r.internships.map(i => `
        <div class="exp-item">
          <div class="exp-header">
            <h4>${i.role}</h4>
            <span>${i.duration}</span>
          </div>
          <div class="exp-company">${i.company}</div>
          ${i.description ? `<p>${i.description}</p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${r.projects.length > 0 ? `
    <div class="section">
      <div class="section-title">Projects</div>
      ${r.projects.map(p => `
        <div class="project-item">
          <h4>${p.title}</h4>
          ${p.techStack.length > 0 ? `<div class="tech">${p.techStack.join(' · ')}</div>` : ''}
          ${p.description ? `<p>${p.description}</p>` : ''}
          <div class="links">
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank">Live Demo ↗</a>` : ''}
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank">Source Code ↗</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${r.certifications.length > 0 ? `
    <div class="section">
      <div class="section-title">Certifications</div>
      ${r.certifications.map(c => `
        <div class="cert-item">
          <strong>${c.title}</strong> — <span>${c.issuer}${c.date ? ` (${c.date})` : ''}</span>
        </div>
      `).join('')}
    </div>` : ''}

    ${r.achievements.length > 0 ? `
    <div class="section">
      <div class="section-title">Achievements</div>
      ${r.achievements.map(a => `
        <div class="cert-item">
          <strong>${a.title}</strong>${a.description ? ` — <span>${a.description}</span>` : ''}
        </div>
      `).join('')}
    </div>` : ''}
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your personal, academic, and professional details.</p>
        </div>
        <button onClick={handleSubmit} className="btn-primary" disabled={saving}>
          {saving ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div style={{ background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Basic Info */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--accent-primary)" /> Basic Information
          </h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Professional Headline</label>
              <input type="text" name="headline" className="form-input" placeholder="e.g. Aspiring Full-Stack Developer | Competitive Programmer" value={formData.headline} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Summary / About Me</label>
              <textarea name="summary" className="form-textarea" rows="4" placeholder="Briefly describe your background, interests, and career goals..." value={formData.summary} onChange={handleChange}></textarea>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="var(--accent-primary)" /> Academic Details
          </h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">College/University</label>
              <input type="text" name="college" className="form-input" value={formData.college} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <select name="degree" className="form-select" value={formData.degree} onChange={handleChange}>
                <option value="B.Tech">B.Tech / B.E.</option>
                <option value="M.Tech">M.Tech / M.E.</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Sc">B.Sc</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Branch/Specialization</label>
              <input type="text" name="branch" className="form-input" value={formData.branch} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input type="number" name="passingYear" className="form-input" value={formData.passingYear} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">CGPA (out of 10)</label>
              <input type="number" step="0.01" max="10" name="cgpa" className="form-input" value={formData.cgpa} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Skills & Links */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="var(--accent-primary)" /> Skills & Social Links
          </h3>
          <div className="grid-2">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Technical Skills (Comma separated)</label>
              <input type="text" name="skills" className="form-input" placeholder="React, Node.js, AWS, MongoDB..." value={formData.skills} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Programming Languages (Comma separated)</label>
              <input type="text" name="programmingLanguages" className="form-input" placeholder="C++, Python, JavaScript, Java..." value={formData.programmingLanguages} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <div style={{ position: 'relative' }}>
                <Github size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="url" name="github" className="form-input" style={{ paddingLeft: '2.75rem' }} value={formData.github} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <div style={{ position: 'relative' }}>
                <Linkedin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="url" name="linkedin" className="form-input" style={{ paddingLeft: '2.75rem' }} value={formData.linkedin} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Personal Portfolio URL</label>
              <div style={{ position: 'relative' }}>
                <Globe size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="url" name="portfolio" className="form-input" style={{ paddingLeft: '2.75rem' }} value={formData.portfolio} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Projects & Portfolio */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--accent-primary)" /> Projects & Demos
            </h3>
            <button type="button" className="btn-secondary btn-sm" onClick={addProject} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Project
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {formData.projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
                No projects added yet. Click "Add Project" to showcase your work!
              </div>
            ) : (
              formData.projects.map((project, index) => (
                <div key={index} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', position: 'relative', border: '1px solid var(--border-color)' }}>
                  <button type="button" onClick={() => removeProject(index)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="grid-2">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Project Title</label>
                      <input type="text" className="form-input" value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} placeholder="E-Commerce App" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Description</label>
                      <textarea className="form-textarea" rows="2" value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} placeholder="Describe what you built and your role..."></textarea>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Tech Stack (Comma separated)</label>
                      <input type="text" className="form-input" value={Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack} onChange={(e) => handleProjectChange(index, 'techStack', e.target.value)} placeholder="React, Node, MongoDB" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Live Demo URL</label>
                      <div style={{ position: 'relative' }}>
                        <Globe size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="url" className="form-input" style={{ paddingLeft: '2.5rem' }} value={project.liveUrl} onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)} placeholder="https://myapp.com" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">GitHub Repo URL</label>
                      <div style={{ position: 'relative' }}>
                        <Github size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="url" className="form-input" style={{ paddingLeft: '2.5rem' }} value={project.githubUrl} onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)} placeholder="https://github.com/..." />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resume Upload */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--accent-primary)" /> Resume Upload
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Upload your latest resume</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>PDF or DOCX format, max 10MB.</p>
              </div>
              <div>
                <label className="btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {uploading ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : <Upload size={16} />}
                  {uploading ? 'Uploading...' : 'Select File'}
                  <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleResumeUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            {resumeData.name && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={20} color="var(--success)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{resumeData.name}</span>
                </div>
                {resumeData.url && (
                  <a href={resumeData.url} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
                    View Current
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Generate Short Resume - NEW SECTION */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.06) 50%, rgba(139,92,246,0.08) 100%)', border: '1px solid rgba(99,102,241,0.25)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-primary)" /> Generate Short Resume
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Instantly create a clean, professional one-page resume from your profile data. It pulls your education, skills, projects, and experience — formatted and ready to download as PDF.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              onClick={handleGenerateResume} 
              disabled={generating}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', fontSize: '0.95rem' }}
            >
              {generating ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: '#fff' }}></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Resume
                </>
              )}
            </button>

            {generatedResume && (
              <button 
                className="btn-secondary" 
                onClick={() => setShowResumeModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <FileText size={16} />
                View Generated Resume
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { icon: '📄', text: 'ATS-friendly format' },
              { icon: '🎨', text: 'Clean professional design' },
              { icon: '📥', text: 'Download as PDF' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Resume Preview Modal */}
      {showResumeModal && generatedResume && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: '800px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            border: '1px solid var(--border-color)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-primary)', flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Generated Resume</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-primary btn-sm" onClick={handlePrintResume} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Download size={14} /> Download PDF
                </button>
                <button onClick={() => setShowResumeModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Resume Preview */}
            <div style={{ overflow: 'auto', flex: 1, padding: '2rem', background: '#f8fafc' }}>
              <div style={{
                background: '#fff', maxWidth: '650px', margin: '0 auto',
                padding: '2.5rem 2.5rem 2rem', borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)', color: '#1a1a2e',
                fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: 1.6
              }}>
                {/* Header */}
                <div style={{ textAlign: 'center', paddingBottom: '1rem', borderBottom: '2.5px solid #6366f1', marginBottom: '1.25rem' }}>
                  <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '0.15rem' }}>
                    {generatedResume.name}
                  </h1>
                  {generatedResume.headline && (
                    <p style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 600, marginBottom: '0.6rem' }}>
                      {generatedResume.headline}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#475569' }}>
                    {generatedResume.email && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={12} /> {generatedResume.email}</span>}
                    {generatedResume.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={12} /> {generatedResume.phone}</span>}
                    {generatedResume.github && <a href={generatedResume.github} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Github size={12} /> GitHub</a>}
                    {generatedResume.linkedin && <a href={generatedResume.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Linkedin size={12} /> LinkedIn</a>}
                    {generatedResume.portfolio && <a href={generatedResume.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Globe size={12} /> Portfolio</a>}
                  </div>
                </div>

                {/* Summary */}
                {generatedResume.summary && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
                      Professional Summary
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>{generatedResume.summary}</p>
                  </div>
                )}

                {/* Education */}
                {(generatedResume.college || generatedResume.degree) && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
                      Education
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                        {generatedResume.degree}{generatedResume.branch ? ` in ${generatedResume.branch}` : ''}
                      </span>
                      {generatedResume.passingYear && <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Batch of {generatedResume.passingYear}</span>}
                    </div>
                    {generatedResume.college && <p style={{ fontSize: '0.82rem', color: '#475569' }}>{generatedResume.college}</p>}
                    {generatedResume.cgpa > 0 && <p style={{ fontSize: '0.78rem', color: '#64748b' }}>CGPA: {generatedResume.cgpa}/10</p>}
                  </div>
                )}

                {/* Skills */}
                {(generatedResume.skills.length > 0 || generatedResume.programmingLanguages.length > 0) && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
                      Technical Skills
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {[...generatedResume.programmingLanguages, ...generatedResume.skills].map((s, i) => (
                        <span key={i} style={{ background: '#eef2ff', color: '#4338ca', padding: '0.15rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {generatedResume.experience.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
                      Experience
                    </h3>
                    {generatedResume.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{exp.position}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.duration}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#475569' }}>{exp.company}</p>
                        {exp.description && <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.15rem' }}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Internships */}
                {generatedResume.internships.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
                      Internships
                    </h3>
                    {generatedResume.internships.map((intern, i) => (
                      <div key={i} style={{ marginBottom: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{intern.role}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{intern.duration}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#475569' }}>{intern.company}</p>
                        {intern.description && <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.15rem' }}>{intern.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {generatedResume.projects.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
                      Projects
                    </h3>
                    {generatedResume.projects.map((proj, i) => (
                      <div key={i} style={{ marginBottom: '0.65rem' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{proj.title}</h4>
                        {proj.techStack.length > 0 && <p style={{ fontSize: '0.75rem', color: '#6366f1', margin: '0.1rem 0' }}>{proj.techStack.join(' · ')}</p>}
                        {proj.description && <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>{proj.description}</p>}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.15rem' }}>
                          {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><ExternalLink size={10} /> Live Demo</a>}
                          {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Github size={10} /> Source</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {generatedResume.certifications.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
                      Certifications
                    </h3>
                    {generatedResume.certifications.map((cert, i) => (
                      <p key={i} style={{ fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                        <strong style={{ color: '#0f172a' }}>{cert.title}</strong> — <span style={{ color: '#64748b' }}>{cert.issuer}{cert.date ? ` (${cert.date})` : ''}</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* Achievements */}
                {generatedResume.achievements.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.2rem', marginBottom: '0.5rem' }}>
                      Achievements
                    </h3>
                    {generatedResume.achievements.map((ach, i) => (
                      <p key={i} style={{ fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                        <strong style={{ color: '#0f172a' }}>{ach.title}</strong>{ach.description ? ` — ${ach.description}` : ''}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

