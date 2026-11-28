
import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="app-container">
      {mobileMenuOpen && (
        <div className="mobile-backdrop" onClick={closeMobileMenu} />
      )}

      <aside className={`app-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo-box">
            <span>✓</span>
          </div>
          <span className="brand-title">TaskFlow</span>
        </div>

        <div className="nav-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {isAdmin ? (
            <>
              <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="nav-icon">📊</span>
                <span>Overview</span>
              </NavLink>
              <NavLink to="/admin/tasks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="nav-icon">📋</span>
                <span>All Tasks</span>
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="nav-icon">👥</span>
                <span>Manage Users</span>
              </NavLink>
              <NavLink to="/admin/statistics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="nav-icon">📈</span>
                <span>Statistics</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="nav-icon">🏠</span>
                <span>Overview</span>
              </NavLink>
              <NavLink to="/tasks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="nav-icon">✓</span>
                <span>My Tasks</span>
              </NavLink>
              <NavLink to="/add-task" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="nav-icon">+</span>
                <span>Add Task</span>
              </NavLink>
              <NavLink to="/insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="nav-icon">🤖</span>
                <span>AI Insights</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-user-card">
          <div className="user-avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-text-info">
            <span className="user-display-name">{user?.name || 'User'}</span>
            <span className={`user-role-badge ${isAdmin ? 'admin-badge' : 'user-badge'}`}>
              {isAdmin ? 'Admin' : 'User'}
            </span>
          </div>
          <button type="button" className="btn-sidebar-logout" onClick={handleLogout} title="Log out" aria-label="Log out">
            ↪
          </button>
        </div>
      </aside>

      <div className="app-main-layout">
        <header className="app-topbar">
          <div className="topbar-left">
            <button type="button" className="btn-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Navigation">
              ☰
            </button>
            <h1 className="topbar-title">{pageTitle}</h1>
          </div>

          <div className="topbar-right">
            <div className="notification-wrapper">
              <button type="button" className="btn-topbar-icon" onClick={() => setNotificationOpen(!notificationOpen)} aria-label="Notifications">
                🔔
                <span className="notification-dot" />
              </button>

              {notificationOpen && (
                <div className="notification-popover">
                  <div className="notification-header">Notifications</div>
                  <div className="notification-item">
                    <strong>Workspace active:</strong> Connected to FastAPI backend.
                  </div>
                  <div className="notification-item">
                    <strong>Role:</strong> Authenticated as {isAdmin ? 'System Administrator' : 'Standard User'}.
                  </div>
                </div>
              )}
            </div>

            <div className="topbar-profile">
              <span className="profile-name">{user?.name || 'User'}</span>
              <div className="profile-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="app-content-body" key={location.pathname}>
          {children}
        </main>
      </div>
    </div>
  );
}
