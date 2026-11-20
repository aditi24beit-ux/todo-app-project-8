import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import AppLayout from '../../components/Layout/AppLayout';
import type { TaskFormData } from '../../types';
import './AddTask.css';

export default function AddTask() {
  const { addTask } = useTasks();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: 'Work',
    due_date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title.trim()) {
      setError('Task title is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTask(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/tasks');
      }, 700);
    } catch {
      setError('Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout pageTitle="Add New Task">
      <div className="add-task-view">
        {/* Subtitle Banner */}
        <div className="add-task-banner">
          <p className="add-task-subline">
            Capture the details and set yourself up for success.
          </p>
        </div>

        <div className="add-task-columns">
          {/* Main Form Card */}
          <div className="add-task-card">
            <div className="card-section-title">Task details</div>

            {success && (
              <div className="add-task-success-alert">
                ✓ Task saved successfully! Redirecting to tasks...
              </div>
            )}
            {error && <div className="add-task-error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="add-task-form">
              <div className="form-group-field">
                <label htmlFor="task-title">Task title</label>
                <input
                  id="task-title"
                  name="title"
                  type="text"
                  placeholder="e.g. Complete project presentation"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-field">
                <label htmlFor="task-desc">Description</label>
                <textarea
                  id="task-desc"
                  name="description"
                  placeholder="Add a few details about this task..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="form-dual-row">
                <div className="form-group-field">
                  <label htmlFor="task-duedate">Due date</label>
                  <input
                    id="task-duedate"
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group-field">
                  <label htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
              </div>

              <div className="form-dual-row">
                <div className="form-group-field">
                  <label htmlFor="task-category">Category</label>
                  <select
                    id="task-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label htmlFor="task-status">Status</label>
                  <select
                    id="task-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="add-task-form-actions">
                <Link to="/tasks" className="btn-cancel-task">
                  Cancel
                </Link>
                <button type="submit" className="btn-save-task" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving task...' : 'Save task'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Reminder Card matching 04-add-edit-task-desktop.svg */}
          <div className="add-task-reminder-card">
            <div className="reminder-header">
              <span className="reminder-icon">📌</span>
              <h4>A helpful reminder</h4>
            </div>

            <div className="reminder-content">
              <p className="reminder-highlight">
                Keep your task title clear and actionable.
              </p>
              <div className="reminder-example-box">
                <span className="example-label">Example:</span>
                <span className="example-text">“Review chapter 2”</span>
              </div>
              <ul className="reminder-bullet-points">
                <li>Assign a realistic due date to stay on track.</li>
                <li>Set priority level to manage daily focus.</li>
                <li>Tag with category for easy filtering later.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
