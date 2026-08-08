const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 },
  type: { type: String, enum: ['Technical', 'HR', 'Managerial', 'Group Discussion', 'Coding Round'], default: 'Technical' },
  meetingLink: { type: String, default: '' },
  location: { type: String, default: 'Online' },
  interviewerName: { type: String, default: '' },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'], default: 'Scheduled' },
  feedback: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 10 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);
