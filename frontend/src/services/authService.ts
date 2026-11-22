import api from './api';
import type { LoginCredentials, RegisterData, TokenResponse, User } from '../types';

const authService = {
  // POST /auth/login — expects OAuth2 form data with 'username' and 'password'
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const params = new URLSearchParams();
    params.append('username', credentials.email.trim());
    params.append('password', credentials.password);

    const response = await api.post<TokenResponse>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // POST /auth/register — registers a new user with default 'user' role
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>('/auth/register', {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    return response.data;
  },

  // GET /auth/me — retrieves current authenticated user profile
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
