# StudyBuddy

A modern AI-powered study organizer built with React, Express, and SQLite.

## Features

- 📚 Course Management - Create and organize your courses
- 📝 Note Taking - Write and edit notes for each course
- 🤖 AI Summarization - Generate intelligent summaries using AI
- 🎨 Modern UI - Clean, dark-mode SaaS dashboard design
- ⚡ Fast & Lightweight - Built with Vite and SQLite

## Tech Stack

**Frontend:**
- React 19
- React Router
- Tailwind CSS
- Vite

**Backend:**
- Node.js
- Express
- SQLite3
- Groq API (for AI summarization with Llama 3.3 70B)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Get a free Groq API key:
   - Go to https://console.groq.com/keys
   - Create a new API key
   - Copy the key and paste it in your `.env` file:
   ```
   GROQ_API_KEY=your_actual_api_key_here
   ```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
VITE_API_BASE_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **Create a Course** - Click "Create Course" on the dashboard
2. **Add Notes** - Click on a course to view it, then create notes
3. **Edit Notes** - Click on a note to open the editor
4. **AI Summarization** - In the note editor, click "Summarize" to generate an AI summary

## API Endpoints

### Courses
- `GET /courses` - List all courses
- `POST /courses` - Create a new course
- `GET /courses/:id` - Get a single course
- `DELETE /courses/:id` - Delete a course
- `GET /courses/:id/notes` - Get all notes for a course
- `POST /courses/:id/notes` - Create a note for a course

### Notes
- `GET /notes/:id` - Get a single note
- `PUT /notes/:id` - Update a note
- `DELETE /notes/:id` - Delete a note

### AI
- `POST /ai/notes/:noteId/summarize` - Generate AI summary for a note

## Project Structure

```
StudyBuddy/
├── backend/
│   ├── routes/
│   │   ├── courses.js
│   │   ├── notes.js
│   │   └── ai.js
│   ├── middleware/
│   │   └── validation.js
│   ├── server.js
│   ├── db.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CoursePage.jsx
│   │   │   └── NoteEditor.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
└── README.md
```

## License

MIT