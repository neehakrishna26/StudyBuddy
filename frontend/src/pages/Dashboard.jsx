import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCourse(e) {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    try {
      setCreating(true);
      const newCourse = await createCourse(newCourseTitle);
      setCourses([...courses, newCourse]);
      setNewCourseTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateCourse(courseId) {
    if (!editTitle.trim()) return;

    try {
      await updateCourse(courseId, editTitle);
      setCourses(courses.map(c => c.id === courseId ? { ...c, title: editTitle } : c));
      setEditingId(null);
      setEditTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteCourse(courseId, courseTitle) {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This will also delete all associated notes.`)) {
      return;
    }

    try {
      await deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(course) {
    setEditingId(course.id);
    setEditTitle(course.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
  }

  if (loading) {
    return <p className="text-slate-400 text-center">Loading courses...</p>;
  }

  return (
    <div className="animate-fadeIn">
      {/* Premium Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          {getGreeting()}{user?.name ? `, ${user.name}` : ''} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
          Stay consistent. Your AI companion is ready.
        </p>
        
        {/* Stat Pills */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{courses.length} Courses</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Notes</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">AI Summaries</span>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-5 py-4 rounded-xl mb-8 transition-colors duration-300">
          {error}
        </div>
      )}
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">Create New Course</h3>
        <form onSubmit={handleCreateCourse} className="flex gap-3">
          <input
            type="text"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="Enter course title..."
            className="flex-1 max-w-md bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 text-gray-900 dark:text-slate-100 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 shadow-sm"
            disabled={creating}
          />
          <button 
            type="submit" 
            disabled={creating || !newCourseTitle.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
          >
            {creating ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 tracking-tight">Your Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-500 dark:text-slate-400 text-lg">No courses yet. Create one to get started!</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-7 shadow-md hover:shadow-xl dark:hover:shadow-blue-500/10 hover:border-gray-300 dark:hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            >
              {editingId === course.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCourse(course.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-slate-300 text-sm px-4 py-2 rounded-xl transition-all border border-gray-200 dark:border-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-500 transition-colors duration-300">
                      Created {new Date(course.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(course);
                      }}
                      className="flex-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-xl transition-all border border-gray-200 dark:border-white/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id, course.title);
                      }}
                      className="flex-1 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium px-4 py-2 rounded-xl transition-all border border-red-200 dark:border-red-800/20"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
