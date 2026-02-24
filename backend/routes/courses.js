const express = require('express');
const router = express.Router();
const db = require('../db');

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
router.post('/', (req, res) => {
  const { title, user_id } = req.body;
  
  if (!title || !user_id) {
    return res.status(400).json({ error: 'Title and user_id are required' });
  }

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

module.exports = router;
