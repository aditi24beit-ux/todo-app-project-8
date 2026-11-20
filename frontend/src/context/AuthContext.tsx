import { createContext, useContext, useState, type ReactNode } from 'react';
import authService from '../services/authService';
import { demoAuthService } from '../services/demo/demoAuthService';
import { DEMO_CONFIG } from '../config/demoConfig';
import type { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isDemoMode = DEMO_CONFIG.isDemoMode;
  const activeAuthService = isDemoMode ? demoAuthService : authService;

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = activeAuthService.getUser();
    return savedUser && activeAuthService.isAuthenticated() ? (savedUser as User) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await activeAuthService.login(credentials);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail ||
        (err as Error)?.message ||
        'Login failed. Please check your credentials.';
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await activeAuthService.register(data);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data
          ?.detail ||
        (err as Error)?.message ||
        'Registration failed. Please try again.';
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    activeAuthService.logout();
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isDemoMode,
        isLoading,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
