const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate, JWT_SECRET } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');

// In-Memory Fallback Store
const mockUsers = [
  {
    _id: 'student_1', name: 'Rahul Sharma', email: 'rahul@campus.edu', role: 'student',
    cgpa: 8.8, branch: 'Computer Science', passingYear: 2026, phone: '+91 9876543210',
    college: 'IIT Delhi', degree: 'B.Tech', headline: 'Full-Stack Developer | AI Enthusiast',
    skills: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS'],
    education: [{ institution: 'IIT Delhi', degree: 'B.Tech', field: 'Computer Science', grade: '8.8 CGPA' }],
    projects: [{ title: 'AI Placement Portal', description: 'Built an AI-powered job portal', techStack: ['React', 'Node.js'] }],
    github: 'https://github.com/rahul', linkedin: 'https://linkedin.com/in/rahul',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    _id: 'student_2', name: 'Priya Patel', email: 'priya@campus.edu', role: 'student',
    cgpa: 9.1, branch: 'Information Technology', passingYear: 2026, phone: '+91 9998887776',
    college: 'NIT Trichy', degree: 'B.Tech', headline: 'Data Science Intern | ML Engineer',
    skills: ['Python', 'TensorFlow', 'SQL', 'Data Analysis'],
    education: [{ institution: 'NIT Trichy', degree: 'B.Tech', field: 'Information Technology', grade: '9.1 CGPA' }],
    projects: [{ title: 'Sales Predictor', description: 'ML model to predict e-commerce sales', techStack: ['Python', 'Pandas'] }],
    github: 'https://github.com/priya', linkedin: 'https://linkedin.com/in/priya',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    _id: 'student_3', name: 'Amit Kumar', email: 'amit@campus.edu', role: 'student',
    cgpa: 7.5, branch: 'Electronics', passingYear: 2026, phone: '+91 8887776665',
    college: 'BITS Pilani', degree: 'B.E.', headline: 'IoT Developer | Hardware Hacker',
    skills: ['C++', 'IoT', 'Embedded Systems', 'Arduino'],
    education: [{ institution: 'BITS Pilani', degree: 'B.E.', field: 'Electronics', grade: '7.5 CGPA' }],
    projects: [{ title: 'Smart Home Hub', description: 'IoT based automated home system', techStack: ['C++', 'Arduino'] }],
    github: 'https://github.com/amit', linkedin: 'https://linkedin.com/in/amit',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

const findMockUser = (email) => mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, cgpa, branch, passingYear, phone, companyName, website, industry, college, university, degree } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const assignedRole = ['student', 'company', 'admin'].includes(role) ? role : 'student';
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isMongoConnected()) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered.' });

      const user = new User({
        name, email, password: hashedPassword, role: assignedRole,
        cgpa: parseFloat(cgpa) || 0, branch: branch || 'Computer Science',
        passingYear: parseInt(passingYear) || 2026, phone: phone || '',
        college: college || '', university: university || '', degree: degree || 'B.Tech',
        companyName: companyName || (assignedRole === 'company' ? name : ''),
        website: website || '', industry: industry || '',
        skills: assignedRole === 'student' ? ['JavaScript', 'React', 'Node.js'] : []
      });
      await user.save();
      const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name, companyName: user.companyName }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userData } = user.toObject();
      return res.status(201).json({ message: 'Registered successfully!', token, user: userData });
    } else {
      if (findMockUser(email)) return res.status(400).json({ message: 'Email already registered.' });
      const newUser = {
        _id: 'usr_' + Date.now(), name, email, password: hashedPassword, role: assignedRole,
        cgpa: parseFloat(cgpa) || 8.2, branch: branch || 'Computer Science',
        passingYear: parseInt(passingYear) || 2026, phone: phone || '+91 9876543210',
        college: college || 'IIIT Hyderabad', university: university || 'IIIT Hyderabad', degree: degree || 'B.Tech',
        headline: 'Full-Stack Developer | AI/ML Enthusiast',
        summary: 'Passionate software engineer with hands-on experience in MERN stack, Python, and cloud technologies. Built multiple production-grade applications and contributed to open-source projects.',
        skills: assignedRole === 'student' ? ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'MongoDB', 'Express.js', 'Git', 'Docker', 'AWS', 'REST APIs', 'GraphQL'] : [],
        programmingLanguages: assignedRole === 'student' ? ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript'] : [],
        projects: assignedRole === 'student' ? [
          { title: 'AI-Powered Job Portal', description: 'Full-stack placement portal with AI resume matching, real-time notifications, and analytics dashboard', techStack: ['React', 'Node.js', 'MongoDB', 'Express.js'], liveUrl: '', githubUrl: 'https://github.com/demo/job-portal' },
          { title: 'E-Commerce Microservices', description: 'Scalable e-commerce platform using microservices architecture with payment gateway integration', techStack: ['React', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kafka'], liveUrl: '', githubUrl: 'https://github.com/demo/ecommerce' },
          { title: 'Real-Time Chat App', description: 'WebSocket-based chat application with end-to-end encryption and file sharing', techStack: ['React', 'Socket.io', 'Node.js', 'Redis'], liveUrl: '', githubUrl: 'https://github.com/demo/chatapp' }
        ] : [],
        internships: assignedRole === 'student' ? [
          { company: 'Google', role: 'Software Engineering Intern', duration: '3 months', description: 'Worked on Google Cloud Platform tooling and internal developer productivity tools' },
          { company: 'Microsoft', role: 'Full-Stack Intern', duration: '2 months', description: 'Built React-based dashboard for Azure monitoring services' }
        ] : [],
        experience: [], education: assignedRole === 'student' ? [
          { institution: college || 'IIIT Hyderabad', degree: degree || 'B.Tech', field: branch || 'Computer Science', grade: `${parseFloat(cgpa) || 8.2} CGPA`, startYear: 2022, endYear: parseInt(passingYear) || 2026 }
        ] : [],
        certifications: assignedRole === 'student' ? [
          { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025', url: '' },
          { title: 'Meta Front-End Developer Certificate', issuer: 'Meta (Coursera)', date: '2025', url: '' }
        ] : [],
        achievements: assignedRole === 'student' ? [
          { title: 'Smart India Hackathon Winner', description: 'First place in SIH 2025 among 5000+ teams', date: '2025' },
          { title: 'LeetCode Knight', description: '1900+ rating, solved 500+ problems', date: '2025' }
        ] : [],
        resumeUrl: '', resumeOriginalName: '', resumeScore: assignedRole === 'student' ? 82 : 0,
        github: 'https://github.com/demo', linkedin: 'https://linkedin.com/in/demo',
        portfolio: '', personalWebsite: '', twitter: '',
        profilePicture: '',
        companyName: companyName || (assignedRole === 'company' ? name : ''),
        website: website || '', industry: industry || '', hrContactName: '', designation: '',
        department: '', description: '', profileViews: 12,
        portfolioData: { heroTagline: '', aboutMe: '', themeColor: '#6366F1', isPublic: false },
        isVerified: true, createdAt: new Date(), updatedAt: new Date()
      };
      mockUsers.push(newUser);
      const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email, name: newUser.name, companyName: newUser.companyName }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userData } = newUser;
      return res.status(201).json({ message: 'Registered successfully!', token, user: userData });
    }
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
      const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name, companyName: user.companyName }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userData } = user.toObject();
      return res.json({ message: 'Login successful!', token, user: userData });
    } else {
      // Seed demo accounts
      let user = findMockUser(email);
      if (!user && ['student@campus.edu', 'hr@google.com', 'admin@placement.edu'].includes(email)) {
        const hp = await bcrypt.hash('password123', 10);
        const demos = {
          'student@campus.edu': {
            _id: 'mock_student_1', name: 'Chintu', email: 'student@campus.edu', password: hp, role: 'student',
            cgpa: 8.5, branch: 'Computer Science', passingYear: 2026, phone: '+91 9876543210',
            college: 'IIT Delhi', university: 'IIT Delhi', degree: 'B.Tech',
            headline: 'Full-Stack Developer | Open Source Enthusiast',
            summary: 'Passionate Computer Science student with expertise in web development, machine learning, and cloud computing.',
            skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Node.js'],
            programmingLanguages: ['JavaScript', 'Python', 'C++', 'Java'],
            projects: [
              { title: 'E-Commerce Platform', description: 'Full-stack marketplace with payment integration', techStack: ['React', 'Node.js', 'MongoDB'], liveUrl: '', githubUrl: 'https://github.com/alex/ecommerce' },
              { title: 'AI Chatbot', description: 'NLP-powered chatbot for customer support', techStack: ['Python', 'TensorFlow', 'Flask'], liveUrl: '', githubUrl: 'https://github.com/alex/chatbot' }
            ],
            internships: [
              { company: 'Microsoft', role: 'Software Engineering Intern', duration: '3 months', description: 'Worked on Azure DevOps tooling' }
            ],
            experience: [], education: [
              { institution: 'IIT Delhi', degree: 'B.Tech', field: 'Computer Science', grade: '8.5 CGPA', startYear: 2022, endYear: 2026 }
            ],
            certifications: [
              { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025', url: '' }
            ],
            achievements: [
              { title: 'Google Code Jam Finalist', description: 'Top 500 globally', date: '2025' }
            ],
            resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', resumeOriginalName: 'Chintu_Resume.pdf', resumeScore: 78,
            github: 'https://github.com/alexjohnson', linkedin: 'https://linkedin.com/in/alexjohnson',
            portfolio: '', personalWebsite: '', twitter: '',
            profilePicture: '', profileViews: 42,
            portfolioData: { heroTagline: '', aboutMe: '', themeColor: '#6366F1', isPublic: false },
            companyName: '', website: '', industry: '', isVerified: true, createdAt: new Date(), updatedAt: new Date()
          },
          'hr@google.com': {
            _id: 'mock_hr_1', name: 'Sarah Chen', email: 'hr@google.com', password: hp, role: 'company',
            companyName: 'Google', website: 'https://careers.google.com', industry: 'Technology',
            hrContactName: 'Sarah Chen', designation: 'Senior Recruiter', department: 'Talent Acquisition',
            description: 'Global technology leader', skills: [], programmingLanguages: [],
            projects: [], internships: [], experience: [], education: [], certifications: [], achievements: [],
            cgpa: 0, branch: '', passingYear: 0, phone: '+91 9999888877',
            resumeUrl: '', resumeOriginalName: '', resumeScore: 0,
            github: '', linkedin: '', portfolio: '', personalWebsite: '', twitter: '',
            headline: '', summary: '', profilePicture: '', profileViews: 0,
            portfolioData: { heroTagline: '', aboutMe: '', themeColor: '#6366F1', isPublic: false },
            college: '', university: '', degree: '',
            isVerified: true, createdAt: new Date(), updatedAt: new Date()
          },
          'admin@placement.edu': {
            _id: 'mock_admin_1', name: 'Prof. Rajesh Kumar', email: 'admin@placement.edu', password: hp, role: 'admin',
            designation: 'Placement Officer', department: 'Training & Placement Cell',
            skills: [], programmingLanguages: [], projects: [], internships: [], experience: [],
            education: [], certifications: [], achievements: [],
            cgpa: 0, branch: '', passingYear: 0, phone: '+91 9999000011',
            resumeUrl: '', resumeOriginalName: '', resumeScore: 0,
            github: '', linkedin: '', portfolio: '', personalWebsite: '', twitter: '',
            headline: '', summary: '', profilePicture: '', profileViews: 0,
            portfolioData: { heroTagline: '', aboutMe: '', themeColor: '#6366F1', isPublic: false },
            companyName: '', website: '', industry: '', college: '', university: '', degree: '',
            isVerified: true, createdAt: new Date(), updatedAt: new Date()
          }
        };
        user = demos[email];
        if (user) mockUsers.push(user);
      }
      if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
      const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name, companyName: user.companyName }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userData } = user;
      return res.json({ message: 'Login successful!', token, user: userData });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get Current User
router.get('/me', authenticate, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found.' });
      return res.json(user);
    } else {
      const user = mockUsers.find(u => u._id === req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found.' });
      const { password, ...userData } = user;
      return res.json(userData);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile.' });
  }
});

module.exports = { router, mockUsers };
