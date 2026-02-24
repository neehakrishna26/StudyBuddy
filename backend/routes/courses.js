const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateFields } = require('../middleware/validation');

// GET /courses - List all courses
router.get('/', (req, res) => {
  db.all('SELECT * FROM courses', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /courses - Create new course
router.post('/', validateFields(['title', 'user_id']), (req, res) => {
  const { title, user_id } = req.body;

  db.run(
    'INSERT INTO courses (title, user_id) VALUES (?, ?)',
    [title, user_id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, title, user_id });
    }
  );
});

// GET /courses/:id - Get one course
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(row);
  });
});

// DELETE /courses/:id - Delete course
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM courses WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  });
});

// GET /courses/:id/notes - Get all notes for a course
router.get('/:id/notes', (req, res) => {
  const { id } = req.params;
  
  db.all('SELECT * FROM notes WHERE course_id = ?', [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /courses/:id/notes - Create a new note for a course
router.post('/:id/notes', validateFields(['title']), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  // Validate that course exists
  db.get('SELECT id FROM courses WHERE id = ?', [id], (err, course) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Create the note
    db.run(
      'INSERT INTO notes (course_id, title, content) VALUES (?, ?, ?)',
      [id, title, content || ''],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
          id: this.lastID, 
          course_id: parseInt(id), 
          title, 
          content: content || '' 
        });
      }
    );
  });
});

module.exports = router;
