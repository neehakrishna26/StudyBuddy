import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h2>
        <p className="text-slate-400">Manage your courses and notes</p>
      </div>
      
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <form onSubmit={handleCreateCourse} className="flex gap-3">
          <input
            type="text"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="Enter course title..."
            className="flex-1 max-w-md bg-slate-900 border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={creating}
          />
          <button 
            type="submit" 
            disabled={creating || !newCourseTitle.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400 text-lg">No courses yet. Create one to get started!</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition-all duration-200"
            >
              {editingId === course.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCourse(course.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded-lg transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="cursor-pointer mb-3"
                  >
                    <h3 className="text-xl font-semibold text-slate-100 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Created {new Date(course.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(course);
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id, course.title);
                      }}
                      className="flex-1 bg-red-900/20 hover:bg-red-900/30 text-red-400 text-sm px-3 py-1.5 rounded-lg transition-all"
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
  );
}
