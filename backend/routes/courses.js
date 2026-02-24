const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateFields } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// GET /courses - List all courses for logged-in user
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC', 
    [req.user.userId], 
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch courses' });
      }
      res.json(rows);
    }
  );
});

// GET /courses/:id - Get single course (only if belongs to user)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM courses WHERE id = ? AND user_id = ?', 
    [id, req.user.userId], 
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch course' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(row);
    }
  );
});

// POST /courses - Create new course for logged-in user
router.post('/', validateFields(['title']), (req, res) => {
  const { title } = req.body;

  db.run(
    'INSERT INTO courses (title, user_id) VALUES (?, ?)',
    [title, req.user.userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create course' });
      }
      res.status(201).json({ 
        id: this.lastID, 
        title, 
        user_id: req.user.userId,
        created_at: new Date().toISOString()
      });
    }
  );
});

// PUT /courses/:id - Update course title (only if belongs to user)
router.put('/:id', validateFields(['title']), (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  db.run(
    'UPDATE courses SET title = ? WHERE id = ? AND user_id = ?',
    [title, id, req.user.userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update course' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Course not found or unauthorized' });
      }
      res.json({ id: parseInt(id), title, message: 'Course updated successfully' });
    }
  );
});

// DELETE /courses/:id - Delete course (only if belongs to user)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // First check if course exists and belongs to user
  db.get(
    'SELECT id FROM courses WHERE id = ? AND user_id = ?', 
    [id, req.user.userId], 
    (err, course) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete course' });
      }
      if (!course) {
        return res.status(404).json({ error: 'Course not found or unauthorized' });
      }
      
      // Delete course (CASCADE will delete related notes)
      db.run('DELETE FROM courses WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to delete course' });
        }
        res.json({ message: 'Course and related notes deleted successfully' });
      });
    }
  );
});

// GET /courses/:id/notes - Get all notes for a course (only if course belongs to user)
router.get('/:id/notes', (req, res) => {
  const { id } = req.params;
  
  // First check if course exists and belongs to user
  db.get(
    'SELECT id FROM courses WHERE id = ? AND user_id = ?', 
    [id, req.user.userId], 
    (err, course) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch notes' });
      }
      if (!course) {
        return res.status(404).json({ error: 'Course not found or unauthorized' });
      }
      
      // Get notes for the course
      db.all(
        'SELECT * FROM notes WHERE course_id = ? ORDER BY created_at DESC', 
        [id], 
        (err, rows) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch notes' });
          }
          res.json(rows);
        }
      );
    }
  );
});

// POST /courses/:id/notes - Create a new note for a course (only if course belongs to user)
router.post('/:id/notes', validateFields(['title']), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  // Validate that course exists and belongs to user
  db.get(
    'SELECT id FROM courses WHERE id = ? AND user_id = ?', 
    [id, req.user.userId], 
    (err, course) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create note' });
      }
      if (!course) {
        return res.status(404).json({ error: 'Course not found or unauthorized' });
      }
      
      // Create the note
      db.run(
        'INSERT INTO notes (course_id, title, content) VALUES (?, ?, ?)',
        [id, title, content || ''],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to create note' });
          }
          res.status(201).json({ 
            id: this.lastID, 
            course_id: parseInt(id), 
            title, 
            content: content || '',
            created_at: new Date().toISOString()
          });
        }
      );
    }
  );
});

module.exports = router;
