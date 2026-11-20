import { demoStorage, type StoredUser } from './demoStorage';
import type { User, Task, ActivityItem, AdminStats } from '../../types';

export const demoAdminService = {
  async getStats(): Promise<AdminStats> {
    await new Promise((res) => setTimeout(res, 100));
    const users = demoStorage.getUsers();
    const tasks = demoStorage.getTasks();

    const registeredUsers = Math.max(users.length, 128);
    const activeUsers = users.filter((u) => u.status === 'active').length;
    const inactiveUsers = users.filter((u) => u.status === 'inactive').length;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      registeredUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      activeUsers,
      inactiveUsers,
      userGrowth: '↑ 8 this month',
    };
  },

  async getAllUsers(): Promise<User[]> {
    await new Promise((res) => setTimeout(res, 100));
    const rawUsers = demoStorage.getUsers();
    return rawUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'user',
      status: u.status || 'active',
      created_at: u.created_at,
    }));
  },

  async toggleUserStatus(userId: number): Promise<User> {
    await new Promise((res) => setTimeout(res, 120));
    const users = demoStorage.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error(`User #${userId} not found.`);
    }

    const current = users[index];
    const newStatus: 'active' | 'inactive' =
      current.status === 'active' ? 'inactive' : 'active';
    users[index] = { ...current, status: newStatus };
    demoStorage.saveUsers(users);

    demoStorage.addActivity(
      'Administrator',
      `changed status of ${current.name} to ${newStatus}`
    );

    return {
      id: current.id,
      name: current.name,
      email: current.email,
      role: current.role || 'user',
      status: newStatus,
      created_at: current.created_at,
    };
  },

  async createUser(data: { name: string; email: string; role: 'user' | 'admin' }): Promise<User> {
    await new Promise((res) => setTimeout(res, 150));
    const users = demoStorage.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('A user with this email already exists.');
    }

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const nowIso = new Date().toISOString();

    const newUser: StoredUser = {
      id: newId,
      name: data.name.trim(),
      email: cleanEmail,
      password_hash: 'password123',
      role: data.role,
      status: 'active',
      created_at: nowIso,
    };

    demoStorage.saveUsers([...users, newUser]);
    demoStorage.addActivity('Administrator', `invited new user ${newUser.name}`);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      created_at: newUser.created_at,
    };
  },

  async deleteUser(userId: number): Promise<void> {
    await new Promise((res) => setTimeout(res, 120));
    const users = demoStorage.getUsers();
    const userToDelete = users.find((u) => u.id === userId);
    const filtered = users.filter((u) => u.id !== userId);
    demoStorage.saveUsers(filtered);

    if (userToDelete) {
      demoStorage.addActivity('Administrator', `removed user ${userToDelete.name}`);
    }
  },

  async getAllTasks(): Promise<Task[]> {
    await new Promise((res) => setTimeout(res, 100));
    return demoStorage.getTasks();
  },

  async getActivities(): Promise<ActivityItem[]> {
    await new Promise((res) => setTimeout(res, 80));
    return demoStorage.getActivities();
  },
};
