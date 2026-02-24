import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import NoteEditor from './pages/NoteEditor';

function AppContent() {
  const location = useLocation();
  const { logout, user } = useAuth();

  // Public pages without sidebar
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // Protected pages with sidebar
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Subtle background glow orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 fixed h-screen flex flex-col z-10 transition-colors duration-300">
        <div className="p-6 flex-1">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">StudyBuddy</h1>
            
            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>
          
          <nav className="space-y-1.5">
            <Link
              to="/dashboard"
              className={`block px-4 py-3 rounded-xl transition-all duration-300 relative ${
                location.pathname === '/dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </span>
            </Link>
            <Link
              to="/dashboard"
              className={`block px-4 py-3 rounded-xl transition-all duration-300 relative ${
                location.pathname.startsWith('/courses')
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Courses
              </span>
            </Link>
          </nav>
        </div>

        {/* User section at bottom */}
        <div className="p-6 border-t border-gray-200 dark:border-white/5">
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide font-medium">Signed in as</p>
            <p className="text-gray-900 dark:text-slate-100 font-medium truncate mt-1">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-slate-300 px-4 py-2.5 rounded-xl transition-all text-sm border border-gray-200 dark:border-white/5 font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 relative z-10">
        <div className="max-w-6xl mx-auto p-10">
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId" element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            } />
            <Route path="/notes/:noteId" element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;