const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getCourses() {
  const response = await fetch(`${BASE_URL}/courses`);
  return handleResponse(response);
}

export async function getCourse(courseId) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}`);
  return handleResponse(response);
}

export async function createCourse(title) {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, user_id: 1 })
  });
  return handleResponse(response);
}

export async function getNotes(courseId) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}/notes`);
  return handleResponse(response);
}

export async function createNote(courseId, title) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content: '' })
  });
  return handleResponse(response);
}

export async function getNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`);
  return handleResponse(response);
}

export async function updateNote(noteId, data) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
}

export async function summarizeNote(noteId, mode) {
  const response = await fetch(`${BASE_URL}/ai/notes/${noteId}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode })
  });
  return handleResponse(response);
}
