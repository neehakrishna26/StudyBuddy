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
app.use('/courses', require('./routes/courses'));
app.use('/notes', require('./routes/notes'));
app.use('/ai', require('./routes/ai'));

// Health check
app.get('/', (req, res) => {
  res.send('StudyBuddy API running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});