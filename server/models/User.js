const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'company', 'admin'], 
    default: 'student' 
  },
  isVerified: { type: Boolean, default: true },
  profilePicture: { type: String, default: '' },

  // Student Profile Fields
  headline: { type: String, default: '' },
  summary: { type: String, default: '' },
  phone: { type: String, default: '' },
  college: { type: String, default: '' },
  university: { type: String, default: '' },
  degree: { type: String, default: "B.Tech" },
  branch: { type: String, default: 'Computer Science' },
  cgpa: { type: Number, default: 0 },
  passingYear: { type: Number, default: 2026 },
  
  skills: [{ type: String }],
  programmingLanguages: [{ type: String }],
  
  projects: [{
    title: String,
    description: String,
    techStack: [String],
    liveUrl: String,
    githubUrl: String,
    image: String
  }],
  
  internships: [{
    company: String,
    role: String,
    duration: String,
    description: String,
    startDate: Date,
    endDate: Date
  }],
  
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String,
    startDate: Date,
    endDate: Date
  }],
  
  education: [{
    institution: String,
    degree: String,
    field: String,
    grade: String,
    startYear: Number,
    endYear: Number
  }],
  
  certifications: [{
    title: String,
    issuer: String,
    date: String,
    url: String,
    credentialId: String
  }],
  
  achievements: [{
    title: String,
    description: String,
    date: String
  }],

  // Resume
  resumeUrl: { type: String, default: '' },
  resumeOriginalName: { type: String, default: '' },
  resumeScore: { type: Number, default: 0 },

  // Social Links
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  personalWebsite: { type: String, default: '' },
  twitter: { type: String, default: '' },

  // Portfolio Builder Data
  portfolioData: {
    heroTagline: { type: String, default: '' },
    aboutMe: { type: String, default: '' },
    themeColor: { type: String, default: '#6366F1' },
    isPublic: { type: Boolean, default: false }
  },

  // Company/HR Specific Fields
  companyName: { type: String, default: '' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  website: { type: String, default: '' },
  industry: { type: String, default: '' },
  hrContactName: { type: String, default: '' },
  designation: { type: String, default: '' },
  department: { type: String, default: '' },
  description: { type: String, default: '' },

  // Stats
  profileViews: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtual: Profile Completion Percentage
userSchema.virtual('profileCompletion').get(function() {
  if (this.role !== 'student') return 100;
  const fields = [
    this.name, this.email, this.phone, this.headline, this.summary,
    this.college, this.degree, this.branch, this.cgpa > 0,
    this.skills?.length > 0, this.resumeUrl, this.github || this.linkedin,
    this.projects?.length > 0, this.education?.length > 0
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
