// Vercel Serverless Function entry point
// This file wraps the Express app so Vercel can run it as a serverless function
const app = require('../server/server');

module.exports = app;
