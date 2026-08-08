const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  about: { type: String, default: '' },
  industry: { type: String, default: 'Technology' },
  website: { type: String, default: '' },
  location: { type: String, default: '' },
  employeeCount: { type: String, default: '50-200' },
  foundedYear: { type: Number },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);
