import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const { user, logout, isDemoMode, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickSwitchRole = async () => {
    // Demo mode feature: switch easily between user and admin
    if (isAdmin) {
      await login({ email: 'user@taskflow.demo', password: 'user123' });
      navigate('/dashboard');
    } else {
      await login({ email: 'admin@taskflow.demo', password: 'admin123' });
      navigate('/admin');
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="mobile-backdrop" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo-box">
            <span>✓</span>
          </div>
          <span className="brand-title">TaskFlow</span>
        </div>

        {/* Workspace Section */}
        <div className="nav-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {isAdmin ? (
            <>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">📊</span>
                <span>Overview</span>
              </NavLink>
              <NavLink
                to="/admin/tasks"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">📋</span>
                <span>All Tasks</span>
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">👥</span>
                <span>Manage Users</span>
              </NavLink>
              <NavLink
                to="/admin/statistics"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">📈</span>
                <span>Statistics</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">🏠</span>
                <span>Overview</span>
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">✓</span>
                <span>My Tasks</span>
              </NavLink>
              <NavLink
                to="/add-task"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">+</span>
                <span>Add Task</span>
              </NavLink>
            </>
          )}

          {/* User / Admin View Switcher for Demo Mode */}
          {isDemoMode && (
            <div className="demo-switch-box">
              <span className="demo-switch-label">Role Mode</span>
              <button
                type="button"
                className="btn-switch-role"
                onClick={handleQuickSwitchRole}
                title="Switch demo account"
              >
                Switch to {isAdmin ? 'User View' : 'Admin View'}
              </button>
            </div>
          )}

          <div className="sidebar-divider" />

          <div className="nav-static-item">
            <span className="nav-icon">💬</span>
            <span>Help &amp; support</span>
          </div>
          <div className="nav-static-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </div>
        </nav>

        {/* Sidebar Footer */}
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
          <button
            type="button"
            className="btn-sidebar-logout"
            onClick={handleLogout}
            title="Log out"
          >
            ↪
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-layout">
        {/* Top Navigation Bar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="btn-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              ☰
            </button>
            <h1 className="topbar-title">{pageTitle}</h1>
          </div>

          <div className="topbar-right">
            {isDemoMode && (
              <span className="demo-mode-pill">
                ⚡ DEMO MODE
              </span>
            )}

            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button
                type="button"
                className="btn-topbar-icon"
                onClick={() => setNotificationOpen(!notificationOpen)}
                aria-label="Notifications"
              >
                🔔
                <span className="notification-dot" />
              </button>

              {notificationOpen && (
                <div className="notification-popover">
                  <div className="notification-header">Notifications</div>
                  <div className="notification-item">
                    <strong>Demo Mode Active:</strong> All changes persist in your browser.
                  </div>
                  <div className="notification-item">
                    <strong>Backend status:</strong> Running frontend independently until FastAPI is connected.
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="topbar-profile">
              <span className="profile-name">{user?.name || 'User'}</span>
              <div className="profile-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="app-content-body" key={location.pathname}>
          {children}
        </main>
      </div>
    </div>
  );
}
