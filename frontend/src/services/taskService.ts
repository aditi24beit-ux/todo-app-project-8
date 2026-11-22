import api from './api';
import type { Task, TaskCreateData, TaskUpdateData, TaskFilterParams } from '../types';

const taskService = {
  // GET /tasks/ — list tasks for current user with optional filtering, search, and sorting
  async getTasks(params?: TaskFilterParams): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks/', { params });
    return response.data;
  },

  // GET /tasks/{task_id} — get a single task
  async getTask(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // POST /tasks/ — create a new task
  async createTask(data: TaskCreateData): Promise<Task> {
    const payload: TaskCreateData = {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      priority: data.priority || 'medium',
      due_date: data.due_date || null,
    };
    const response = await api.post<Task>('/tasks/', payload);
    return response.data;
  },

  // PATCH /tasks/{task_id} — partially update an existing task
  async updateTask(id: number, data: TaskUpdateData): Promise<Task> {
    const payload: TaskUpdateData = {};
    if (data.title !== undefined) payload.title = data.title.trim();
    if (data.description !== undefined) payload.description = data.description?.trim() || null;
    if (data.status !== undefined) payload.status = data.status;
    if (data.priority !== undefined) payload.priority = data.priority;
    if (data.due_date !== undefined) payload.due_date = data.due_date || null;

    const response = await api.patch<Task>(`/tasks/${id}`, payload);
    return response.data;
  },

  // DELETE /tasks/{task_id} — delete a task
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
