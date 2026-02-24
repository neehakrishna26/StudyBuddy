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

## 🏗 System Architecture

StudyBuddy follows a full-stack client-server architecture:

```
User (Browser)
      ↓
React Frontend (Vite + Tailwind)
      ↓
REST API (JWT Protected)
      ↓
Express Backend (Node.js)
      ↓
SQLite Relational Database
      ↓
Groq LLM API (Llama 3.3 70B)
```

**Architecture Overview:**

- **Frontend Communication**: The React frontend communicates with the backend exclusively through RESTful API calls, ensuring clean separation of concerns.
- **JWT Middleware Protection**: All API routes are protected by JWT authentication middleware, validating tokens on every request to ensure secure access.
- **AI Summarization Flow**: AI summarization requests are routed through the backend, which handles prompt construction, API calls to Groq, and response formatting before returning results to the client.

## 🗄 Database Schema

StudyBuddy uses SQLite with a relational schema enforcing referential integrity through foreign keys:

**Users Table**
- `id` (Primary Key)
- `name`
- `email` (Unique)
- `password` (Hashed)
- `created_at`

**Courses Table**
- `id` (Primary Key)
- `title`
- `user_id` (Foreign Key → Users.id)
- `created_at`

**Notes Table**
- `id` (Primary Key)
- `title`
- `content`
- `course_id` (Foreign Key → Courses.id)
- `created_at`

**Relationships:**
- One User → Many Courses (1:N)
- One Course → Many Notes (1:N)

**Referential Integrity:**
- Foreign key constraints maintain relational integrity
- `ON DELETE CASCADE` ensures automatic cleanup: deleting a user removes their courses, and deleting a course removes its notes
- Indexes on `user_id` and `course_id` optimize query performance

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

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/me` - Get current user information

### Courses
- `GET /courses` - List all courses
- `POST /courses` - Create a new course
- `GET /courses/:id` - Get a single course
- `PUT /courses/:id` - Update a course
- `DELETE /courses/:id` - Delete a course
- `GET /courses/:id/notes` - Get all notes for a course
- `POST /courses/:id/notes` - Create a note for a course

### Notes
- `GET /notes/:id` - Get a single note
- `PUT /notes/:id` - Update a note
- `DELETE /notes/:id` - Delete a note

### AI
- `POST /ai/notes/:noteId/summarize` - Generate AI summary for a note

## 🌐 REST API Design

StudyBuddy implements nested REST endpoints that reflect the relational hierarchy of the data model.

**Example:** `GET /courses/:id/notes`

This nested structure provides several benefits:

- **Reflects Relational Hierarchy**: The URL structure mirrors the database relationships (courses contain notes), making the API intuitive and self-documenting.
- **Improves Clarity**: Developers can immediately understand that notes belong to courses by examining the endpoint structure.
- **Improves Maintainability**: Resource relationships are explicit in the routing, reducing ambiguity and making the codebase easier to maintain and extend.

## 🔐 Authentication & Middleware

StudyBuddy implements JWT-based authentication for secure, stateless session management.

**Authentication Flow:**
1. User registers or logs in via `/auth/register` or `/auth/login`
2. Backend validates credentials and returns a JWT token
3. Client stores token (localStorage) and includes it in subsequent requests
4. Middleware validates token on every protected route

**JWT Middleware Protection:**
- All course, note, and AI endpoints require valid JWT tokens
- Token validation occurs before route handlers execute
- Middleware extracts user identity from token payload
- Protected routes ensure users can only access their own data

**Why JWT?**
- **Scalability**: Stateless tokens eliminate server-side session storage, enabling horizontal scaling
- **Security**: Tokens are cryptographically signed, preventing tampering
- **Clean Separation**: Authentication logic is centralized in middleware, keeping route handlers focused on business logic

## 🤖 Prompt Library

StudyBuddy uses structured prompts for AI summarization, with three distinct modes optimized for different study needs.

### Quick Mode
**Purpose**: Concise, structured revision notes for fast review

**Characteristics:**
- Clear headings to organize topics
- Preserves key definitions verbatim
- Includes important syntax and code examples
- Uses bullet points for clarity
- Concise but complete coverage
- **Temperature**: 0.3 (low randomness for consistent formatting)
- **Max Tokens**: 500

### Detailed Mode
**Purpose**: In-depth explanations with comprehensive coverage

**Characteristics:**
- Numbered headings (1., 2., 3., etc.)
- Thorough explanations for each concept
- Preserves all examples and code snippets
- Includes syntax blocks with proper formatting
- Maintains academic clarity and precision
- **Temperature**: 0.3
- **Max Tokens**: 1000

### Exam Mode
**Purpose**: Structured exam preparation with standardized format

**Structured Format:**
1. **Definition** - Concise, exam-ready definition
2. **Key Points** - Bulleted list of essential concepts
3. **Important Syntax** - Code/syntax examples
4. **Differences** - Key distinctions or comparison tables
5. **2-Mark Answer** - Concise 2-3 sentence response
6. **5-Mark Answer** - Detailed paragraph with examples
7. **Important Keywords** - Comma-separated list

**Characteristics:**
- Follows exact 7-section structure
- Exam-ready formatting
- Preserves technical accuracy
- **Temperature**: 0.3
- **Max Tokens**: 1200

### Why Temperature = 0.3?

The low temperature setting (0.3) ensures:
- **Deterministic Academic Output**: Consistent, predictable responses suitable for educational content
- **Avoids Creative Randomness**: Minimizes hallucinations and maintains factual accuracy
- **Structured Formatting**: Reliable adherence to specified output formats

**Technical Implementation:**
- Backend uses Groq's OpenAI-compatible endpoint (`https://api.groq.com/openai/v1/chat/completions`)
- Model: Llama 3.3 70B Versatile
- System and user prompts are dynamically constructed based on selected mode
- Responses are streamed back to the frontend with latency metrics

## Project Structure

```
StudyBuddy/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── notes.js
│   │   └── ai.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── server.js
│   ├── db.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CoursePage.jsx
│   │   │   └── NoteEditor.jsx
│   │   ├── components/
│   │   │   ├── AuthNavbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
└── README.md
```

## 📊 Performance & Stress Testing

### Cascade Delete Handling

StudyBuddy implements database-level cascade deletion to maintain referential integrity:

- **Foreign Key Constraints**: `ON DELETE CASCADE` is enabled on all foreign key relationships
- **User Deletion**: Deleting a user automatically removes all associated courses and their notes
- **Course Deletion**: Deleting a course automatically removes all associated notes
- **Implementation**: SQLite's `PRAGMA foreign_keys = ON` ensures cascade behavior is enforced at the database level
- **Performance**: Cascade deletes are atomic operations, ensuring data consistency without application-level cleanup logic

### AI Latency

**Typical Performance:**
- **Average Latency**: 1–2 seconds for standard note content
- **Quick Mode**: ~1–1.5 seconds (500 tokens)
- **Detailed Mode**: ~1.5–2 seconds (1000 tokens)
- **Exam Mode**: ~2–2.5 seconds (1200 tokens)

**Latency Factors:**
- **Prompt Size**: Longer content increases processing time
- **Network Round-Trip**: API call to Groq servers adds network latency
- **Token Generation**: More tokens (Detailed/Exam modes) require longer generation time
- **Model Processing**: Llama 3.3 70B inference time on Groq infrastructure

**Latency Tracking:**
- Backend measures and returns latency metrics (`latency_ms`) with every summarization response
- Frontend displays latency to provide transparency to users

## License

MIT