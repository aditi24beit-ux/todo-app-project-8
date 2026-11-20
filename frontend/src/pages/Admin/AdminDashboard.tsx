import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { demoAdminService } from '../../services/demo/demoAdminService';
import type { AdminStats, User, ActivityItem } from '../../types';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [st, users, acts] = await Promise.all([
          demoAdminService.getStats(),
          demoAdminService.getAllUsers(),
          demoAdminService.getActivities(),
        ]);
        setStats(st);
        setRecentUsers(users.slice(0, 5));
        setActivities(acts.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AppLayout pageTitle="Admin Dashboard">
      <div className="admin-dash-view">
        <div className="admin-banner">
          <p className="admin-subline">
            Monitor workspace activity and manage your team.
          </p>
        </div>

        {/* 4 Metrics Cards matching 06-admin-dashboard-desktop.svg */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="stat-card-title">Registered users</span>
            <span className="stat-card-number">{stats?.registeredUsers ?? 128}</span>
            <span className="stat-card-trend trend-purple">↑ 8 this month</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-title">Total tasks</span>
            <span className="stat-card-number">{stats?.totalTasks ?? 846}</span>
            <span className="stat-card-trend trend-slate">Across all users</span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-title">Completed tasks</span>
            <span className="stat-card-number">{stats?.completedTasks ?? 612}</span>
            <span className="stat-card-trend trend-green">
              {stats?.completionRate ?? 72}% completion
            </span>
          </div>

          <div className="admin-stat-card">
            <span className="stat-card-title">Pending tasks</span>
            <span className="stat-card-number">{stats?.pendingTasks ?? 234}</span>
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
                    <span>Completed ({stats?.completedTasks ?? 612})</span>
                  </div>
                  <div className="meta-item">
                    <span className="indicator-dot dot-amber" />
                    <span>Pending ({stats?.pendingTasks ?? 234})</span>
                  </div>
                </div>
                <span className="completion-rate-text">
                  {stats?.completionRate ?? 72}% done
                </span>
              </div>

              <div className="admin-progress-bar-track">
                <div
                  className="admin-bar-fill-completed"
                  style={{ width: `${stats?.completionRate ?? 72}%` }}
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
                      <span className={`status-pill-small ${u.status === 'active' ? 'active' : 'inactive'}`}>
                        {u.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Latest Activity Stream & Quick Actions */}
          <div className="admin-right-col">
            <div className="admin-panel-card">
              <div className="panel-header">
                <h3>Latest activity</h3>
                <span className="panel-subtitle">Real-time workspace actions</span>
              </div>

              <div className="activity-stream">
                {activities.map((act) => (
                  <div key={act.id} className="activity-item-card">
                    <div className="activity-dot-line">
                      <span className="activity-circle" />
                    </div>
                    <div className="activity-text-content">
                      <p className="activity-sentence">
                        <strong>{act.user_name}</strong> {act.action}
                      </p>
                      <span className="activity-time">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Admin Actions */}
            <div className="admin-panel-card quick-actions-panel">
              <h3>Quick tools</h3>
              <div className="quick-actions-list">
                <Link to="/admin/users" className="btn-tool-link">
                  👥 Manage Team &amp; Roles
                </Link>
                <Link to="/admin/tasks" className="btn-tool-link">
                  📋 View All Team Tasks
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
