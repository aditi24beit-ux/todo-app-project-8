import api from './api';
import type { User, Task, AdminStats } from '../types';

const adminService = {
  // GET /admin/users — retrieve all users (Admin only)
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },

  // GET /admin/users/{user_id} — retrieve single user by id
  async getUser(id: number): Promise<User> {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  // PATCH /admin/users/{user_id}/status — activate or deactivate a user
  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const response = await api.patch<User>(`/admin/users/${id}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  // DELETE /admin/users/{user_id} — delete a user account
  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/admin/users/${id}`);
    return response.data;
  },

  // GET /admin/tasks — retrieve all tasks across workspace
  async getAllTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/admin/tasks');
    return response.data;
  },

  // GET /admin/stats — retrieve dashboard statistics (total_users, total_tasks, pending_tasks, completed_tasks)
  async getStats(): Promise<AdminStats> {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data;
  },
};

export default adminService;
