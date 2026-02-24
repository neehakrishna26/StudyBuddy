import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNote, updateNote, summarizeNote } from '../services/api';

export default function NoteEditor() {
  const { noteId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('Quick');
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  async function loadNote() {
    try {
      setLoading(true);
      const note = await getNote(noteId);
      setTitle(note.title);
      setContent(note.content || '');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaved(false);
      await updateNote(noteId, { title, content });
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSummarize() {
    try {
      setSummarizing(true);
      setSummary(null);
      setLatency(null);
      const result = await summarizeNote(noteId, mode);
      setSummary(result.summary);
      setLatency(result.latency_ms);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSummarizing(false);
    }
  }

  if (loading) {
    return <p className="text-slate-400 text-center">Loading note...</p>;
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
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Edit Note</h2>
        <p className="text-slate-400">Edit your note and generate AI summaries</p>
      </div>
      
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Editor Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-lg font-semibold rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your notes..."
          className="w-full min-h-[300px] bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          {saved && (
            <span className="text-green-400 font-medium">
              Saved ✓
            </span>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-6">
          AI Summary
        </h3>

        <div className="flex gap-3 mb-6">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Quick">Quick</option>
            <option value="Detailed">Detailed</option>
            <option value="Exam">Exam</option>
          </select>

          <button
            onClick={handleSummarize}
            disabled={summarizing || !content.trim()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {summarizing ? 'Summarizing...' : 'Summarize'}
          </button>

          {latency && (
            <span className="bg-slate-800 text-slate-300 text-sm font-medium px-4 py-2.5 rounded-lg">
              {latency}ms
            </span>
          )}
        </div>

        {summarizing && (
          <div className="text-center py-8">
            <div className="inline-block w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 mt-4">Generating summary...</p>
          </div>
        )}

        {summary && !summarizing && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200 whitespace-pre-wrap">
            {summary}
          </div>
        )}

        {!summary && !summarizing && (
          <p className="text-slate-400 italic">
            No summary yet. Add content and click Summarize to generate an AI summary.
          </p>
        )}
      </div>
    </div>
  );
}
