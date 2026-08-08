import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, Building2, Zap, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const JobsPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    jobType: '', workMode: '', minPackage: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (filters.jobType) queryParams.append('jobType', filters.jobType);
      if (filters.workMode) queryParams.append('workMode', filters.workMode);
      if (filters.minPackage) queryParams.append('minPackage', filters.minPackage);

      let fetchedJobs = [];
      const res = await fetch(`/api/jobs?${queryParams.toString()}`);
      if (res.ok) {
        fetchedJobs = await res.json();
      }

      let currentAppliedIds = new Set();
      if (user && user.role === 'student') {
        const appsRes = await fetch('/api/applications/my-applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (appsRes.ok) {
          const apps = await appsRes.json();
          apps.forEach(app => currentAppliedIds.add(app.jobId._id || app.jobId));
        }
      }

      // Sort: unapplied jobs first, applied jobs last
      fetchedJobs.sort((a, b) => {
        const aApplied = currentAppliedIds.has(a._id) ? 1 : 0;
        const bApplied = currentAppliedIds.has(b._id) ? 1 : 0;
        return aApplied - bApplied;
      });

      setAppliedJobIds(currentAppliedIds);
      setJobs(fetchedJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ jobId, coverLetter: 'Applied via quick apply.' })
      });
      if (res.ok) {
        setAppliedJobIds(new Set([...appliedJobIds, jobId]));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to apply');
      }
    } catch (err) {
      console.error(err);
      alert('Error applying to job');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Header & Search */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Find Your Dream Job</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Explore the latest campus placement opportunities from top companies.
        </p>

        <form onSubmit={handleSearch} className="glass-panel" style={{ display: 'flex', padding: '0.5rem', borderRadius: '9999px', maxWidth: '800px', margin: '0 auto', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '1rem' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search roles, companies, or skills..." 
              style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.75rem', color: 'var(--text-primary)', outline: 'none', fontSize: '1.05rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ borderRadius: '9999px', padding: '0.75rem 2rem' }}>Search</button>
        </form>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '280px 1fr' }}>
        
        {/* Filters Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} /> Filters
            </h3>
            
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select className="form-select" value={filters.jobType} onChange={(e) => setFilters({...filters, jobType: e.target.value})}>
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Work Mode</label>
              <select className="form-select" value={filters.workMode} onChange={(e) => setFilters({...filters, workMode: e.target.value})}>
                <option value="">All Modes</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Package (LPA)</label>
              <select className="form-select" value={filters.minPackage} onChange={(e) => setFilters({...filters, minPackage: e.target.value})}>
                <option value="">Any</option>
                <option value="5">5+ LPA</option>
                <option value="10">10+ LPA</option>
                <option value="15">15+ LPA</option>
                <option value="20">20+ LPA</option>
              </select>
            </div>

            <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setFilters({jobType: '', workMode: '', minPackage: ''})}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{jobs.length} Jobs Found</h2>
            {user?.role === 'student' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
                <Zap size={16} /> AI Matches prioritized
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex-center" style={{ height: '300px' }}><div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div></div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No jobs found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {jobs.map(job => (
                <div key={job._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                        <Building2 size={28} color="var(--text-muted)" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{job.title}</h3>
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{job.companyName}</div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {job.location}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase size={14} /> {job.experienceRequired}</span>
                        </div>
                      </div>
                    </div>
                    {user?.role === 'student' && (
                      <button className="btn-secondary btn-sm" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                        <Bookmark size={18} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                    {job.requiredSkills.slice(0, 4).map((skill, i) => (
                      <span key={i} style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span className="badge badge-primary">{job.jobType}</span>
                      <span className="badge badge-success">{job.packageCTC} LPA</span>
                      <span className="badge badge-warning">Min CGPA: {job.minCGPA}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Link to={`/jobs/${job._id}`} className="btn-secondary">Details</Link>
                      {(!user || user.role === 'student') && (
                        appliedJobIds.has(job._id) ? (
                          <button className="btn-secondary" disabled>Applied</button>
                        ) : (
                          <button className="btn-primary" onClick={() => handleApply(job._id)}>Apply Now</button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobsPage;
