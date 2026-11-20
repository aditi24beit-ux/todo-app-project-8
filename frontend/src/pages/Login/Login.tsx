import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CONFIG } from '../../config/demoConfig';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error, clearError, isLoading, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e?: FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    clearError();

    const targetEmail = customEmail ?? email;
    const targetPassword = customPassword ?? password;

    try {
      await login({ email: targetEmail, password: targetPassword });
      // Redirect based on role in demo mode
      const rawUser = localStorage.getItem('user');
      const userObj = rawUser ? JSON.parse(rawUser) : null;
      if (userObj?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      // Error is set in AuthContext
    }
  };

  const handleQuickLogin = (role: 'user' | 'admin') => {
    const creds = DEMO_CONFIG.accounts[role];
    setEmail(creds.email);
    setPassword(creds.password);
    handleLoginSubmit(undefined, creds.email, creds.password);
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

          {isDemoMode && (
            <div className="demo-notice-banner">
              <span className="demo-badge">DEMO MODE</span>
              <p>
                Simulated frontend environment. Use 1-click access pills below or sign in with your own credentials.
              </p>
            </div>
          )}

          {error && <div className="login-error-alert">{error}</div>}

          <form onSubmit={(e) => handleLoginSubmit(e)} className="login-form-element">
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
              <span className="forgot-password-link">Forgot password?</span>
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

          {/* Quick Access Pills matching Shraddha's 01-login-desktop.svg design */}
          <div className="quick-access-section">
            <div className="quick-access-title">ONE-CLICK DEMO ACCESS:</div>
            <div className="quick-access-buttons">
              <button
                type="button"
                className="btn-access-pill pill-user"
                onClick={() => handleQuickLogin('user')}
                title="Login with user account: user@taskflow.demo"
              >
                USER ACCESS
                <span className="pill-creds">user@taskflow.demo</span>
              </button>

              <button
                type="button"
                className="btn-access-pill pill-admin"
                onClick={() => handleQuickLogin('admin')}
                title="Login with admin account: admin@taskflow.demo"
              >
                ADMIN ACCESS
                <span className="pill-creds">admin@taskflow.demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
