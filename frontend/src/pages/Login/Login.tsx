import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState(() => localStorage.getItem('taskflow_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem('taskflow_remembered_email')));
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = (location.state as { registered?: boolean; message?: string } | null)?.message ||
    ((location.state as { registered?: boolean } | null)?.registered
      ? 'Registration successful! Please sign in with your credentials.'
      : null);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email: email.trim(), password });

      if (rememberMe) {
        localStorage.setItem('taskflow_remembered_email', email.trim());
      } else {
        localStorage.removeItem('taskflow_remembered_email');
      }

      const currentUser = authService.getUser();
      if (currentUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      // Error is set in AuthContext and rendered in the alert
    }
  };

  return (
    <div className="login-screen">
      {/* Left Brand Panel */}
      <div className="login-hero-panel">
        <div className="login-brand-top">
          <span className="brand-logo-symbol">✓</span>
          <span className="brand-logo-text">TaskFlow</span>
        </div>

        <div className="login-hero-text">
          <h1 className="hero-headline">
            Make every day
            <br />
            count.
          </h1>
          <p className="hero-subline">
            Plan smarter. Stay focused. Get things done.
          </p>
        </div>

        <div className="login-hero-footer">
          <span>Version 1.0 • Task Management</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p className="login-card-subtitle">
              Sign in to continue to your workspace
            </p>
          </div>

          {successMessage && (
            <div className="login-success-alert" role="status">
              ✓ {successMessage}
            </div>
          )}

          {error && (
            <div className="login-error-alert" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="login-form-element">
            <div className="form-field-block">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-field-block">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="login-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <span className="forgot-password-link" title="Contact administrator for password recovery">
                Forgot password?
              </span>
            </div>

            <button type="submit" className="btn-signin-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="divider-or-row">
            <span className="divider-line" />
            <span className="divider-text">OR</span>
            <span className="divider-line" />
          </div>

          <div className="register-prompt-row">
            <span>Don't have an account?</span>{' '}
            <Link to="/register" className="create-account-link">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
