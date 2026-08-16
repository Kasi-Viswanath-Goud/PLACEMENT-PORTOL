const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');

const mockApplications = [
  { _id: 'app_1', jobId: 'job_1', studentId: 'student_1', status: 'Applied', matchScore: 92, appliedAt: new Date(Date.now() - 2 * 86400000) },
  { _id: 'app_2', jobId: 'job_1', studentId: 'student_2', status: 'Shortlisted', matchScore: 88, appliedAt: new Date(Date.now() - 3 * 86400000) },
  { _id: 'app_3', jobId: 'job_1', studentId: 'student_3', status: 'Applied', matchScore: 75, appliedAt: new Date(Date.now() - 1 * 86400000) }
];
const getMockUsers = () => { try { return require('./authRoutes').mockUsers; } catch { return []; } };
const getMockJobs = () => { try { return require('./jobRoutes').mockJobs; } catch { return []; } };

// Apply to Job
router.post('/apply', authenticate, authorize('student'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    if (!jobId) return res.status(400).json({ message: 'Job ID required.' });
    
    // Calculate real match score based on skills
    let matchScore = 0;
    let job, student;
    
    if (isMongoConnected()) {
      job = await Job.findById(jobId);
      student = await User.findById(req.user.id);
    } else {
      const mockJobs = getMockJobs();
      const mockUsers = getMockUsers();
      job = mockJobs.find(j => j._id === jobId);
      student = mockUsers.find(u => u._id === req.user.id);
    }
    
    if (job && student) {
      const reqSkills = job.requiredSkills || [];
      const studentSkills = student.skills || [];
      
      if (reqSkills.length > 0) {
        const lowerStudentSkills = studentSkills.map(s => typeof s === 'string' ? s.toLowerCase().trim() : '');
        const matched = reqSkills.filter(s => typeof s === 'string' && lowerStudentSkills.includes(s.toLowerCase().trim()));
        matchScore = Math.round((matched.length / reqSkills.length) * 100);
      } else {
        matchScore = 85; // Default good score if no skills specified
      }
      
      // Bonus points for meeting CGPA requirement
      if (student.cgpa && job.minCGPA && student.cgpa >= job.minCGPA) {
        matchScore = Math.min(100, matchScore + 10); // cap at 100
      }
    } else {
      matchScore = Math.floor(Math.random() * 35) + 60; // Fallback if missing data
    }

    if (isMongoConnected()) {
      const existing = await Application.findOne({ jobId, studentId: req.user.id });
      if (existing) return res.status(400).json({ message: 'Already applied.' });
      const app = new Application({ jobId, studentId: req.user.id, coverLetter, matchScore, skillMatchPercent: matchScore });
      await app.save();
      return res.status(201).json({ message: 'Applied successfully!', application: app });
    } else {
      const exists = mockApplications.find(a => a.jobId === jobId && a.studentId === req.user.id);
      if (exists) return res.status(400).json({ message: 'Already applied.' });
      const app = {
        _id: 'app_' + Date.now(), jobId, studentId: req.user.id,
        status: 'Applied', matchScore, skillMatchPercent: matchScore,
        coverLetter: coverLetter || '', notes: '', feedback: '',
        appliedAt: new Date(), updatedAt: new Date()
      };
      mockApplications.push(app);
      return res.status(201).json({ message: 'Applied successfully!', application: app });
    }
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already applied.' });
    res.status(500).json({ message: 'Error applying.', error: err.message });
  }
});

// Get My Applications (Student)
router.get('/my-applications', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const apps = await Application.find({ studentId: req.user.id }).populate('jobId').sort({ appliedAt: -1 });
      return res.json(apps);
    } else {
      const jobs = getMockJobs();
      const apps = mockApplications.filter(a => a.studentId === req.user.id).map(a => ({
        ...a,
        jobId: jobs.find(j => j._id === a.jobId) || { _id: a.jobId, title: 'Position', companyName: 'Company', packageCTC: 10 }
      }));
      return res.json(apps);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications.' });
  }
});

