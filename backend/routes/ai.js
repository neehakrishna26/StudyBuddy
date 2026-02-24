const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

// POST /ai/notes/:noteId/summarize - Summarize note content using AI
router.post('/notes/:noteId/summarize', async (req, res) => {
  const { noteId } = req.params;
  
  try {
    // Fetch note from database
    db.get('SELECT * FROM notes WHERE id = ?', [noteId], async (err, note) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      if (!note.content || note.content.trim() === '') {
        return res.status(400).json({ error: 'Note content is empty' });
      }
      
      const startTime = Date.now();
      
      try {
        // Call free LLM API (using Hugging Face Inference API)
        const response = await axios.post(
          'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
          {
            inputs: `<s>[INST] You are a study assistant. Analyze the following note and provide a structured summary with:
1. Key Concepts (list main topics)
2. Definitions (key terms explained)
3. 5 Bullet Summary (concise points)
4. One-line Exam Tip (practical advice)

Note content:
${note.content}

Provide the summary in a clear, structured format. [/INST]`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              return_full_text: false
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || ''}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );
        
        const endTime = Date.now();
        const latency_ms = endTime - startTime;
        
        const summary = response.data[0]?.generated_text || response.data.generated_text || 'Summary generation failed';
        
        res.json({
          summary,
          latency_ms
        });
        
      } catch (apiError) {
        const endTime = Date.now();
        const latency_ms = endTime - startTime;
        
        console.error('API Error:', apiError.message);
        
        // Fallback response if API fails
        res.status(503).json({
          error: 'AI service unavailable',
          message: apiError.response?.data?.error || apiError.message,
          latency_ms
        });
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
