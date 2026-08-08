const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  roleCategory: { type: String, default: 'Software Engineering' },
  location: { type: String, default: 'Bangalore, India' },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], default: 'Full-time' },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'Onsite'], default: 'Hybrid' },
  packageCTC: { type: Number, required: true },
  minCGPA: { type: Number, required: true, default: 6.0 },
  experienceRequired: { type: String, default: 'Fresher' },
  allowedBranches: [{ type: String }],
  passingYear: { type: Number, default: 2026 },
  requiredSkills: [{ type: String }],
  preferredSkills: [{ type: String }],
  responsibilities: { type: String, default: '' },
  qualifications: { type: String, default: '' },
  benefits: { type: String, default: '' },
  vacancies: { type: Number, default: 1 },
  deadline: { type: Date, required: true },
  isApproved: { type: Boolean, default: true },
  applicantCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
