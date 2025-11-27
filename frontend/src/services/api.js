import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT (if any) to outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- AUTH ---
export async function login({ username, password }) {
  const res = await api.post('/auth/login', { username, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);
    localStorage.setItem('name', res.data.name);
    if (res.data.id) {
      localStorage.setItem('userId', res.data.id);
    }
  }
  return res.data;
}

export async function registerUser(payload) {
  const res = await api.post('/auth/register', payload);
  return res.data;
}

export function logout() {
  localStorage.clear();
}

export function getCurrentUser() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const id = localStorage.getItem('userId');
  if (!token) return null;
  return { token, role, name, id };
}

// --- BOOKS ---
export async function getBooks() {
  const res = await api.get('/books');
  return res.data;
}

export async function addBook(book) {
  const res = await api.post('/books', book);
  return res.data;
}

export async function updateBook(id, book) {
  const res = await api.put(`/books/${id}`, book);
  return res.data;
}

export async function deleteBook(id) {
  await api.delete(`/books/${id}`);
}

// --- MEMBERSHIPS ---
export async function getMemberships() {
  const res = await api.get('/memberships');
  return res.data;
}

export async function addMembership(m) {
  const res = await api.post('/memberships', m);
  return res.data;
}

export async function updateMembership(id, m) {
  const res = await api.put(`/memberships/${id}`, m);
  return res.data;
}

export async function deleteMembership(id) {
  await api.delete(`/memberships/${id}`);
}

// --- USERS ---
export async function getUsers() {
  const res = await api.get('/users');
  return res.data;
}

export async function addUser(user) {
  const res = await api.post('/users', user);
  return res.data;
}

export async function updateUser(id, user) {
  const res = await api.put(`/users/${id}`, user);
  return res.data;
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}

// --- TRANSACTIONS ---
export async function getTransactions() {
  const res = await api.get('/transactions');
  return res.data;
}

export async function issueBookTxn(data) {
  const res = await api.post('/transactions/issue', data);
  return res.data;
}

export async function returnBookTxn(data) {
  const res = await api.post('/transactions/return', data);
  return res.data;
}

export async function getReports() {
  const res = await api.get('/transactions/report');
  return res.data;
}

