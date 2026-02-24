import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import NoteEditor from './pages/NoteEditor';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 fixed h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-100 mb-8">StudyBuddy</h1>
          
          <nav className="space-y-2">
            <Link
              to="/"
              className={`block px-4 py-2.5 rounded-lg transition-all ${
                location.pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/"
              className={`block px-4 py-2.5 rounded-lg transition-all ${
                location.pathname.startsWith('/courses')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              Courses
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="max-w-6xl mx-auto p-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route path="/notes/:noteId" element={<NoteEditor />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;