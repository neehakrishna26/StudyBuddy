const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /courses/:id/notes - Get all notes for a course
router.get('/courses/:id/notes', (req, res) => {
  const { id } = req.params;
  
  db.all('SELECT * FROM notes WHERE course_id = ?', [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /courses/:id/notes - Create a new note for a course
router.post('/courses/:id/notes', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
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

// PUT /notes/:noteId - Update a note
router.put('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  db.run(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [title, content || '', noteId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json({ id: parseInt(noteId), title, content: content || '' });
    }
  );
});

// DELETE /notes/:noteId - Delete a note
router.delete('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  
  db.run('DELETE FROM notes WHERE id = ?', [noteId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  });
});

module.exports = router;
