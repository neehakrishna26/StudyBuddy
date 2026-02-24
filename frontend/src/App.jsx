import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 fixed h-screen flex flex-col">
        <div className="p-6 flex-1">
          <h1 className="text-2xl font-bold text-slate-100 mb-8">StudyBuddy</h1>
          
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className={`block px-4 py-2.5 rounded-lg transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard"
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

        {/* User section at bottom */}
        <div className="p-6 border-t border-slate-800">
          <div className="mb-3">
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="text-slate-100 font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-all text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
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