require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Initialize database

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const notesRoutes = require('./routes/notes');
const aiRoutes = require('./routes/ai');

app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/notes', notesRoutes);
app.use('/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('StudyBuddy API running');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('  POST /auth/register');
  console.log('  POST /auth/login');
  console.log('  GET  /auth/me');
  console.log('  GET  /courses');
  console.log('  POST /courses');
  console.log('  GET  /notes/:id');
  console.log('  POST /ai/notes/:noteId/summarize');
});