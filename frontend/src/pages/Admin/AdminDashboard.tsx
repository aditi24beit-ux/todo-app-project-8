import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import adminService from '../../services/adminService';
import type { AdminStats, User, Task } from '../../types';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [st, users, allTasks] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          adminService.getAllTasks(),
        ]);
        setStats(st);
        setRecentUsers(users.slice(0, 5));
        setRecentTasks(allTasks.slice(0, 5));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load admin dashboard data.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalTasks = stats?.total_tasks ?? 0;
  const completedTasks = stats?.completed_tasks ?? 0;
  const pendingTasks = stats?.pending_tasks ?? 0;
  const totalUsers = stats?.total_users ?? 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AppLayout pageTitle="Admin Dashboard">
      <div className="admin-dash-view">
        <div className="admin-banner">
          <p className="admin-subline">
            Monitor workspace activity and manage your team.
          </p>
        </div>

        {error && <div className="admin-error-banner" role="alert">{error}</div>}

        {/* 4 Metrics Cards matching 06-admin-dashboard-desktop.svg */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="stat-card-title">Registered users</span>
            <span className="stat-card-number">{loading ? '...' : totalUsers}</span>
            <span className="stat-card-trend trend-purple">Active team members</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-title">Total tasks</span>
            <span className="stat-card-number">{loading ? '...' : totalTasks}</span>
            <span className="stat-card-trend trend-slate">Across all users</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-title">Completed tasks</span>
            <span className="stat-card-number">{loading ? '...' : completedTasks}</span>
            <span className="stat-card-trend trend-green">
              {completionRate}% completion rate
            </span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-title">Pending tasks</span>
            <span className="stat-card-number">{loading ? '...' : pendingTasks}</span>
            <span className="stat-card-trend trend-amber">Needs attention</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="admin-content-grid">
          {/* Left Column: Activity Overview + Recent Users */}
          <div className="admin-left-col">
            {/* Task Completion Overview */}
            <div className="admin-panel-card">
              <div className="panel-header">
                <h3>Workspace activity</h3>
                <span className="panel-subtitle">Task completion overview</span>
              </div>

              <div className="completion-stats-row">
                <div className="completion-meta">
                  <div className="meta-item">
                    <span className="indicator-dot dot-green" />
                    <span>Completed ({completedTasks})</span>
                  </div>
                  <div className="meta-item">
                    <span className="indicator-dot dot-amber" />
                    <span>Pending ({pendingTasks})</span>
                  </div>
                </div>
                <span className="completion-rate-text">
                  {completionRate}% done
                </span>
              </div>

              <div className="admin-progress-bar-track">
                <div
                  className="admin-bar-fill-completed"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Recent Users List matching design */}
            <div className="admin-panel-card">
              <div className="panel-header-action">
                <div>
                  <h3>Recent users</h3>
                  <span className="panel-subtitle">Latest accounts in workspace</span>
                </div>
                <Link to="/admin/users" className="panel-link">
                  Manage all →
                </Link>
              </div>

              {loading ? (
                <div className="admin-loading-state">Loading users...</div>
              ) : recentUsers.length === 0 ? (
                <div className="admin-empty-state">No users registered yet.</div>
              ) : (
                <div className="recent-users-list">
                  {recentUsers.map((u) => (
                    <div key={u.id} className="recent-user-row">
                      <div className="user-avatar-tag">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info-text">
                        <span className="user-primary-name">{u.name}</span>
                        <span className="user-primary-email">{u.email}</span>
                      </div>
                      <span className={`role-pill ${u.role === 'admin' ? 'admin' : 'user'}`}>
                        {u.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                      <span className={`status-pill-small ${u.is_active ? 'active' : 'inactive'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Recent Tasks & Quick Actions */}
          <div className="admin-right-col">
            <div className="admin-panel-card">
              <div className="panel-header">
                <h3>Latest tasks</h3>
                <span className="panel-subtitle">Recent team assignments</span>
              </div>

              {loading ? (
                <div className="admin-loading-state">Loading tasks...</div>
              ) : recentTasks.length === 0 ? (
                <div className="admin-empty-state">No tasks created yet.</div>
              ) : (
                <div className="activity-stream">
                  {recentTasks.map((t) => (
                    <div key={t.id} className="activity-item-card">
                      <div className="activity-dot-line">
                        <span className={`activity-circle ${t.status === 'completed' ? 'circle-green' : 'circle-amber'}`} />
                      </div>
                      <div className="activity-text-content">
                        <p className="activity-sentence">
                          <strong>{t.title}</strong>
                        </p>
                        <span className="activity-time">
                          Status: {t.status === 'completed' ? '✓ Completed' : '⏳ Pending'} · Priority: {t.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Admin Actions */}
            <div className="admin-panel-card quick-actions-panel">
              <h3>Quick tools</h3>
              <div className="quick-actions-list">
                <Link to="/admin/users" className="btn-tool-link">
                  👥 Manage Team &amp; Status
                </Link>
                <Link to="/admin/tasks" className="btn-tool-link">
                  📋 View All System Tasks
                </Link>
                <Link to="/admin/statistics" className="btn-tool-link">
                  📈 Workspace Productivity Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
