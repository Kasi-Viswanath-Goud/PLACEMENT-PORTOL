const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { authenticate } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');
const User = require('../models/User');

// Resume upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `resume_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
  else cb(new Error('Only PDF and DOC files allowed'), false);
}});

// Get access to mock users from auth
const getMockUsers = () => {
  try { return require('./authRoutes').mockUsers; } catch { return []; }
};

// Update Profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updates.programmingLanguages && typeof updates.programmingLanguages === 'string') {
      updates.programmingLanguages = updates.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean);
    }
    updates.updatedAt = new Date();

    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found.' });
      return res.json({ message: 'Profile updated!', user });
    } else {
      const users = getMockUsers();
      const idx = users.findIndex(u => u._id === req.user.id);
      if (idx === -1) return res.status(404).json({ message: 'User not found.' });
      Object.assign(users[idx], updates);
      const { password, ...userData } = users[idx];
      return res.json({ message: 'Profile updated!', user: userData });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.', error: err.message });
  }
});

// Upload Resume
router.post('/resume', authenticate, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    const resumeUrl = `/uploads/${req.file.filename}`;
    const resumeOriginalName = req.file.originalname;

    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(req.user.id, { resumeUrl, resumeOriginalName }, { new: true }).select('-password');
      return res.json({ message: 'Resume uploaded!', resumeUrl, resumeOriginalName, user });
    } else {
      const users = getMockUsers();
      const idx = users.findIndex(u => u._id === req.user.id);
      if (idx !== -1) { users[idx].resumeUrl = resumeUrl; users[idx].resumeOriginalName = resumeOriginalName; }
      return res.json({ message: 'Resume uploaded!', resumeUrl, resumeOriginalName });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error uploading resume.', error: err.message });
  }
});

// Get Public Student Profile
router.get('/profile/:id', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.params.id).select('-password');
      if (!user || user.role !== 'student') return res.status(404).json({ message: 'Student not found.' });
      // Increment views
      await User.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });
      return res.json(user);
    } else {
      const users = getMockUsers();
      const user = users.find(u => u._id === req.params.id && u.role === 'student');
      if (!user) return res.status(404).json({ message: 'Student not found.' });
      user.profileViews = (user.profileViews || 0) + 1;
      const { password, ...userData } = user;
      return res.json(userData);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student profile.' });
  }
});

// Get Student Portfolio
router.get('/portfolio/:id', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.params.id).select('-password -email -phone');
      if (!user || user.role !== 'student') return res.status(404).json({ message: 'Portfolio not found.' });
      return res.json(user);
    } else {
      const users = getMockUsers();
      const user = users.find(u => u._id === req.params.id);
      if (!user) return res.status(404).json({ message: 'Portfolio not found.' });
      const { password, email, phone, ...data } = user;
      return res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching portfolio.' });
  }
});

