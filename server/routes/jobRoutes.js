const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { authenticate, authorize } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');

// Mock Jobs Store
const mockJobs = [
  {
    _id: 'job_1', companyId: 'mock_hr_1', companyName: 'Google', companyLogo: '',
    title: 'Software Engineer - University Graduate 2026',
    description: 'Design, develop, test, deploy and improve software at scale. Work on search, AI, cloud and infrastructure products serving billions of users worldwide.',
    roleCategory: 'Software Engineering', location: 'Bangalore / Hyderabad',
    jobType: 'Full-time', workMode: 'Hybrid', packageCTC: 28, minCGPA: 7.5,
    experienceRequired: 'Fresher',
    allowedBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
    passingYear: 2026,
    requiredSkills: ['C++', 'Java', 'Python', 'Data Structures', 'System Design'],
    preferredSkills: ['Distributed Systems', 'Machine Learning'],
    responsibilities: 'Build and maintain large-scale distributed systems. Write clean, efficient code. Participate in design reviews and code reviews.',
    qualifications: 'B.Tech/B.E. in CS/IT or related field. Strong problem solving skills.',
    benefits: 'Competitive salary, health insurance, stock options, free meals, gym membership',
    vacancies: 15,
    deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
    isApproved: true, applicantCount: 234, createdAt: new Date()
  },
  {
    _id: 'job_2', companyId: 'mock_hr_2', companyName: 'Microsoft', companyLogo: '',
    title: 'Data Science & ML Engineer',
    description: 'Build NLP models, ML pipelines and analytics tools. Work alongside research teams on cutting-edge AI products.',
    roleCategory: 'Data Science / AI', location: 'Noida / Hyderabad',
    jobType: 'Full-time', workMode: 'Hybrid', packageCTC: 24, minCGPA: 8.0,
    experienceRequired: 'Fresher',
    allowedBranches: ['Computer Science', 'Information Technology', 'Electrical Engineering'],
    passingYear: 2026,
    requiredSkills: ['Python', 'PyTorch', 'SQL', 'Machine Learning', 'Statistics'],
    preferredSkills: ['TensorFlow', 'NLP', 'Deep Learning'],
    responsibilities: 'Design and implement ML models. Analyze large datasets. Deploy models to production.',
    qualifications: 'Strong mathematical foundation. Experience with ML frameworks.',
    benefits: 'RSUs, health benefits, flexible work hours, learning budget',
    vacancies: 8,
    deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
    isApproved: true, applicantCount: 156, createdAt: new Date()
  },
  {
    _id: 'job_3', companyId: 'mock_hr_3', companyName: 'Amazon', companyLogo: '',
    title: 'Frontend Development Engineer (SDE-1)',
    description: 'Build responsive, scalable web interfaces powering Amazon\'s consumer and enterprise products.',
    roleCategory: 'Web Development', location: 'Bangalore',
    jobType: 'Full-time', workMode: 'Onsite', packageCTC: 22, minCGPA: 7.0,
    experienceRequired: 'Fresher',
    allowedBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering'],
    passingYear: 2026,
    requiredSkills: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript', 'REST APIs'],
    preferredSkills: ['Next.js', 'GraphQL', 'AWS'],
    responsibilities: 'Develop pixel-perfect UI components. Optimize web performance. Write unit and integration tests.',
    qualifications: 'Strong JavaScript fundamentals. Understanding of web standards.',
    benefits: 'Relocation bonus, health insurance, stock options, Prime membership',
    vacancies: 20,
    deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
    isApproved: true, applicantCount: 312, createdAt: new Date()
  },
  {
    _id: 'job_4', companyId: 'mock_hr_4', companyName: 'Deloitte', companyLogo: '',
    title: 'Associate Consultant - Technology',
    description: 'Drive digital transformation for Fortune 500 clients. Enterprise architecture and cloud migration consulting.',
    roleCategory: 'Consulting', location: 'Gurgaon / Pune',
    jobType: 'Full-time', workMode: 'Hybrid', packageCTC: 12, minCGPA: 6.5,
    experienceRequired: 'Fresher',
    allowedBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'],
    passingYear: 2026,
    requiredSkills: ['Problem Solving', 'Business Analytics', 'SQL', 'Communication'],
    preferredSkills: ['SAP', 'Salesforce', 'Cloud'],
    responsibilities: 'Analyze client requirements. Develop technology solutions. Create implementation roadmaps.',
    qualifications: 'Strong analytical and communication skills. Any engineering branch.',
    benefits: 'Global exposure, certifications, performance bonus, travel allowance',
    vacancies: 50,
    deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    isApproved: true, applicantCount: 89, createdAt: new Date()
  },
  {
    _id: 'job_5', companyId: 'mock_hr_5', companyName: 'Flipkart', companyLogo: '',
    title: 'Backend Engineer - Platform Team',
    description: 'Build highly available microservices powering India\'s largest e-commerce platform. Scale systems to handle millions of requests.',
    roleCategory: 'Backend Engineering', location: 'Bangalore',
    jobType: 'Full-time', workMode: 'Hybrid', packageCTC: 20, minCGPA: 7.0,
    experienceRequired: 'Fresher',
    allowedBranches: ['Computer Science', 'Information Technology'],
    passingYear: 2026,
    requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'SQL', 'Redis'],
    preferredSkills: ['Kafka', 'Docker', 'Kubernetes'],
    responsibilities: 'Design and build scalable APIs. Optimize database queries. Ensure system reliability.',
    qualifications: 'Strong CS fundamentals. Experience with backend development.',
    benefits: 'ESOPs, health cover, flexible hours, hackathon culture',
    vacancies: 12,
    deadline: new Date(Date.now() + 18 * 86400000).toISOString(),
    isApproved: true, applicantCount: 198, createdAt: new Date()
  },
  {
    _id: 'job_6', companyId: 'mock_hr_6', companyName: 'Razorpay', companyLogo: '',
    title: 'Product Design Intern',
    description: 'Join our design team to create intuitive payment experiences for millions of businesses across India.',
    roleCategory: 'Design', location: 'Bangalore',
    jobType: 'Internship', workMode: 'Hybrid', packageCTC: 8, minCGPA: 6.0,
    experienceRequired: 'Fresher',
    allowedBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'],
    passingYear: 2026,
    requiredSkills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research'],
    preferredSkills: ['Adobe XD', 'Illustration', 'Design Systems'],
    responsibilities: 'Design user interfaces. Conduct user research. Create prototypes and design specs.',
    qualifications: 'Strong visual design sense. Portfolio of design work.',
    benefits: 'Stipend, mentorship, PPO opportunity, swag kit',
    vacancies: 5,
    deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
    isApproved: true, applicantCount: 67, createdAt: new Date()
  }
];

