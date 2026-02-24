const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateFields } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// Helper function to verify note belongs to user
const verifyNoteOwnership = (noteId, userId, callback) => {
  db.get(
    `SELECT n.id FROM notes n 
     JOIN courses c ON n.course_id = c.id 
     WHERE n.id = ? AND c.user_id = ?`,
    [noteId, userId],
    callback
  );
};

// GET /notes/:id - Get a single note (only if belongs to user's course)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  verifyNoteOwnership(id, req.user.userId, (err, ownership) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch note' });
    }
    if (!ownership) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }
    
    db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch note' });
      }
      res.json(row);
    });
  });
});

// PUT /notes/:id - Update a note (only if belongs to user's course)
router.put('/:id', validateFields(['title']), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  verifyNoteOwnership(id, req.user.userId, (err, ownership) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update note' });
    }
    if (!ownership) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }
    
    db.run(
      'UPDATE notes SET title = ?, content = ? WHERE id = ?',
      [title, content || '', id],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to update note' });
        }
        res.json({ 
          id: parseInt(id), 
          title, 
          content: content || '',
          message: 'Note updated successfully'
        });
      }
    );
  });
});

// DELETE /notes/:id - Delete a note (only if belongs to user's course)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  verifyNoteOwnership(id, req.user.userId, (err, ownership) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete note' });
    }
    if (!ownership) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }
    
    db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete note' });
      }
      res.json({ message: 'Note deleted successfully' });
    });
  });
});

module.exports = router;
