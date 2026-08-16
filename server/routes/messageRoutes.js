const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');

const mockMessages = [];

const getConversationId = (id1, id2) => [id1, id2].sort().join('_');

// Get Conversations List
router.get('/conversations', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const Message = require('../models/Message');
      const User = require('../models/User'); // Import User model
      const messages = await Message.aggregate([
        { $match: { $or: [{ senderId: req.user.id }, { receiverId: req.user.id }] } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' }, unread: { $sum: { $cond: [{ $and: [{ $eq: ['$receiverId', req.user.id] }, { $eq: ['$isRead', false] }] }, 1, 0] } } } }
      ]);
      
      // Populate otherUser details for MongoDB
      const convList = await Promise.all(messages.map(async (conv) => {
        const ids = conv._id.split('_');
        const otherId = ids[0] === req.user.id ? ids[1] : ids[0];
        let otherUser = await User.findById(otherId).select('name role companyName');
        if (!otherUser) otherUser = { _id: otherId, name: 'Unknown', role: 'unknown' };
        return { ...conv, otherUser };
      }));
      
      return res.json(convList);
    } else {
      const convMap = {};
      mockMessages.filter(m => m.senderId === req.user.id || m.receiverId === req.user.id).forEach(m => {
        if (!convMap[m.conversationId] || new Date(m.createdAt) > new Date(convMap[m.conversationId].lastMessage.createdAt)) {
          convMap[m.conversationId] = { _id: m.conversationId, lastMessage: m, unread: 0 };
        }
        if (m.receiverId === req.user.id && !m.isRead) convMap[m.conversationId].unread++;
      });
      
      // Seed demo conversations
      if (Object.keys(convMap).length === 0 && req.user.role === 'student') {
        const demoMsgs = [
          { _id: 'msg_1', senderId: 'mock_hr_1', receiverId: req.user.id, conversationId: getConversationId('mock_hr_1', req.user.id), content: 'Hi! We reviewed your profile and would like to invite you for an interview.', type: 'text', isRead: false, createdAt: new Date(Date.now() - 7200000) },
          { _id: 'msg_2', senderId: req.user.id, receiverId: 'mock_hr_1', conversationId: getConversationId('mock_hr_1', req.user.id), content: 'Thank you! I would love to schedule an interview. When would be convenient?', type: 'text', isRead: true, createdAt: new Date(Date.now() - 3600000) }
        ];
        mockMessages.push(...demoMsgs);
        return res.json([{ _id: demoMsgs[0].conversationId, lastMessage: demoMsgs[1], unread: 1, otherUser: { _id: 'mock_hr_1', name: 'Sarah Chen (Google)', role: 'company' } }]);
      }
      const getMockUsers = () => { try { return require('./authRoutes').mockUsers; } catch { return []; } };
      const users = getMockUsers();
      
      const convList = Object.values(convMap).map(conv => {
        const ids = conv._id.split('_');
        const otherId = ids[0] === req.user.id ? ids[1] : ids[0];
        const otherUser = users.find(u => u._id === otherId) || { _id: otherId, name: 'Unknown', role: 'unknown' };
        return { ...conv, otherUser };
      });
      
      return res.json(convList);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching conversations.' });
  }
});

// Get Messages in Conversation
router.get('/:conversationId', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const Message = require('../models/Message');
      const messages = await Message.find({ conversationId: req.params.conversationId }).sort({ createdAt: 1 });
      await Message.updateMany({ conversationId: req.params.conversationId, receiverId: req.user.id, isRead: false }, { isRead: true, readAt: new Date() });
      return res.json(messages);
    } else {
      const messages = mockMessages.filter(m => m.conversationId === req.params.conversationId);
      messages.filter(m => m.receiverId === req.user.id).forEach(m => { m.isRead = true; m.readAt = new Date(); });
      return res.json(messages);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages.' });
  }
});

// Send Message
router.post('/send', authenticate, async (req, res) => {
  try {
    const { receiverId, content, type } = req.body;
    if (!receiverId || !content) return res.status(400).json({ message: 'Receiver and content required.' });
    const conversationId = getConversationId(req.user.id, receiverId);

    if (isMongoConnected()) {
      const Message = require('../models/Message');
      const msg = new Message({ senderId: req.user.id, receiverId, conversationId, content, type: type || 'text' });
      await msg.save();
      return res.status(201).json({ message: 'Sent!', data: msg });
    } else {
      const msg = { _id: 'msg_' + Date.now(), senderId: req.user.id, receiverId, conversationId, content, type: type || 'text', isRead: false, createdAt: new Date() };
      mockMessages.push(msg);
      return res.status(201).json({ message: 'Sent!', data: msg });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error sending message.' });
  }
});

module.exports = router;
