import axios from 'axios';
import type { Book, Category, User, Emprunt, AuthResponse, LoginCredentials } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
};

// Books API
export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    const response = await api.get<Book[]>('/books');
    return response.data;
  },
  getById: async (id: string): Promise<Book> => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },
  create: async (book: Omit<Book, 'id'>): Promise<Book> => {
    const response = await api.post<Book>('/books', book);
    return response.data;
  },
  update: async (id: string, book: Partial<Book>): Promise<Book> => {
    const response = await api.put<Book>(`/books/${id}`, book);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  },
  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, category);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

// Emprunts API
export const empruntsApi = {
  getAll: async (): Promise<Emprunt[]> => {
    const response = await api.get<Emprunt[]>('/emprunts');
    return response.data;
  },
  getMyEmprunts: async (): Promise<Emprunt[]> => {
    const response = await api.get<Emprunt[]>('/emprunts/my');
    return response.data;
  },
  create: async (bookId: string): Promise<Emprunt> => {
    const response = await api.post<Emprunt>('/emprunts', { bookId });
    return response.data;
  },
  validate: async (id: string): Promise<Emprunt> => {
    const response = await api.put<Emprunt>(`/emprunts/${id}/validate`);
    return response.data;
  },
  close: async (id: string): Promise<Emprunt> => {
    const response = await api.put<Emprunt>(`/emprunts/${id}/close`);
    return response.data;
  },
};

export default api;
