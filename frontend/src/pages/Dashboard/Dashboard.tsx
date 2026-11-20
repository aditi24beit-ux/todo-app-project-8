import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import AppLayout from '../../components/Layout/AppLayout';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, fetchTasks, updateTask, isLoading } = useTasks();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status !== 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, rate };
  }, [tasks]);

  const displayedTasks = useMemo(() => {
    if (activeTab === 'pending') {
      return tasks.filter((t) => t.status !== 'completed');
    }
    if (activeTab === 'completed') {
      return tasks.filter((t) => t.status === 'completed');
    }
    return tasks;
  }, [tasks, activeTab]);

  const handleToggleTaskStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(id, { status: nextStatus });
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <AppLayout pageTitle="User Dashboard">
      <div className="user-dashboard-view">
        {/* Welcome Greeting Banner */}
        <div className="welcome-banner">
          <p className="welcome-text">
            Good morning, {firstName} 👋 Here’s your day at a glance.
          </p>
        </div>

        {/* 4 Stat Cards matching 03-user-dashboard-desktop.svg */}
        <div className="dash-metrics-grid">
          <div className="dash-metric-card">
            <span className="metric-label">Total tasks</span>
            <span className="metric-value">{stats.total}</span>
            <span className="metric-subtext trend-purple">↑ 12% this week</span>
          </div>

          <div className="dash-metric-card">
            <span className="metric-label">Completed</span>
            <span className="metric-value">{stats.completed}</span>
            <span className="metric-subtext status-green">Great progress</span>
          </div>

          <div className="dash-metric-card">
            <span className="metric-label">Pending</span>
            <span className="metric-value">{stats.pending}</span>
            <span className="metric-subtext status-amber">Keep it moving</span>
          </div>

          <div className="dash-metric-card">
            <span className="metric-label">Completion rate</span>
            <span className="metric-value">{stats.rate}%</span>
            <span className="metric-subtext status-purple">You’re on track</span>
          </div>
        </div>

        {/* Main Grid: Today's Tasks + Quick Tip */}
        <div className="dash-content-columns">
          {/* Today's Tasks Card */}
          <div className="dash-card tasks-card">
            <div className="tasks-card-header">
              <div className="tasks-title-block">
                <h3>Today’s tasks</h3>
                <span className="tasks-count-badge">
                  {stats.pending} remaining
                </span>
              </div>
              <Link to="/add-task" className="btn-add-dash-task">
                + Add new task
              </Link>
            </div>

            {/* Filter Tabs matching design */}
            <div className="dash-filter-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending ({stats.pending})
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({stats.completed})
              </button>
            </div>

            {/* Task Items */}
            {isLoading ? (
              <div className="dash-loading-box">
                <div className="dash-spinner" />
                <span>Loading your workspace...</span>
              </div>
            ) : displayedTasks.length === 0 ? (
              <div className="dash-empty-box">
                <p>No tasks in this view.</p>
                <Link to="/add-task" className="btn-empty-add">
                  Create a task
                </Link>
              </div>
            ) : (
              <div className="dash-task-items-list">
                {displayedTasks.slice(0, 7).map((t) => {
                  const isDone = t.status === 'completed';
                  return (
                    <div key={t.id} className={`dash-task-row ${isDone ? 'done' : ''}`}>
                      <div className="task-row-left">
                        <button
                          type="button"
                          className={`task-check-circle ${isDone ? 'checked' : ''}`}
                          onClick={() => handleToggleTaskStatus(t.id, t.status)}
                          title={isDone ? 'Mark as pending' : 'Mark as complete'}
                        >
                          {isDone ? '✓' : ''}
                        </button>
                        <div className="task-title-meta">
                          <span className="task-name">{t.title}</span>
                          <span className="task-subinfo">
                            {t.category && <span className="category-pill">{t.category}</span>}
                            <span>
                              {t.due_date ? `Due ${t.due_date}` : 'Today · 10:00 AM'}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="task-row-right">
                        <span className={`status-pill ${t.status}`}>
                          {t.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Side Helper / Quick Tip */}
          <div className="dash-sidebar-col">
            <div className="dash-card quick-tip-card">
              <div className="tip-header">
                <span className="tip-icon">💡</span>
                <h4>Quick tip</h4>
              </div>
              <p className="tip-body">
                Break larger tasks into smaller steps to make progress easier and maintain daily momentum.
              </p>
              <div className="tip-action">
                <Link to="/tasks" className="tip-link">
                  Manage all tasks →
                </Link>
              </div>
            </div>

            {/* Overall Progress Widget */}
            <div className="dash-card progress-widget-card">
              <h4>Weekly Goal</h4>
              <div className="progress-info-row">
                <span>Completion</span>
                <strong>{stats.rate}%</strong>
              </div>
              <div className="dash-progress-track">
                <div
                  className="dash-progress-fill"
                  style={{ width: `${stats.rate}%` }}
                />
              </div>
              <p className="progress-note">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
