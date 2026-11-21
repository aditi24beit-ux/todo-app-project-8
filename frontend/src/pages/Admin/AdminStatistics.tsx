import { useEffect, useState, useMemo } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import adminService from '../../services/adminService';
import type { AdminStats, User, Task } from '../../types';
import './AdminStatistics.css';

interface Contributor {
  id: number;
  name: string;
  role: string;
  completedCount: number;
}

export default function AdminStatistics() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const [st, uList, tList] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          adminService.getAllTasks(),
        ]);
        setStats(st);
        setUsers(uList);
        setTasks(tList);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load statistics.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const total = stats?.total_tasks ?? tasks.length;
  const completed = stats?.completed_tasks ?? tasks.filter((t) => t.status === 'completed').length;
  const pending = stats?.pending_tasks ?? tasks.filter((t) => t.status === 'pending').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingRate = 100 - rate;

  const activeUsersCount = users.filter((u) => u.is_active).length;
  const inactiveUsersCount = users.length - activeUsersCount;

  // Real leaderboard calculated from actual tasks
  const topContributors: Contributor[] = useMemo(() => {
    return users
      .map((u) => {
        const count = tasks.filter((t) => t.user_id === u.id && t.status === 'completed').length;
        return {
          id: u.id,
          name: u.name,
          role: u.role === 'admin' ? 'Admin' : 'User',
          completedCount: count,
        };
      })
      .sort((a, b) => b.completedCount - a.completedCount)
      .slice(0, 5);
  }, [users, tasks]);

  // Daily distribution calculated from tasks
  const daysData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    tasks.forEach((t) => {
      if (t.created_at) {
        const d = new Date(t.created_at).getDay(); // 0 is Sunday
        const mappedIdx = d === 0 ? 6 : d - 1; // 0=Mon ... 6=Sun
        counts[mappedIdx] += 1;
      }
    });

    const maxCount = Math.max(...counts, 1);
    return days.map((day, idx) => ({
      day,
      value: counts[idx],
      heightPct: Math.round((counts[idx] / maxCount) * 100),
    }));
  }, [tasks]);

  return (
    <AppLayout pageTitle="Task Statistics">
      <div className="admin-stats-view">
        <div className="stats-banner">
          <p className="stats-subline">
            Understand productivity across your workspace.
          </p>
        </div>

        {error && <div className="stats-error-alert" role="alert">{error}</div>}

        {/* 4 Stat Cards matching 09-admin-statistics-desktop.svg */}
        <div className="stats-top-grid">
          <div className="stat-overview-card">
            <span className="overview-label">Total tasks</span>
            <span className="overview-number">{loading ? '...' : total}</span>
            <span className="overview-caption text-slate">Workspace aggregate</span>
          </div>

          <div className="stat-overview-card">
            <span className="overview-label">Completed</span>
            <span className="overview-number">{loading ? '...' : completed}</span>
            <span className="overview-caption text-green">{rate}% completion</span>
          </div>

          <div className="stat-overview-card">
            <span className="overview-label">Pending</span>
            <span className="overview-number">{loading ? '...' : pending}</span>
            <span className="overview-caption text-amber">{pendingRate}% remaining</span>
          </div>

          <div className="stat-overview-card">
            <span className="overview-label">Active users</span>
            <span className="overview-number">{loading ? '...' : activeUsersCount}</span>
            <span className="overview-caption text-purple">
              Of {users.length} registered
            </span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="stats-charts-grid">
          {/* Bar Chart: Tasks completed over time */}
          <div className="chart-card-box">
            <div className="chart-card-header">
              <h3>Task Creation Velocity</h3>
              <span className="chart-card-subtitle">Activity distribution across days</span>
            </div>

            <div className="bar-chart-container">
              {daysData.map((d) => (
                <div key={d.day} className="bar-chart-column">
                  <div className="bar-column-track">
                    <div
                      className="bar-column-fill"
                      style={{ height: `${Math.max(d.heightPct, 8)}%` }}
                      title={`${d.day}: ${d.value} tasks`}
                    />
                  </div>
                  <span className="bar-day-label">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown & Team Breakdown */}
          <div className="stats-side-column">
            {/* Task Status Breakdown */}
            <div className="chart-card-box">
              <div className="chart-card-header">
                <h3>Task status breakdown</h3>
              </div>

              <div className="breakdown-bars">
                <div className="breakdown-item">
                  <div className="breakdown-label-row">
                    <span>Completed</span>
                    <strong>{rate}%</strong>
                  </div>
                  <div className="breakdown-track">
                    <div
                      className="breakdown-fill fill-green"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-label-row">
                    <span>Pending</span>
                    <strong>{pendingRate}%</strong>
                  </div>
                  <div className="breakdown-track">
                    <div
                      className="breakdown-fill fill-amber"
                      style={{ width: `${pendingRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="workspace-user-ratio">
                <span className="ratio-title">{users.length} registered users</span>
                <span className="ratio-sub">
                  {activeUsersCount} active · {inactiveUsersCount} inactive
                </span>
              </div>
            </div>

            {/* Top Contributors Leaderboard matching design */}
            <div className="chart-card-box">
              <div className="chart-card-header">
                <h3>Top contributors</h3>
                <span className="chart-card-subtitle">Most completed tasks</span>
              </div>

              {topContributors.length === 0 ? (
                <p className="no-contributors-note">No completed tasks yet.</p>
              ) : (
                <div className="contributors-list">
                  {topContributors.map((c, idx) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const medalClass = ['medal-gold', 'medal-silver', 'medal-bronze'];
                    return (
                      <div key={c.id} className="contributor-row">
                        <div className={`contributor-rank ${idx < 3 ? medalClass[idx] : ''}`}>
                          {idx < 3 ? medals[idx] : idx + 1}
                        </div>
                        <div className="contributor-name-col">
                          <span className="contributor-name">{c.name}</span>
                          <span className="contributor-role">{c.role}</span>
                        </div>
                        <span className="contributor-score">{c.completedCount} completed</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
