import api from './api';
import type { Task, TaskFormData } from '../types';

const taskService = {
  // GET /api/tasks — list all tasks for the logged-in user
  async getTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/api/tasks');
    return response.data;
  },

  // GET /api/tasks/:id — get a single task
  async getTask(id: number): Promise<Task> {
    const response = await api.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  // POST /api/tasks — create a new task
  async createTask(data: TaskFormData): Promise<Task> {
    const response = await api.post<Task>('/api/tasks', data);
    return response.data;
  },

  // PUT /api/tasks/:id — update a task
  async updateTask(id: number, data: Partial<TaskFormData>): Promise<Task> {
    const response = await api.put<Task>(`/api/tasks/${id}`, data);
    return response.data;
  },

  // DELETE /api/tasks/:id — delete a task
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/api/tasks/${id}`);
  },
};

export default taskService;
