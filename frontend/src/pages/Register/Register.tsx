import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      // Backend POST /auth/register creates user and returns UserResponse (no token)
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Redirect user to login page with pleasant confirmation message
      navigate('/login', {
        state: {
          registered: true,
          message: 'Account created successfully! Please sign in with your email and password.',
        },
      });
    } catch {
      // Error handled in AuthContext and displayed below
    }
  };

  const displayError = localError || error;

  return (
    <div className="register-screen">
      {/* Left Brand Panel */}
      <div className="register-hero-panel">
        <div className="register-brand-top">
          <span className="brand-logo-symbol">✓</span>
          <span className="brand-logo-text">TaskFlow</span>
        </div>

        <div className="register-hero-text">
          <h1 className="hero-headline">
            A calmer way
            <br />
            to get things done.
          </h1>
          <p className="hero-subline">
            Create your account and turn plans into progress.
          </p>
        </div>

        <div className="register-hero-footer">
          <span>TaskFlow Workspace Edition</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="register-form-panel">
        <div className="register-card">
          <div className="register-card-header">
            <h2>Create your account</h2>
            <p className="register-card-subtitle">
              Start organizing your day in minutes.
            </p>
          </div>

          {displayError && (
            <div className="register-error-alert" role="alert">
              {displayError}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="register-form-element">
            <div className="form-field-block">
              <label htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-field-block">
              <label htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-field-block">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-field-block">
              <label htmlFor="reg-confirm">Confirm password</label>
              <input
                id="reg-confirm"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Account Type Box matching 02-registration-desktop.svg */}
            <div className="form-field-block">
              <label>Account type</label>
              <div className="account-type-box">
                <div className="radio-user-indicator">
                  <span className="radio-dot">◉</span>
                  <span className="radio-text">User account</span>
                </div>
              </div>
              <span className="admin-provision-note">
                Admin access is provisioned securely through backend administrative policy.
              </span>
            </div>

            <button type="submit" className="btn-register-primary" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="signin-prompt-row">
            <span>Already have an account?</span>{' '}
            <Link to="/login" className="signin-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
