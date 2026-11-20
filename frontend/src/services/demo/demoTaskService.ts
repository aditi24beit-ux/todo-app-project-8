import { demoStorage } from './demoStorage';
import type { Task, TaskFormData, User } from '../../types';

function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const demoTaskService = {
  async getTasks(userId?: number): Promise<Task[]> {
    await new Promise((res) => setTimeout(res, 120));
    const all = demoStorage.getTasks();
    const currentUser = getCurrentUser();

    // If explicit userId provided
    if (userId !== undefined) {
      return all.filter((t) => t.user_id === userId);
    }

    // If logged in as regular user, only show their own tasks
    if (currentUser && currentUser.role === 'user') {
      return all.filter((t) => t.user_id === currentUser.id);
    }

    // If admin or unauthenticated, return all tasks
    return all;
  },

  async getTask(id: number): Promise<Task> {
    await new Promise((res) => setTimeout(res, 80));
    const all = demoStorage.getTasks();
    const task = all.find((t) => t.id === id);
    if (!task) {
      throw new Error(`Task #${id} not found.`);
    }
    return task;
  },

  async createTask(data: TaskFormData): Promise<Task> {
    await new Promise((res) => setTimeout(res, 150));
    const currentUser = getCurrentUser();
    const all = demoStorage.getTasks();

    const newId = all.length > 0 ? Math.max(...all.map((t) => t.id)) + 1 : 1;
    const newTask: Task = {
      id: newId,
      user_id: currentUser?.id || 1,
      owner_name: currentUser?.name || 'Aarav Mehta',
      title: data.title.trim(),
      description: (data.description || '').trim(),
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      category: data.category || 'Personal',
      due_date: data.due_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    demoStorage.saveTasks([newTask, ...all]);
    demoStorage.addActivity(newTask.owner_name || 'User', `created task “${newTask.title}”`);

    return newTask;
  },

  async updateTask(id: number, data: Partial<TaskFormData>): Promise<Task> {
    await new Promise((res) => setTimeout(res, 120));
    const all = demoStorage.getTasks();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task #${id} not found.`);
    }

    const prevTask = all[index];
    const updatedTask: Task = {
      ...prevTask,
      ...data,
      title: data.title !== undefined ? data.title.trim() : prevTask.title,
      description: data.description !== undefined ? data.description.trim() : prevTask.description,
    };

    all[index] = updatedTask;
    demoStorage.saveTasks([...all]);

    if (data.status === 'completed' && prevTask.status !== 'completed') {
      demoStorage.addActivity(
        updatedTask.owner_name || 'User',
        `completed “${updatedTask.title}”`
      );
    }

    return updatedTask;
  },

  async deleteTask(id: number): Promise<void> {
    await new Promise((res) => setTimeout(res, 100));
    const all = demoStorage.getTasks();
    const taskToDelete = all.find((t) => t.id === id);
    const filtered = all.filter((t) => t.id !== id);
    demoStorage.saveTasks(filtered);

    if (taskToDelete) {
      demoStorage.addActivity(
        taskToDelete.owner_name || 'User',
        `deleted task “${taskToDelete.title}”`
      );
    }
  },
};