// GET All Jobs
router.get('/', async (req, res) => {
  try {
    const { search, branch, minCGPA, jobType, workMode, minPackage, maxPackage } = req.query;
    if (isMongoConnected()) {
      let query = { isApproved: true };
      if (search) query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { roleCategory: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } }
      ];
      if (branch) query.allowedBranches = branch;
      if (minCGPA) query.minCGPA = { $lte: parseFloat(minCGPA) };
      if (jobType) query.jobType = jobType;
      if (workMode) query.workMode = workMode;
      if (minPackage) query.packageCTC = { ...query.packageCTC, $gte: parseFloat(minPackage) };
      if (maxPackage) query.packageCTC = { ...query.packageCTC, $lte: parseFloat(maxPackage) };
      const jobs = await Job.find(query).sort({ createdAt: -1 });
      return res.json(jobs);
    } else {
      let filtered = [...mockJobs];
      if (search) { const s = search.toLowerCase(); filtered = filtered.filter(j => j.title.toLowerCase().includes(s) || j.companyName.toLowerCase().includes(s) || j.requiredSkills.some(sk => sk.toLowerCase().includes(s))); }
      if (branch) filtered = filtered.filter(j => j.allowedBranches.includes(branch));
      if (minCGPA) filtered = filtered.filter(j => j.minCGPA <= parseFloat(minCGPA));
      if (jobType) filtered = filtered.filter(j => j.jobType === jobType);
      if (workMode) filtered = filtered.filter(j => j.workMode === workMode);
      if (minPackage) filtered = filtered.filter(j => j.packageCTC >= parseFloat(minPackage));
      if (maxPackage) filtered = filtered.filter(j => j.packageCTC <= parseFloat(maxPackage));
      return res.json(filtered);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs.', error: err.message });
  }
});

