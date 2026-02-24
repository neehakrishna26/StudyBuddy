const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateFields } = require('../middleware/validation');

// GET /notes/:id - Get a single note by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(row);
  });
});

// PUT /notes/:id - Update a note
router.put('/:id', validateFields(['title']), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  db.run(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [title, content || '', id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json({ id: parseInt(id), title, content: content || '' });
    }
  );
});

// DELETE /notes/:id - Delete a note
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
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