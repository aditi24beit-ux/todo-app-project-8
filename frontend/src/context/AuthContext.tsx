import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService from '../services/authService';
import type { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Validate existing session on application mount via GET /auth/me
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      if (!authService.isAuthenticated()) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const verifiedUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(verifiedUser);
          localStorage.setItem('user', JSON.stringify(verifiedUser));
        }
      } catch {
        // Token is invalid or expired
        if (isMounted) {
          authService.logout();
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } }; message?: string };
      let message = 'Login failed. Please check your credentials.';

      if (!axiosErr.response) {
        message = 'Unable to connect to the backend server at http://127.0.0.1:8000. Please ensure the backend is running.';
      } else if (axiosErr.response.data?.detail) {
        message = axiosErr.response.data.detail;
      } else if (axiosErr.message) {
        message = axiosErr.message;
      }

      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const createdUser = await authService.register(data);
      return createdUser;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } }; message?: string };
      let message = 'Registration failed. Please try again.';

      if (!axiosErr.response) {
        message = 'Unable to connect to the backend server at http://127.0.0.1:8000. Please ensure the backend is running.';
      } else if (axiosErr.response.data?.detail) {
        message = axiosErr.response.data.detail;
      } else if (axiosErr.message) {
        message = axiosErr.message;
      }

      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  const clearError = (): void => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
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
