import { demoStorage, type StoredUser } from './demoStorage';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../../types';

export const demoAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Small realistic delay for UI responsiveness
    await new Promise((res) => setTimeout(res, 180));

    const users = demoStorage.getUsers();
    const cleanEmail = credentials.email.trim().toLowerCase();

    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      throw new Error('Invalid email or password. Use demo credentials or register a new account.');
    }

    if (matched.status === 'inactive') {
      throw new Error('This account is inactive. Please contact your workspace administrator.');
    }

    // In demo mode, accept correct password or allow quick test login if empty
    if (credentials.password && credentials.password !== matched.password_hash) {
      // Allow user123/admin123 or check match
      if (
        (matched.email === 'user@taskflow.demo' && credentials.password !== 'user123') ||
        (matched.email === 'admin@taskflow.demo' && credentials.password !== 'admin123')
      ) {
        throw new Error('Incorrect password. For demo: user123 or admin123');
      }
    }

    const user: User = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: matched.role || 'user',
      status: matched.status || 'active',
      created_at: matched.created_at,
    };

    const token = `demo-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    demoStorage.addActivity(user.name, 'signed in to workspace');

    return {
      access_token: token,
      token_type: 'bearer',
      user,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 200));

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();

    if (!cleanName) {
      throw new Error('Full name is required.');
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('A valid email address is required.');
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const users = demoStorage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists.');
    }

    // STRICT REQUIREMENT: Public registration only creates 'user' accounts, never 'admin'
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const nowIso = new Date().toISOString();

    const newUser: StoredUser = {
      id: newId,
      name: cleanName,
      email: cleanEmail,
      password_hash: data.password,
      role: 'user', // strictly 'user'
      status: 'active',
      created_at: nowIso,
    };

    demoStorage.saveUsers([...users, newUser]);

    const userObj: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: 'user',
      status: 'active',
      created_at: nowIso,
    };

    // Auto-login after registration
    const token = `demo-jwt-token-${userObj.id}-${Date.now()}`;
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userObj));

    demoStorage.addActivity(userObj.name, 'registered a new demo user account');

    return {
      access_token: token,
      token_type: 'bearer',
      user: userObj,
    };
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
