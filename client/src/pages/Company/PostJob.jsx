import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, MapPin, DollarSign, BookOpen, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const PostJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '', description: '', roleCategory: 'Software Engineering',
    location: '', jobType: 'Full-time', workMode: 'Hybrid',
    packageCTC: '', minCGPA: '6.0', experienceRequired: 'Fresher',
    allowedBranches: 'Computer Science, Information Technology',
    passingYear: '2026', requiredSkills: '',
    vacancies: '1', deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      setMessage({ type: 'success', text: 'Job posted successfully!' });
      setTimeout(() => navigate('/company-dashboard'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to post job.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '800px' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Post a New Job</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Fill out the details below to create a new job posting for campus students.</p>
      </div>

      {message.text && (
        <div style={{ background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem' }}>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Basic Details</h3>
        
        <div className="grid-2">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Job Title / Role</label>
            <input type="text" name="title" className="form-input" placeholder="e.g. Software Development Engineer" value={formData.title} onChange={handleChange} required />
          </div>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Job Description</label>
            <textarea name="description" className="form-textarea" rows="5" placeholder="Detailed description of responsibilities and expectations..." value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Role Category</label>
            <select name="roleCategory" className="form-select" value={formData.roleCategory} onChange={handleChange}>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Data Science / AI">Data Science / AI</option>
              <option value="Product Management">Product Management</option>
              <option value="Design">Design (UI/UX)</option>
              <option value="Consulting">Consulting</option>
              <option value="Core Engineering">Core Engineering</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-input" placeholder="e.g. Bangalore, India" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Job Type</label>
            <select name="jobType" className="form-select" value={formData.jobType} onChange={handleChange}>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Work Mode</label>
            <select name="workMode" className="form-select" value={formData.workMode} onChange={handleChange}>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', marginTop: '2rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Eligibility & Requirements</h3>
        
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Package (CTC in LPA)</label>
            <input type="number" step="0.1" name="packageCTC" className="form-input" placeholder="e.g. 15.5" value={formData.packageCTC} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Minimum CGPA</label>
            <input type="number" step="0.1" max="10" name="minCGPA" className="form-input" placeholder="e.g. 7.5" value={formData.minCGPA} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Allowed Branches (Comma separated)</label>
            <input type="text" name="allowedBranches" className="form-input" placeholder="e.g. Computer Science, Information Technology" value={formData.allowedBranches} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Required Skills (Comma separated)</label>
            <input type="text" name="requiredSkills" className="form-input" placeholder="e.g. React, Node.js, Python, SQL" value={formData.requiredSkills} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Target Passing Year</label>
            <input type="number" name="passingYear" className="form-input" placeholder="e.g. 2026" value={formData.passingYear} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Vacancies</label>
            <input type="number" name="vacancies" className="form-input" value={formData.vacancies} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Application Deadline</label>
            <input type="date" name="deadline" className="form-input" value={formData.deadline} onChange={handleChange} required />
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/company-dashboard')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : 'Post Job'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default PostJob;
