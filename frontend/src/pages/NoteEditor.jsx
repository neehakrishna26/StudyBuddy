import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNote, updateNote, summarizeNote } from '../services/api';
import ReactMarkdown from 'react-markdown';

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
    <div className="animate-fadeIn">
      <Link 
        to="/dashboard" 
        className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-300 text-sm mb-8 inline-flex items-center gap-2 transition-colors"
      >
        <span>←</span> Back to Dashboard
      </Link>

      <div className="mb-10 mt-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-3 transition-colors duration-300">Edit Note</h2>
        <p className="text-gray-600 dark:text-slate-400 text-lg transition-colors duration-300">Edit your note and generate AI summaries</p>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 px-5 py-4 rounded-xl mb-8 transition-colors duration-300">
          {error}
        </div>
      )}

      {/* Editor Section */}
      <div className="bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-white/5 rounded-2xl p-8 mb-8 shadow-lg dark:shadow-xl transition-colors duration-300">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-slate-100 text-xl font-semibold rounded-xl px-5 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your notes..."
          className="w-full min-h-[320px] bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-slate-100 rounded-xl px-5 py-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />

        <div className="flex items-center gap-4 mt-5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
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

      {/* Summary Section with Glow */}
      <div className="relative">
        {/* Subtle blue glow behind AI section */}
        <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-2xl" />
        
        <div className="relative bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-white/5 rounded-2xl p-8 shadow-lg dark:shadow-xl transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 transition-colors duration-300">
              AI Summary
            </h3>
          </div>

          <div className="flex gap-4 mb-8">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-slate-100 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            >
              <option value="Quick">Quick</option>
              <option value="Detailed">Detailed</option>
              <option value="Exam">Exam</option>
            </select>

            <button
              onClick={handleSummarize}
              disabled={summarizing || !content.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {summarizing ? 'Summarizing...' : 'Summarize'}
            </button>

            {latency && (
              <span className="bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-white/5 text-gray-700 dark:text-slate-300 text-sm font-medium px-5 py-3 rounded-xl transition-colors duration-300">
                {latency}ms
              </span>
            )}
          </div>

          {summarizing && (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-gray-300 dark:border-slate-700/50 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-slate-400 mt-5 text-lg transition-colors duration-300">Generating summary...</p>
            </div>
          )}

          {summary && !summarizing && (
            <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 rounded-xl p-8 shadow-inner transition-colors duration-300">
              <div className="prose dark:prose-invert prose-slate max-w-none prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-p:text-gray-800 dark:prose-p:text-slate-200 prose-strong:text-gray-900 dark:prose-strong:text-slate-100 prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-50 dark:prose-code:bg-slate-900/60 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-100 dark:prose-pre:bg-slate-950/60 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-white/5 prose-li:text-gray-800 dark:prose-li:text-slate-200 prose-ul:text-gray-800 dark:prose-ul:text-slate-200 prose-ol:text-gray-800 dark:prose-ol:text-slate-200">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
          )}

          {!summary && !summarizing && (
            <p className="text-gray-600 dark:text-slate-400 italic text-center py-8 transition-colors duration-300">
              No summary yet. Add content and click Summarize to generate an AI summary.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
