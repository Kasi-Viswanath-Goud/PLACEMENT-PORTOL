import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, Plus, Trash2, Github, Linkedin, Globe, MapPin, Briefcase, GraduationCap, Award, BookOpen, AlertCircle, User, CheckCircle2, Zap, Upload, FileText } from 'lucide-react';

export const Profile = () => {
  const { user, token, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
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
              <label className="form-label">Phone Number</label>
              <input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleChange} />
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

      </div>
    </div>
  );
};

export default Profile;