// GET Company Analytics
router.get('/company/analytics', authenticate, authorize('company', 'admin'), async (req, res) => {
  try {
    const companyId = req.user.id;
    
    if (isMongoConnected()) {
      const activeJobsCount = await Job.countDocuments({ companyId, deadline: { $gt: new Date() } });
      
      const companyJobs = await Job.find({ companyId }).select('_id requiredSkills createdAt');
      const jobIds = companyJobs.map(j => j._id);
      
      const applications = await Application.find({ jobId: { $in: jobIds } });
      const totalApplicants = applications.length;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const hiredThisMonth = applications.filter(app => {
        const appDate = new Date(app.updatedAt || app.appliedAt);
        return (app.status === 'Selected' || app.status === 'Offer Accepted') && 
               appDate.getMonth() === currentMonth && 
               appDate.getFullYear() === currentYear;
      }).length;

      const funnel = {
        'Sourced': totalApplicants,
        'Screening': applications.filter(a => a.status === 'Shortlisted').length,
        'Interview': applications.filter(a => a.status === 'Interview Scheduled').length,
        'Offer': applications.filter(a => a.status === 'Offer Sent').length,
        'Hired': applications.filter(a => a.status === 'Selected' || a.status === 'Offer Accepted').length
      };

      const funnelData = [
        { value: funnel['Sourced'], name: 'Sourced', fill: '#0ea5e9' },
        { value: funnel['Screening'], name: 'Screening', fill: '#6366f1' },
        { value: funnel['Interview'], name: 'Interview', fill: '#8b5cf6' },
        { value: funnel['Offer'], name: 'Offer', fill: '#d946ef' },
        { value: funnel['Hired'], name: 'Hired', fill: '#10b981' },
      ];
      
      const skillCounts = {};
      companyJobs.forEach(job => {
        (job.requiredSkills || []).forEach(skill => {
           skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      });
      
      const topSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(entry => entry[0]);
        
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const heatmapData = topSkills.map(skill => {
         return {
           skill,
           data: months.map(() => Math.floor(Math.random() * (skillCounts[skill] * 20 + 20)))
         };
      });

      return res.json({
        activeJobs: activeJobsCount,
        totalApplicants,
        hiredThisMonth,
        funnelData,
        heatmapData
      });
    } else {
      return res.json({
        activeJobs: 3,
        totalApplicants: 120,
        hiredThisMonth: 4,
        funnelData: [
          { value: 120, name: 'Sourced', fill: '#0ea5e9' },
          { value: 85, name: 'Screening', fill: '#6366f1' },
          { value: 32, name: 'Interview', fill: '#8b5cf6' },
          { value: 14, name: 'Offer', fill: '#d946ef' },
          { value: 4, name: 'Hired', fill: '#10b981' },
        ],
        heatmapData: []
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics.', error: err.message });
  }
});

// GET Single Job
router.get('/:id', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found.' });
      return res.json(job);
    } else {
      const job = mockJobs.find(j => j._id === req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found.' });
      return res.json(job);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job.' });
  }
});

// POST Create Job
router.post('/', authenticate, authorize('company', 'admin'), async (req, res) => {
  try {
    const { title, description, roleCategory, location, jobType, workMode, packageCTC, minCGPA, experienceRequired, allowedBranches, passingYear, requiredSkills, preferredSkills, responsibilities, qualifications, benefits, vacancies, deadline } = req.body;
    if (!title || !description || !packageCTC || !deadline) return res.status(400).json({ message: 'Required fields missing.' });
    const companyName = req.user.companyName || req.user.name;
    const parseBranches = (b) => Array.isArray(b) ? b : (b ? b.split(',').map(s => s.trim()) : ['Computer Science']);
    const parseSkills = (s) => Array.isArray(s) ? s : (s ? s.split(',').map(x => x.trim()) : []);

    if (isMongoConnected()) {
      const job = new Job({
        companyId: req.user.id, companyName, title, description,
        roleCategory: roleCategory || 'Software Engineering', location: location || 'Remote',
        jobType: jobType || 'Full-time', workMode: workMode || 'Hybrid',
        packageCTC: parseFloat(packageCTC), minCGPA: parseFloat(minCGPA) || 6.0,
        experienceRequired: experienceRequired || 'Fresher',
        allowedBranches: parseBranches(allowedBranches), passingYear: parseInt(passingYear) || 2026,
        requiredSkills: parseSkills(requiredSkills), preferredSkills: parseSkills(preferredSkills),
        responsibilities, qualifications, benefits, vacancies: parseInt(vacancies) || 1,
        deadline: new Date(deadline), isApproved: true
      });
      await job.save();
      return res.status(201).json({ message: 'Job posted!', job });
    } else {
      const newJob = {
        _id: 'job_' + Date.now(), companyId: req.user.id, companyName, companyLogo: '',
        title, description, roleCategory: roleCategory || 'Software Engineering',
        location: location || 'Remote', jobType: jobType || 'Full-time', workMode: workMode || 'Hybrid',
        packageCTC: parseFloat(packageCTC), minCGPA: parseFloat(minCGPA) || 6.0,
        experienceRequired: experienceRequired || 'Fresher',
        allowedBranches: parseBranches(allowedBranches), passingYear: parseInt(passingYear) || 2026,
        requiredSkills: parseSkills(requiredSkills), preferredSkills: parseSkills(preferredSkills),
        responsibilities, qualifications, benefits, vacancies: parseInt(vacancies) || 1,
        deadline: new Date(deadline).toISOString(), isApproved: true, applicantCount: 0, createdAt: new Date()
      };
      mockJobs.unshift(newJob);
      return res.status(201).json({ message: 'Job posted!', job: newJob });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating job.', error: err.message });
  }
});

// PUT Update Job
router.put('/:id', authenticate, authorize('company', 'admin'), async (req, res) => {
  try {
    if (isMongoConnected()) {
      const job = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      if (!job) return res.status(404).json({ message: 'Job not found.' });
      return res.json({ message: 'Job updated!', job });
    } else {
      const idx = mockJobs.findIndex(j => j._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Job not found.' });
      Object.assign(mockJobs[idx], req.body);
      return res.json({ message: 'Job updated!', job: mockJobs[idx] });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating job.' });
  }
});

// DELETE Job
router.delete('/:id', authenticate, authorize('company', 'admin'), async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Job.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Job deleted.' });
    } else {
      const idx = mockJobs.findIndex(j => j._id === req.params.id);
      if (idx !== -1) mockJobs.splice(idx, 1);
      return res.json({ message: 'Job deleted.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job.' });
  }
});

module.exports = { router, mockJobs };
