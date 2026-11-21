import { useState, type FormEvent } from 'react';
import type { Task, TaskUpdateData, TaskStatus, TaskPriority } from '../../types';
import './EditTaskModal.css';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (id: number, data: TaskUpdateData) => Promise<void>;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [formData, setFormData] = useState<TaskUpdateData>({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    due_date: task.due_date || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Task title is required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(task.id, {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        status: formData.status as TaskStatus,
        priority: formData.priority as TaskPriority,
        due_date: formData.due_date || null,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        {error && <div className="modal-error-alert" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field-group">
            <label htmlFor="edit-title">Title *</label>
            <input
              id="edit-title"
              name="title"
              type="text"
              value={formData.title || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-row-grid">
            <div className="form-field-group">
              <label htmlFor="edit-status">Status</label>
              <select
                id="edit-status"
                name="status"
                value={formData.status || 'pending'}
                onChange={handleChange}
              >
                <option value="pending">⏳ Pending</option>
                <option value="completed">✓ Completed</option>
              </select>
            </div>

            <div className="form-field-group">
              <label htmlFor="edit-priority">Priority</label>
              <select
                id="edit-priority"
                name="priority"
                value={formData.priority || 'medium'}
                onChange={handleChange}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-field-group">
              <label htmlFor="edit-due_date">Due Date</label>
              <input
                id="edit-due_date"
                name="due_date"
                type="date"
                value={formData.due_date || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-action-bar">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-save" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
