import api from './api';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types';

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getUser(): { id: number; name: string; email: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
