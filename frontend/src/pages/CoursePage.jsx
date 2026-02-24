import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, getNotes, createNote, deleteNote } from '../services/api';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [courseName, setCourseName] = useState('Course');

  useEffect(() => {
    loadCourseAndNotes();
  }, [courseId]);

  async function loadCourseAndNotes() {
    try {
      setLoading(true);
      const [course, notesData] = await Promise.all([
        getCourse(courseId),
        getNotes(courseId)
      ]);
      setCourseName(course.title);
      setNotes(notesData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateNote(e) {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    try {
      setCreating(true);
      const newNote = await createNote(courseId, newNoteTitle);
      setNotes([...notes, newNote]);
      setNewNoteTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteNote(noteId, noteTitle) {
    if (!window.confirm(`Are you sure you want to delete "${noteTitle}"?`)) {
      return;
    }

    try {
      await deleteNote(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p className="text-slate-400 text-center">Loading notes...</p>;
  }

  return (
    <div className="animate-fadeIn">
      <Link 
        to="/dashboard" 
        className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-300 text-sm mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <span>←</span> Back to Dashboard
      </Link>

      {/* Breadcrumb Navigation */}
      <div className="mb-4 mt-6">
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Link 
            to="/dashboard" 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Dashboard
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800 dark:text-gray-200">{courseName}</span>
        </nav>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors duration-300">{courseName}</h2>
        <p className="text-gray-600 dark:text-slate-400 transition-colors duration-300">Manage your course notes</p>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6 transition-colors duration-300">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <form onSubmit={handleCreateNote} className="flex gap-3">
          <input
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Enter note title..."
            className="flex-1 max-w-md bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
            disabled={creating}
          />
          <button 
            type="submit" 
            disabled={creating || !newNoteTitle.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
          >
            {creating ? 'Creating...' : 'Create Note'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-slate-400 text-lg transition-colors duration-300">No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-white/5 rounded-xl p-6 shadow-lg dark:shadow-xl hover:shadow-xl dark:hover:shadow-blue-500/10 hover:border-gray-300 dark:hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2 transition-colors duration-300">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300">
                  Created {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id, note.title);
                  }}
                  className="w-full bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 text-sm px-3 py-1.5 rounded-lg transition-all border border-red-200 dark:border-red-800/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
