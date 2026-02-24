const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Auth API functions
export async function register(name, email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return handleResponse(response);
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getCourses() {
  const response = await fetch(`${BASE_URL}/courses`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getCourse(courseId) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function createCourse(title) {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title })
  });
  return handleResponse(response);
}

export async function updateCourse(courseId, title) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title })
  });
  return handleResponse(response);
}

export async function deleteCourse(courseId) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getNotes(courseId) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}/notes`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function createNote(courseId, title) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}/notes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, content: '' })
  });
  return handleResponse(response);
}

export async function getNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function updateNote(noteId, data) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function summarizeNote(noteId, mode) {
  const response = await fetch(`${BASE_URL}/ai/notes/${noteId}/summarize`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ mode })
  });
  return handleResponse(response);
}
