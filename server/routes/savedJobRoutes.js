const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');

const mockSavedJobs = [];
const getMockJobs = () => { try { return require('./jobRoutes').mockJobs; } catch { return []; } };

// Save/Bookmark Job
router.post('/save', authenticate, async (req, res) => {
  try {
    const { jobId } = req.body;
    if (isMongoConnected()) {
      const SavedJob = require('../models/SavedJob');
      const exists = await SavedJob.findOne({ userId: req.user.id, jobId });
      if (exists) {
        await SavedJob.findByIdAndDelete(exists._id);
        return res.json({ message: 'Job unsaved.', saved: false });
      }
      const saved = new SavedJob({ userId: req.user.id, jobId });
      await saved.save();
      return res.json({ message: 'Job saved!', saved: true });
    } else {
      const idx = mockSavedJobs.findIndex(s => s.userId === req.user.id && s.jobId === jobId);
      if (idx !== -1) {
        mockSavedJobs.splice(idx, 1);
        return res.json({ message: 'Job unsaved.', saved: false });
      }
      mockSavedJobs.push({ _id: 'saved_' + Date.now(), userId: req.user.id, jobId, savedAt: new Date() });
      return res.json({ message: 'Job saved!', saved: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error saving job.' });
  }
});

// Get Saved Jobs
router.get('/saved', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const SavedJob = require('../models/SavedJob');
      const saved = await SavedJob.find({ userId: req.user.id }).populate('jobId').sort({ savedAt: -1 });
      return res.json(saved);
    } else {
      const jobs = getMockJobs();
      const saved = mockSavedJobs.filter(s => s.userId === req.user.id).map(s => ({
        ...s,
        jobId: jobs.find(j => j._id === s.jobId) || { _id: s.jobId, title: 'Position', companyName: 'Company' }
      }));
      return res.json(saved);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved jobs.' });
  }
});

// Check if Job is Saved
router.get('/check/:jobId', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const SavedJob = require('../models/SavedJob');
      const exists = await SavedJob.findOne({ userId: req.user.id, jobId: req.params.jobId });
      return res.json({ saved: !!exists });
    } else {
      const exists = mockSavedJobs.some(s => s.userId === req.user.id && s.jobId === req.params.jobId);
      return res.json({ saved: exists });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error checking save status.' });
  }
});

module.exports = router;
