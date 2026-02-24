import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] relative overflow-hidden transition-colors duration-300">
      {/* Radial gradient backgrounds */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/30 backdrop-blur-xl transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-gray-900 dark:text-white">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">StudyBuddy</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-5 py-2.5 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-7 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-slate-100 mb-8 leading-tight transition-colors duration-300">
              Your AI-Powered
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">
                Study Companion
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              Organize courses, take smart notes, and get AI-powered summaries to supercharge your learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-10 py-4 rounded-xl transition-all duration-300 text-lg shadow-xl shadow-blue-500/30"
              >
                Start Studying
              </Link>
              <Link
                to="/login"
                className="bg-white/5 hover:bg-white/10 text-slate-100 font-medium px-10 py-4 rounded-xl transition-all duration-200 text-lg border border-white/10 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-10 hover:border-blue-500/30 transition-all duration-300 shadow-lg dark:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-300">Course Management</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                Organize all your courses in one place. Create, edit, and manage your study materials effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-10 hover:border-blue-500/30 transition-all duration-300 shadow-lg dark:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-300">Smart Notes</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                Take rich, formatted notes with our intuitive editor. Keep everything organized by course and topic.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-10 hover:border-blue-500/30 transition-all duration-300 shadow-lg dark:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-300">AI Summaries</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                Get instant AI-powered summaries of your notes. Study smarter with key insights at your fingertips.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-white/5 mt-32 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <p className="text-center text-gray-500 dark:text-slate-500 text-sm transition-colors duration-300">
              © 2024 StudyBuddy. Your AI-powered study companion.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
