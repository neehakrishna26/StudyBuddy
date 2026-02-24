import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, getNotes, createNote } from '../services/api';

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

  if (loading) {
    return <p className="text-slate-400 text-center">Loading notes...</p>;
  }

  return (
    <div>
      <Link 
        to="/" 
        className="text-slate-400 hover:text-slate-300 text-sm mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <span>←</span> Back to Dashboard
      </Link>

      <div className="mb-8 mt-6">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">{courseName}</h2>
        <p className="text-slate-400">Manage your course notes</p>
      </div>
      
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6">
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
            className="flex-1 max-w-md bg-slate-900 border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={creating}
          />
          <button 
            type="submit" 
            disabled={creating || !newNoteTitle.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create Note'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400 text-lg">No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                {note.title}
              </h3>
              <p className="text-sm text-slate-400">
                Created {new Date(note.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
