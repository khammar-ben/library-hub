export type UserRole = 'ADMIN' | 'RESPONSABLE' | 'CLIENT';

export type EmpruntStatus = 'EN_COURS' | 'RETOURNE' | 'EN_RETARD';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  quantity: number;
  category: Category;
}

export interface Emprunt {
  id: string;
  borrower: User;
  book: Book;
  borrowDate: string;
  returnDate: string | null;
  status: EmpruntStatus;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
