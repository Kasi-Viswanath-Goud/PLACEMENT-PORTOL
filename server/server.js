const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom viewer for DOCX files
const fs = require('fs');
app.get('/uploads/:filename', async (req, res, next) => {
  const filename = req.params.filename.toLowerCase();
  if (req.query.view === 'html' && (filename.endsWith('.docx') || filename.endsWith('.doc'))) {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.convertToHtml({ path: filePath });
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Resume Viewer</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 2rem; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; background: #fff; }
              h1, h2, h3 { color: #111827; margin-top: 1.5rem; margin-bottom: 0.75rem; }
              p { margin-bottom: 0.75rem; }
              ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
            </style>
          </head>
          <body>
            ${result.value || '<p>No readable text found in document.</p>'}
          </body>
          </html>
        `;
        return res.send(html);
      } catch (err) {
        console.error('Mammoth conversion error:', err);
        return res.status(500).send('Error rendering document preview.');
      }
    }
  }
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route modules can be wrapped in a default export by serverless bundlers.
// Resolve both CommonJS routers and their wrapped equivalents before mounting.
const resolveRouter = (routeModule, routeName) => {
  const pending = [routeModule];
  const seen = new Set();

  while (pending.length) {
    const candidate = pending.shift();
    if (typeof candidate === 'function') return candidate;
    if (!candidate || typeof candidate !== 'object' || seen.has(candidate)) continue;

    seen.add(candidate);
    pending.push(candidate.router, candidate.default, candidate.module);
  }

  throw new TypeError(`${routeName} did not export an Express router`);
};

// Routes
const authRoutes = resolveRouter(require('./routes/authRoutes'), 'authRoutes');
const studentRoutes = resolveRouter(require('./routes/studentRoutes'), 'studentRoutes');
const jobRoutes = resolveRouter(require('./routes/jobRoutes'), 'jobRoutes');
const applicationRoutes = resolveRouter(require('./routes/applicationRoutes'), 'applicationRoutes');
const notificationRoutes = resolveRouter(require('./routes/notificationRoutes'), 'notificationRoutes');
const messageRoutes = resolveRouter(require('./routes/messageRoutes'), 'messageRoutes');
const savedJobRoutes = resolveRouter(require('./routes/savedJobRoutes'), 'savedJobRoutes');
const adminRoutes = resolveRouter(require('./routes/adminRoutes'), 'adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', timestamp: new Date().toISOString(), service: 'ALTS API' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Only start listener when running locally (not inside Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 ALTS Server running on port ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
