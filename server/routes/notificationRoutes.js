const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');

const mockNotifications = [];
const getMockUsers = () => { try { return require('./authRoutes').mockUsers; } catch { return []; } };

// Get My Notifications
router.get('/', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const Notification = require('../models/Notification');
      const notifs = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
      return res.json(notifs);
    } else {
      const notifs = mockNotifications.filter(n => n.userId === req.user.id);
      if (notifs.length === 0) {
        // Seed demo notifications
        const demos = [
          { _id: 'notif_1', userId: req.user.id, type: 'job_posted', title: 'New Job Opening', message: 'Google has posted a new Software Engineer position', link: '/jobs', isRead: false, createdAt: new Date(Date.now() - 3600000) },
          { _id: 'notif_3', userId: req.user.id, type: 'profile_view', title: 'Profile Viewed', message: 'A recruiter from Microsoft viewed your profile', link: '/profile', isRead: true, createdAt: new Date(Date.now() - 172800000) }
        ];
        mockNotifications.push(...demos);
        return res.json(demos);
      }
      return res.json(notifs);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications.' });
  }
});

// Mark as Read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const Notification = require('../models/Notification');
      await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() });
      return res.json({ message: 'Marked as read.' });
    } else {
      const notif = mockNotifications.find(n => n._id === req.params.id);
      if (notif) { notif.isRead = true; notif.readAt = new Date(); }
      return res.json({ message: 'Marked as read.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification.' });
  }
});

// Mark All as Read
router.put('/read-all', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const Notification = require('../models/Notification');
      await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true, readAt: new Date() });
    } else {
      mockNotifications.filter(n => n.userId === req.user.id).forEach(n => { n.isRead = true; n.readAt = new Date(); });
    }
    return res.json({ message: 'All marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Error.' });
  }
});

// Get Unread Count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const Notification = require('../models/Notification');
      const count = await Notification.countDocuments({ userId: req.user.id, isRead: false });
      return res.json({ count });
    } else {
      const count = mockNotifications.filter(n => n.userId === req.user.id && !n.isRead).length;
      return res.json({ count });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error.' });
  }
});

module.exports = router;
