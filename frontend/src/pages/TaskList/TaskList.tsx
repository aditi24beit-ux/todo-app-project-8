import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import AppLayout from '../../components/Layout/AppLayout';
import EditTaskModal from '../../components/EditTaskModal/EditTaskModal';
import type { Task, TaskStatus, TaskUpdateData } from '../../types';
import './TaskList.css';

export default function TaskList() {
  const { tasks, fetchTasks, updateTask, deleteTask, isLoading, error } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('due-date');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // Status Filter
    if (statusFilter === 'pending') {
      result = result.filter((t) => t.status === 'pending');
    } else if (statusFilter === 'completed') {
      result = result.filter((t) => t.status === 'completed');
    }

    // Priority Filter
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'due-date':
        result.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
        break;
      case 'priority': {
        const pOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        result.sort((a, b) => (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1));
        break;
      }
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const handleStatusToggle = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: newStatus });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setDeletingId(id);
    try {
      await deleteTask(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSave = async (id: number, data: TaskUpdateData) => {
    await updateTask(id, data);
    setEditingTask(null);
  };

  return (
    <AppLayout pageTitle="My Tasks">
      <div className="task-list-view">
        {/* Banner */}
        <div className="task-list-banner">
          <p className="task-list-subline">
            Manage your work and keep track of what’s next.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="task-list-card">
          <div className="task-card-top-bar">
            <div className="top-bar-left">
              <h3>All your tasks</h3>
              <span className="task-total-count">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <Link to="/add-task" className="btn-add-primary">
              + Add new task
            </Link>
          </div>

          {/* Filter & Search Bar matching 05-user-task-list-desktop.svg */}
          <div className="task-filter-controls">
            {/* Search Input */}
            <div className="search-field-wrap">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Tabs */}
            <div className="task-status-tabs">
              <button
                type="button"
                className={`status-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`status-tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button
                type="button"
                className={`status-tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
            </div>

            {/* Priority Filter */}
            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">Priority: All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort Dropdown */}
            <select
              className="filter-select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tasks"
            >
              <option value="due-date">Sort: Due date</option>
              <option value="priority">Sort: Priority</option>
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
          </div>

          {error && <div className="task-error-alert" role="alert">{error}</div>}

          {/* Table / List */}
          {isLoading ? (
            <div className="task-loading-state">
              <div className="task-spinner" />
              <span>Loading your tasks...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="task-empty-state">
              <span className="empty-icon-art">📋</span>
              <h4>No tasks found</h4>
              <p>
                {tasks.length === 0
                  ? "You haven't created any tasks yet. Get started by adding your first task!"
                  : 'No tasks match your search or filter criteria.'}
              </p>
              <Link to="/add-task" className="btn-empty-create">
                + Create task
              </Link>
            </div>
          ) : (
            <div className="task-table-wrapper">
              <table className="task-table">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>TASK</th>
                    <th style={{ width: '20%' }}>DUE DATE</th>
                    <th style={{ width: '15%' }}>PRIORITY</th>
                    <th style={{ width: '10%' }}>STATUS</th>
                    <th style={{ width: '10%', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => {
                    const isDone = t.status === 'completed';
                    return (
                      <tr key={t.id} className={isDone ? 'row-completed' : ''}>
                        {/* Task Col */}
                        <td>
                          <div className="table-task-cell">
                            <button
                              type="button"
                              className={`row-check-circle ${isDone ? 'checked' : ''}`}
                              onClick={() => handleStatusToggle(t)}
                              title={isDone ? 'Mark as pending' : 'Mark as complete'}
                              aria-label={isDone ? 'Mark as pending' : 'Mark as complete'}
                            >
                              {isDone ? '✓' : ''}
                            </button>
                            <div className="task-text-col">
                              <span className="table-task-title">{t.title}</span>
                              {t.description && (
                                <span className="table-task-meta">
                                  {t.description.length > 60
                                    ? `${t.description.substring(0, 60)}...`
                                    : t.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Due Date Col */}
                        <td>
                          <span className="table-due-date">
                            {t.due_date || 'No due date'}
                          </span>
                        </td>

                        {/* Priority Col */}
                        <td>
                          <span className={`priority-tag ${t.priority}`}>
                            {t.priority}
                          </span>
                        </td>

                        {/* Status Col */}
                        <td>
                          <span className={`status-tag ${t.status}`}>
                            {t.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>

                        {/* Actions Col */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="row-action-btns">
                            <button
                              type="button"
                              className="btn-action-icon"
                              onClick={() => setEditingTask(t)}
                              title="Edit task"
                              aria-label="Edit task"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              className="btn-action-icon btn-action-delete"
                              onClick={() => handleDelete(t.id)}
                              disabled={deletingId === t.id}
                              title="Delete task"
                              aria-label="Delete task"
                            >
                              {deletingId === t.id ? '⏳' : '🗑️'}
                            </button>
                          </div>
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

      {/* Edit Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleModalSave}
        />
      )}
    </AppLayout>
  );
}
