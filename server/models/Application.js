const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Offer Sent', 'Offer Accepted', 'Offer Declined'],
    default: 'Applied'
  },
  matchScore: { type: Number, default: 0 },
  skillMatchPercent: { type: Number, default: 0 },
  interviewDate: { type: String, default: '' },
  interviewTime: { type: String, default: '' },
  notes: { type: String, default: '' },
  feedback: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
