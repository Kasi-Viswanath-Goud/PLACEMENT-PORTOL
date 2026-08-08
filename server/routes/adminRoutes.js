const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');
const User = require('../models/User');

const getMockUsers = () => { try { return require('./authRoutes').mockUsers; } catch { return []; } };
const getMockJobs = () => { try { return require('./jobRoutes').mockJobs; } catch { return []; } };
const getMockApps = () => { try { return require('./applicationRoutes').mockApplications; } catch { return []; } };

// Admin Stats
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    if (isMongoConnected()) {
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalCompanies = await User.countDocuments({ role: 'company' });
      const Job = require('../models/Job');
      const Application = require('../models/Application');
      const totalJobs = await Job.countDocuments();
      const totalApplications = await Application.countDocuments();
      const selected = await Application.countDocuments({ status: 'Selected' });
      return res.json({
        totalStudents, totalCompanies, totalJobs, totalApplications,
        placementRate: totalApplications > 0 ? ((selected / totalApplications) * 100).toFixed(1) + '%' : '0%',
        highestPackage: '44.5 LPA', avgPackage: '14.8 LPA',
        totalInterviews: Math.floor(totalApplications * 0.4),
        monthlyGrowth: '+12.5%'
      });
    } else {
      const users = getMockUsers();
      const jobs = getMockJobs();
      const apps = getMockApps();
      return res.json({
        totalStudents: users.filter(u => u.role === 'student').length || 150,
        totalCompanies: users.filter(u => u.role === 'company').length || 24,
        totalJobs: jobs.length || 12,
        totalApplications: apps.length || 340,
        placementRate: '65.3%', highestPackage: '44.5 LPA', avgPackage: '14.8 LPA',
        totalInterviews: 89, monthlyGrowth: '+12.5%'
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats.' });
  }
});

// Get Users by Role
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    if (isMongoConnected()) {
      let query = {};
      if (role) query.role = role;
      if (search) query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
      const users = await User.find(query).select('-password').sort({ createdAt: -1 });
      return res.json(users);
    } else {
      let users = getMockUsers();
      if (role) users = users.filter(u => u.role === role);
      if (search) { const s = search.toLowerCase(); users = users.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)); }
      return res.json(users.map(({ password, ...u }) => u));
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// Delete User
router.delete('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    if (isMongoConnected()) {
      await User.findByIdAndDelete(req.params.id);
      return res.json({ message: 'User deleted.' });
    } else {
      const users = getMockUsers();
      const idx = users.findIndex(u => u._id === req.params.id);
      if (idx !== -1) users.splice(idx, 1);
      return res.json({ message: 'User deleted.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

// Search Candidates (for HR)
router.get('/candidates', authenticate, async (req, res) => {
  try {
    const { search, branch, minCGPA, skills, college, passingYear } = req.query;
    if (isMongoConnected()) {
      let query = { role: 'student' };
      if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
      if (branch) query.branch = branch;
      if (minCGPA) query.cgpa = { $gte: parseFloat(minCGPA) };
      if (skills) query.skills = { $in: skills.split(',').map(s => new RegExp(s.trim(), 'i')) };
      if (college) query.college = { $regex: college, $options: 'i' };
      if (passingYear) query.passingYear = parseInt(passingYear);
      const students = await User.find(query).select('-password').sort({ cgpa: -1 });
      return res.json(students);
    } else {
      let students = getMockUsers().filter(u => u.role === 'student');
      if (search) { const s = search.toLowerCase(); students = students.filter(u => u.name.toLowerCase().includes(s)); }
      if (branch) students = students.filter(u => u.branch === branch);
      if (minCGPA) students = students.filter(u => (u.cgpa || 0) >= parseFloat(minCGPA));
      if (skills) { const sk = skills.split(',').map(s => s.trim().toLowerCase()); students = students.filter(u => u.skills?.some(s => sk.includes(s.toLowerCase()))); }
      return res.json(students.map(({ password, ...u }) => u));
    }
  } catch (err) {
    res.status(500).json({ message: 'Error searching candidates.' });
  }
});

module.exports = router;
