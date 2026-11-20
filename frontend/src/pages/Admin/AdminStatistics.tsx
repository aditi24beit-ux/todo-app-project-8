import { useEffect, useState } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { demoAdminService } from '../../services/demo/demoAdminService';
import type { AdminStats } from '../../types';
import './AdminStatistics.css';

export default function AdminStatistics() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      const data = await demoAdminService.getStats();
      setStats(data);
    }
    loadStats();
  }, []);

  const total = stats?.totalTasks ?? 846;
  const completed = stats?.completedTasks ?? 612;
  const pending = stats?.pendingTasks ?? 234;
  const rate = stats?.completionRate ?? 72;
  const pendingRate = 100 - rate;

  const daysData = [
    { day: 'Mon', value: 58, label: '58 tasks' },
    { day: 'Tue', value: 84, label: '84 tasks' },
    { day: 'Wed', value: 92, label: '92 tasks' },
    { day: 'Thu', value: 76, label: '76 tasks' },
    { day: 'Fri', value: 110, label: '110 tasks' },
    { day: 'Sat', value: 34, label: '34 tasks' },
    { day: 'Sun', value: 45, label: '45 tasks' },
  ];

  return (
    <AppLayout pageTitle="Task Statistics">
      <div className="admin-stats-view">
        <div className="stats-banner">
          <p className="stats-subline">
            Understand productivity across your workspace.
          </p>
        </div>

        {/* 4 Stat Cards matching 09-admin-statistics-desktop.svg */}
        <div className="stats-top-grid">
          <div className="stat-overview-card">
            <span className="overview-label">Total tasks</span>
            <span className="overview-number">{total}</span>
            <span className="overview-caption text-slate">All time</span>
          </div>

          <div className="stat-overview-card">
            <span className="overview-label">Completed</span>
            <span className="overview-number">{completed}</span>
            <span className="overview-caption text-green">{rate}% completion</span>
          </div>

          <div className="stat-overview-card">
            <span className="overview-label">Pending</span>
            <span className="overview-number">{pending}</span>
            <span className="overview-caption text-amber">{pendingRate}% remaining</span>
          </div>

          <div className="stat-overview-card">
            <span className="overview-label">Active users</span>
            <span className="overview-number">{stats?.activeUsers ?? 103}</span>
            <span className="overview-caption text-purple">
              Of {stats?.registeredUsers ?? 128} registered
            </span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="stats-charts-grid">
          {/* Bar Chart: Tasks completed over time */}
          <div className="chart-card-box">
            <div className="chart-card-header">
              <h3>Tasks completed over time</h3>
              <span className="chart-card-subtitle">Daily completion velocity</span>
            </div>

            <div className="bar-chart-container">
              {daysData.map((d) => (
                <div key={d.day} className="bar-chart-column">
                  <div className="bar-column-track">
                    <div
                      className="bar-column-fill"
                      style={{ height: `${(d.value / 120) * 100}%` }}
                      title={`${d.day}: ${d.label}`}
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
                <span className="ratio-title">{stats?.registeredUsers ?? 128} registered users</span>
                <span className="ratio-sub">
                  {stats?.activeUsers ?? 103} active · {stats?.inactiveUsers ?? 25} inactive
                </span>
              </div>
            </div>

            {/* Top Contributors Leaderboard matching design */}
            <div className="chart-card-box">
              <div className="chart-card-header">
                <h3>Top contributors</h3>
                <span className="chart-card-subtitle">Most completed tasks</span>
              </div>

              <div className="contributors-list">
                <div className="contributor-row">
                  <div className="contributor-rank medal-gold">🥇</div>
                  <div className="contributor-name-col">
                    <span className="contributor-name">Priya Shah</span>
                    <span className="contributor-role">Admin</span>
                  </div>
                  <span className="contributor-score">42 completed</span>
                </div>

                <div className="contributor-row">
                  <div className="contributor-rank medal-silver">🥈</div>
                  <div className="contributor-name-col">
                    <span className="contributor-name">Aarav Mehta</span>
                    <span className="contributor-role">User</span>
                  </div>
                  <span className="contributor-score">38 completed</span>
                </div>

                <div className="contributor-row">
                  <div className="contributor-rank medal-bronze">🥉</div>
                  <div className="contributor-name-col">
                    <span className="contributor-name">Kabir Khan</span>
                    <span className="contributor-role">User</span>
                  </div>
                  <span className="contributor-score">29 completed</span>
                </div>

                <div className="contributor-row">
                  <div className="contributor-rank">4</div>
                  <div className="contributor-name-col">
                    <span className="contributor-name">Rohan Das</span>
                    <span className="contributor-role">User</span>
                  </div>
                  <span className="contributor-score">18 completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
