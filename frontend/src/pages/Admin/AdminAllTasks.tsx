import { useEffect, useState, useMemo } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import adminService from '../../services/adminService';
import taskService from '../../services/taskService';
import type { Task, TaskStatus } from '../../types';
import './AdminAllTasks.css';

export default function AdminAllTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');

  useEffect(() => {
    async function loadAllTasks() {
      setLoading(true);
      setError(null);
      try {
        const [allTasks, allUsers] = await Promise.all([
          adminService.getAllTasks(),
          adminService.getUsers(),
        ]);

        const userMap = new Map<number, string>();
        allUsers.forEach((u) => {
          userMap.set(u.id, u.name);
        });

        const enriched = allTasks.map((t) => ({
          ...t,
          owner_name: userMap.get(t.user_id) || `User #${t.user_id}`,
        }));

        setTasks(enriched);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load workspace tasks.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadAllTasks();
  }, []);

  const allOwners = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.owner_name) set.add(t.owner_name);
    });
    return Array.from(set);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.owner_name?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    if (ownerFilter !== 'all') {
      result = result.filter((t) => t.owner_name === ownerFilter);
    }

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, ownerFilter]);

  const handleToggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await taskService.updateTask(task.id, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: updated.status } : t))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task.';
      alert(msg);
    }
  };

  return (
    <AppLayout pageTitle="All Tasks">
      <div className="admin-tasks-view">
        <div className="admin-tasks-banner">
          <p className="admin-tasks-subline">
            Review tasks across every account.
          </p>
        </div>

        {error && <div className="admin-tasks-error-alert" role="alert">{error}</div>}

        <div className="admin-tasks-card">
          <div className="admin-tasks-header">
            <h3>All workspace tasks</h3>
            <span className="tasks-count-pill">
              {filteredTasks.length} total
            </span>
          </div>

          {/* Filters Bar matching 08-admin-all-tasks-desktop.svg */}
          <div className="admin-tasks-filter-bar">
            <div className="admin-search-wrap">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search task or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="admin-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="admin-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">Priority: All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="admin-filter-select"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              aria-label="Filter by owner"
            >
              <option value="all">Owner: All</option>
              {allOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          {/* Tasks Table */}
          {loading ? (
            <div className="admin-tasks-loading">Loading workspace tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="admin-tasks-empty">
              <span className="empty-tasks-art">📋</span>
              <h4>No tasks found</h4>
              <p>No tasks match the active filters.</p>
            </div>
          ) : (
            <div className="admin-tasks-table-wrap">
              <table className="admin-tasks-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>TASK</th>
                    <th style={{ width: '24%' }}>ASSIGNED TO</th>
                    <th style={{ width: '16%' }}>DUE DATE</th>
                    <th style={{ width: '10%' }}>STATUS</th>
                    <th style={{ width: '10%' }}>PRIORITY</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => {
                    const isDone = t.status === 'completed';
                    return (
                      <tr key={t.id} className={isDone ? 'row-done' : ''}>
                        {/* Task */}
                        <td>
                          <div className="admin-task-cell">
                            <span className="admin-task-title">{t.title}</span>
                            {t.description && (
                              <span className="admin-task-desc-sub">{t.description}</span>
                            )}
                          </div>
                        </td>

                        {/* Assigned To */}
                        <td>
                          <div className="assigned-to-cell">
                            <div className="assigned-avatar">
                              {t.owner_name ? t.owner_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="assigned-name">
                              {t.owner_name || 'Unassigned'}
                            </span>
                          </div>
                        </td>

                        {/* Due Date */}
                        <td>
                          <span className="admin-due-date">
                            {t.due_date || 'No date'}
                          </span>
                        </td>

                        {/* Status (Clickable Toggle) */}
                        <td>
                          <button
                            type="button"
                            className={`admin-status-toggle ${t.status}`}
                            onClick={() => handleToggleStatus(t)}
                            title="Click to toggle status"
                          >
                            {t.status === 'completed' ? 'Completed' : 'Pending'}
                          </button>
                        </td>

                        {/* Priority */}
                        <td>
                          <span className={`admin-priority-badge ${t.priority}`}>
                            {t.priority}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