// Real Resume Analysis
router.post('/analyze-resume', authenticate, async (req, res) => {
  try {
    const { resumeUrl, targetRole } = req.body;
    
    if (!resumeUrl) {
      return res.status(400).json({ message: 'Resume URL is required for analysis.' });
    }

    const filePath = path.join(__dirname, '../', resumeUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found on server.' });
    }

    let resumeText = '';
    const ext = path.extname(filePath).toLowerCase();

    try {
      if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        resumeText = data.text;
      } else if (ext === '.doc' || ext === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        resumeText = result.value;
      } else {
        return res.status(400).json({ message: 'Unsupported file format for analysis.' });
      }
    } catch (parseErr) {
      console.error('Error parsing resume file:', parseErr);
      return res.status(500).json({ message: 'Failed to extract text from resume.' });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Resume is empty or contains no readable text (could be scanned images).' });
    }

    const lowerText = resumeText.toLowerCase();

    // 1. Keyword Matching & ATS Score
    const industryKeywords = [
      'javascript', 'react', 'node.js', 'python', 'sql', 'git', 'agile', 'mongodb', 
      'express', 'typescript', 'java', 'c++', 'docker', 'aws', 'kubernetes', 'html', 'css', 
      'rest api', 'graphql', 'machine learning', 'data structures', 'algorithms'
    ];
    
    let matchedKeywords = [];
    let missingGaps = [];
    
    industryKeywords.forEach(kw => {
      if (lowerText.includes(kw)) {
        matchedKeywords.push(kw);
      } else {
        missingGaps.push(kw);
      }
    });

    // Score based on keywords, length, and sections
    let score = 40; 
    score += Math.min(matchedKeywords.length * 3, 30); // Up to 30 pts for keywords
    
    if (resumeText.length > 500) score += 5;
    if (resumeText.length > 1000) score += 5;

    // Detect common sections
    const hasEducation = /education|academic/i.test(lowerText);
    const hasExperience = /experience|employment|work history/i.test(lowerText);
    const hasSkills = /skills|technologies|proficiencies/i.test(lowerText);
    const hasProjects = /projects|portfolio/i.test(lowerText);

    if (hasEducation) score += 5;
    if (hasExperience) score += 5;
    if (hasSkills) score += 5;
    if (hasProjects) score += 5;

    // Check for quantifiable achievements (numbers, % signs)
    const hasQuantifiable = /\b\d{1,3}%\b|\b\d+\s*(users|clients|customers|revenue|sales)\b/i.test(lowerText);
    if (hasQuantifiable) score += 10;

    // Cap score at 100
    score = Math.min(score, 100);

    // Generate specific suggestions
    const suggestions = [];
    if (!hasQuantifiable) suggestions.push('Add quantifiable achievements with metrics (e.g., "Improved performance by 40%").');
    if (matchedKeywords.length < 5) suggestions.push(`Include more technical keywords relevant to ${targetRole}.`);
    if (!hasExperience) suggestions.push('Consider adding a dedicated "Experience" or "Internships" section.');
    if (!hasProjects) suggestions.push('Add a "Projects" section to showcase your practical skills.');
    if (!/github\.com|linkedin\.com/i.test(lowerText)) suggestions.push('Include links to your GitHub and LinkedIn profiles.');
    if (score > 80) suggestions.push('Your resume is well-structured! Keep updating it as you learn new skills.');

    const strengths = [];
    if (matchedKeywords.length >= 5) strengths.push('Good technical keyword density');
    if (hasEducation && hasSkills) strengths.push('Clear structure with essential sections');
    if (hasQuantifiable) strengths.push('Uses metrics to demonstrate impact');

    return res.json({
      score,
      suggestions: suggestions.length > 0 ? suggestions : ['Your resume looks great!'],
      skillGaps: missingGaps.sort(() => 0.5 - Math.random()).slice(0, 4), // pick 4 random missing skills
      strengths: strengths.length > 0 ? strengths : ['Basic text extraction successful'],
      atsKeywords: matchedKeywords.slice(0, 10), // return up to 10 matched keywords
      grammarIssues: 0, // Needs NLP to do this properly
      formattingScore: score > 70 ? 90 : 75
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Real analysis error.', error: err.message });
  }
});

// Generate Cover Letter (Mock)
router.post('/generate-cover-letter', authenticate, async (req, res) => {
  try {
    const { jobTitle, companyName, skills } = req.body;
    const userName = req.user.name || 'Candidate';
    
    const coverLetter = `Dear Hiring Manager at ${companyName || 'your company'},

I am writing to express my strong interest in the ${jobTitle || 'Software Engineer'} position. As a passionate and skilled developer with expertise in ${(skills || ['JavaScript', 'React']).join(', ')}, I am confident in my ability to contribute meaningfully to your team.

During my academic journey, I have built several projects demonstrating my technical proficiency and problem-solving abilities. My experience spans full-stack development, and I am particularly drawn to ${companyName || 'your company'}'s commitment to innovation and technological excellence.

Key highlights of my profile:
• Strong foundation in data structures, algorithms, and system design
• Hands-on experience with modern web technologies and cloud platforms
• Proven ability to work collaboratively in team environments
• Track record of delivering quality code with attention to best practices

I am eager to bring my skills and enthusiasm to ${companyName || 'your organization'} and contribute to building impactful products. I look forward to discussing how my background aligns with your team's goals.

Best regards,
${userName}`;

    return res.json({ coverLetter });
  } catch (err) {
    res.status(500).json({ message: 'Cover letter generation error.' });
  }
});

// Generate Short Resume from Profile
router.get('/generate-resume', authenticate, async (req, res) => {
  try {
    let userData;

    if (isMongoConnected()) {
      userData = await User.findById(req.user.id).select('-password');
      if (!userData) return res.status(404).json({ message: 'User not found.' });
    } else {
      const users = getMockUsers();
      const found = users.find(u => u._id === req.user.id);
      if (!found) return res.status(404).json({ message: 'User not found.' });
      const { password, ...rest } = found;
      userData = rest;
    }

    // Build resume data object
    const resume = {
      name: userData.name || 'Student Name',
      email: userData.email || '',
      phone: userData.phone || '',
      headline: userData.headline || '',
      summary: userData.summary || '',
      college: userData.college || '',
      degree: userData.degree || '',
      branch: userData.branch || '',
      cgpa: userData.cgpa || 0,
      passingYear: userData.passingYear || '',
      skills: userData.skills || [],
      programmingLanguages: userData.programmingLanguages || [],
      projects: (userData.projects || []).map(p => ({
        title: p.title || '',
        description: p.description || '',
        techStack: p.techStack || [],
        liveUrl: p.liveUrl || '',
        githubUrl: p.githubUrl || ''
      })),
      internships: (userData.internships || []).map(i => ({
        company: i.company || '',
        role: i.role || '',
        duration: i.duration || '',
        description: i.description || ''
      })),
      experience: (userData.experience || []).map(e => ({
        company: e.company || '',
        position: e.position || '',
        duration: e.duration || '',
        description: e.description || ''
      })),
      certifications: (userData.certifications || []).map(c => ({
        title: c.title || '',
        issuer: c.issuer || '',
        date: c.date || ''
      })),
      achievements: (userData.achievements || []).map(a => ({
        title: a.title || '',
        description: a.description || ''
      })),
      github: userData.github || '',
      linkedin: userData.linkedin || '',
      portfolio: userData.portfolio || ''
    };

    return res.json({ resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating resume.', error: err.message });
  }
});

module.exports = router;
