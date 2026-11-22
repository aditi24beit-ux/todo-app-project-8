import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'user';
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f8f7fc',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: '3px solid #ede8f5',
            borderTopColor: '#6d28d9',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole === 'admin' && user?.role !== 'admin') {
    // Non-admin trying to access admin section
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