// Get Applicants for a Job (HR)
router.get('/job/:jobId', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const apps = await Application.find({ jobId: req.params.jobId }).populate('studentId', '-password').sort({ matchScore: -1 });
      return res.json(apps);
    } else {
      const users = getMockUsers();
      const apps = mockApplications.filter(a => a.jobId === req.params.jobId).map(a => ({
        ...a,
        studentId: users.find(u => u._id === a.studentId) || { _id: a.studentId, name: 'Student', email: 'student@email.com', branch: 'CS', cgpa: 8, skills: [] }
      }));
      return res.json(apps);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applicants.' });
  }
});

// Update Application Status (HR/Admin)
router.put('/:id/status', authenticate, authorize('company', 'admin'), async (req, res) => {
  try {
    const { status, feedback, notes, interviewDate, interviewTime } = req.body;
    let app, student, job;

    if (isMongoConnected()) {
      app = await Application.findByIdAndUpdate(req.params.id, { 
        status, 
        feedback, 
        notes, 
        interviewDate, 
        interviewTime, 
        updatedAt: new Date() 
      }, { new: true }).populate('studentId').populate('jobId');
      
      if (!app) return res.status(404).json({ message: 'Application not found.' });
      student = app.studentId;
      job = app.jobId;
    } else {
      const idx = mockApplications.findIndex(a => a._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Application not found.' });
      
      if (status) mockApplications[idx].status = status;
      if (feedback) mockApplications[idx].feedback = feedback;
      if (notes) mockApplications[idx].notes = notes;
      if (interviewDate) mockApplications[idx].interviewDate = interviewDate;
      if (interviewTime) mockApplications[idx].interviewTime = interviewTime;
      mockApplications[idx].updatedAt = new Date();
      app = mockApplications[idx];

      const users = getMockUsers();
      const jobs = getMockJobs();
      student = users.find(u => u._id === app.studentId);
      job = jobs.find(j => j._id === app.jobId);
    }

    // Automation: Send email if selected, shortlisted, or interview scheduled
    if (status === 'Selected' || status === 'Shortlisted' || status === 'Interview Scheduled') {
      const { sendEmail } = require('../utils/emailService');
      const studentEmail = student?.email;
      const studentName = student?.name || 'Candidate';
      const jobTitle = job?.title || 'the position';
      const companyName = job?.companyName || 'our company';

      if (studentEmail) {
        let subject = `Update on your application for ${jobTitle}`;
        let htmlBody = `<p>Dear ${studentName},</p>`;
        
        if (status === 'Selected') {
          subject = `Congratulations! You have been selected for ${jobTitle}`;
          htmlBody += `<p>We are thrilled to inform you that you have been <strong>Selected</strong> for the ${jobTitle} position at ${companyName}.</p>`;
        } else if (status === 'Shortlisted') {
          subject = `Update: You have been shortlisted for ${jobTitle}`;
          htmlBody += `<p>We are pleased to inform you that you have been <strong>Shortlisted</strong> for the ${jobTitle} position at ${companyName}.</p>`;
        } else if (status === 'Interview Scheduled') {
          subject = `Interview Scheduled: ${jobTitle} at ${companyName}`;
          htmlBody += `<p>We are pleased to inform you that an interview has been scheduled for your application to the ${jobTitle} position at ${companyName}.</p>`;
          if (interviewDate) htmlBody += `<p><strong>Date:</strong> ${interviewDate}</p>`;
          if (interviewTime) htmlBody += `<p><strong>Time:</strong> ${interviewTime}</p>`;
        }
        
        htmlBody += `<p>Please log in to your ALTS Placement Portal dashboard for further details and next steps.</p>
                     <br/>
                     <p>Best regards,<br/>The HR Team at ${companyName}</p>`;

        // Send asynchronously so it doesn't block the API response
        sendEmail(studentEmail, subject, htmlBody);
      }
    }

    return res.json({ message: 'Status updated! Automation triggered.', application: app });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status.' });
  }
});

// Get All Applications (Admin)
router.get('/all', authenticate, authorize('admin'), async (req, res) => {
  try {
    if (isMongoConnected()) {
      const apps = await Application.find().populate('jobId').populate('studentId', '-password').sort({ appliedAt: -1 });
      return res.json(apps);
    } else {
      return res.json(mockApplications);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all applications.' });
  }
});

module.exports = { router, mockApplications };
