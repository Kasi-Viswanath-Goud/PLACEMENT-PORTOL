import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Building2, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

export const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'company' ? 'company' : 'student';

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', 
    // Student specifics
    college: '', degree: 'B.Tech', branch: 'Computer Science', passingYear: '2026', cgpa: '',
    // Company specifics
    companyName: '', industry: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      login(data.token, data.user);
      navigate(`/${data.user.role}-dashboard`);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Join ALTS to connect with top talent and companies</p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <button 
            type="button"
            onClick={() => setRole('student')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', background: role === 'student' ? 'var(--accent-primary)' : 'transparent', color: role === 'student' ? '#fff' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <User size={18} /> Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('company')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', background: role === 'company' ? 'var(--accent-primary)' : 'transparent', color: role === 'company' ? '#fff' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Building2 size={18} /> Recruiter
          </button>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Common Fields */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" name="name" className="form-input" style={{ paddingLeft: '2.75rem' }} placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" name="email" className="form-input" style={{ paddingLeft: '2.75rem' }} placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="password" name="password" className="form-input" style={{ paddingLeft: '2.75rem' }} placeholder="Create a strong password" value={formData.password} onChange={handleChange} required minLength="6" />
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '1.5rem 0' }}></div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <div className="grid-2 animate-fade-in" style={{ gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">College/University</label>
                <input type="text" name="college" className="form-input" placeholder="e.g. IIT Delhi" value={formData.college} onChange={handleChange} required />
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
                <label className="form-label">Branch</label>
                <select name="branch" className="form-select" value={formData.branch} onChange={handleChange}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics & Comm.</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Passing Year</label>
                <input type="number" name="passingYear" className="form-input" value={formData.passingYear} onChange={handleChange} required min="2020" max="2030" />
              </div>
            </div>
          )}

          {/* Company Specific Fields */}
          {role === 'company' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="companyName" className="form-input" style={{ paddingLeft: '2.75rem' }} placeholder="e.g. Google" value={formData.companyName} onChange={handleChange} required={role === 'company'} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select name="industry" className="form-select" value={formData.industry} onChange={handleChange} required={role === 'company'}>
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology / Software</option>
                  <option value="Finance">Finance & Banking</option>
                  <option value="Consulting">Consulting</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : `Create ${role === 'student' ? 'Student' : 'Recruiter'} Account`}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
