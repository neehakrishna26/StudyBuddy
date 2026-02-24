const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

// Helper function to build prompts based on mode
function buildPrompt(mode, content) {
  const normalizedMode = (mode || 'quick').toLowerCase().trim();
  
  const prompts = {
    quick: {
      system: `You are an academic note summarizer specializing in quick revision notes. Create structured, concise revision notes following these rules:
- Use clear headings to organize topics
- Preserve all key definitions verbatim
- Include important syntax and code examples
- Use bullet points for clarity
- Keep it concise but complete
- Maintain academic accuracy
- Format for fast revision and recall`,
      user: `Create quick revision notes from the following content. Use headings, preserve definitions, include syntax, and format with bullets:\n\n${content}`,
      maxTokens: 500
    },
    detailed: {
      system: `You are an academic note summarizer specializing in detailed explanations. Create comprehensive structured notes following these rules:
- Use numbered headings (1., 2., 3., etc.)
- Provide clear, thorough explanations for each concept
- Preserve all examples and code snippets
- Include syntax blocks with proper formatting
- Maintain academic clarity and precision
- Use structured formatting throughout
- Ensure completeness while staying organized`,
      user: `Create detailed structured notes from the following content. Use numbered headings, explain concepts clearly, preserve examples, and include syntax:\n\n${content}`,
      maxTokens: 1000
    },
    exam: {
      system: `You are an exam preparation specialist. Create exam-ready notes with STRICT formatting following this exact structure:

1. DEFINITION
   [Concise, exam-ready definition]

2. KEY POINTS
   • [Point 1]
   • [Point 2]
   • [Point 3]

3. IMPORTANT SYNTAX
   [Code/syntax examples]

4. DIFFERENCES
   [Table format if comparing concepts, otherwise key distinctions]

5. 2-MARK ANSWER
   [Concise 2-3 sentence answer]

6. 5-MARK ANSWER
   [Detailed paragraph with examples]

7. IMPORTANT KEYWORDS
   [Comma-separated list]

Rules:
- Follow the structure exactly
- Be concise but exam-ready
- Preserve technical accuracy
- Use proper formatting
- Include all sections even if brief`,
      user: `Create exam-ready notes from the following content. Follow the exact 7-section structure (Definition, Key Points, Important Syntax, Differences, 2-Mark Answer, 5-Mark Answer, Important Keywords):\n\n${content}`,
      maxTokens: 1200
    }
  };

  // Default to quick mode if invalid mode provided
  return prompts[normalizedMode] || prompts.quick;
}

// POST /ai/notes/:noteId/summarize - Summarize note content using AI
router.post('/notes/:noteId/summarize', async (req, res) => {
  const { noteId } = req.params;
  const rawMode = req.body.mode || 'quick';
  const mode = rawMode.toLowerCase().trim();
  
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
      const prompt = buildPrompt(mode, note.content);
      
      try {
        // Call Groq API with OpenAI-compatible endpoint
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: prompt.system
              },
              {
                role: 'user',
                content: prompt.user
              }
            ],
            temperature: 0.3,
            max_tokens: prompt.maxTokens
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
  const rawMode = req.body.mode || 'quick';
  const mode = rawMode.toLowerCase().trim();
  const { content } = req.body;
  
  // Validate content
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const startTime = Date.now();
  const prompt = buildPrompt(mode, content);
  
  try {
    // Call Groq API with OpenAI-compatible endpoint
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: prompt.system
          },
          {
            role: 'user',
            content: prompt.user
          }
        ],
        temperature: 0.3,
        max_tokens: prompt.maxTokens
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
