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
        // Call Groq API with OpenAI-compatible endpoint
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are a study assistant. Summarize notes clearly and concisely. Provide: 1) Key Concepts, 2) Important Definitions, 3) 5-point Summary, 4) One Exam Tip.'
              },
              {
                role: 'user',
                content: note.content
              }
            ],
            temperature: 0.3
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );
        
        const endTime = Date.now();
        const latency_ms = endTime - startTime;
        
        const summary = response.data.choices[0]?.message?.content || 'Summary generation failed';
        
        res.json({
          summary,
          latency_ms
        });
        
      } catch (apiError) {
        const endTime = Date.now();
        const latency_ms = endTime - startTime;
        
        console.error('Groq API Error:', apiError.response?.data || apiError.message);
        
        // Fallback response if API fails
        res.status(503).json({
          error: 'AI service unavailable',
          message: apiError.response?.data?.error?.message || apiError.message,
          latency_ms
        });
      }
    });
    
  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /ai/summarize - Direct summarize endpoint (alternative)
router.post('/summarize', async (req, res) => {
  const { content } = req.body;
  
  // Validate content
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const startTime = Date.now();
  
  try {
    // Call Groq API with OpenAI-compatible endpoint
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a study assistant. Summarize notes clearly and concisely. Provide: 1) Key Concepts, 2) Important Definitions, 3) 5-point Summary, 4) One Exam Tip.'
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    const endTime = Date.now();
    const latency_ms = endTime - startTime;
    
    const summary = response.data.choices[0]?.message?.content || 'Summary generation failed';
    
    res.json({
      summary,
      latency_ms
    });
    
  } catch (apiError) {
    const endTime = Date.now();
    const latency_ms = endTime - startTime;
    
    console.error('Groq API Error:', apiError.response?.data || apiError.message);
    
    // Fallback response if API fails
    res.status(503).json({
      error: 'AI service unavailable',
      message: apiError.response?.data?.error?.message || apiError.message,
      latency_ms
    });
  }
});

module.exports = router;
