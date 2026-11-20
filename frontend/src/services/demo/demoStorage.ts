import { INITIAL_DEMO_USERS, INITIAL_DEMO_TASKS, INITIAL_DEMO_ACTIVITIES } from './demoData';
import type { User, Task, ActivityItem } from '../../types';

const USERS_KEY = 'taskflow_demo_users';
const TASKS_KEY = 'taskflow_demo_tasks';
const ACTIVITIES_KEY = 'taskflow_demo_activities';

export type StoredUser = User & { password_hash: string };

function initStorage(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
  }
  if (!localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
  }
  if (!localStorage.getItem(ACTIVITIES_KEY)) {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_DEMO_ACTIVITIES));
  }
}

// Automatically initialize on import
initStorage();

export const demoStorage = {
  getUsers(): StoredUser[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : INITIAL_DEMO_USERS;
    } catch {
      return INITIAL_DEMO_USERS;
    }
  },

  saveUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : INITIAL_DEMO_TASKS;
    } catch {
      return INITIAL_DEMO_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  getActivities(): ActivityItem[] {
    try {
      const data = localStorage.getItem(ACTIVITIES_KEY);
      return data ? JSON.parse(data) : INITIAL_DEMO_ACTIVITIES;
    } catch {
      return INITIAL_DEMO_ACTIVITIES;
    }
  },

  addActivity(user_name: string, action: string): void {
    const activities = this.getActivities();
    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      user_name,
      action,
      timestamp: 'Just now',
    };
    const updated = [newAct, ...activities.slice(0, 19)];
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
  },

  resetToDefaults(): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
    localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_DEMO_ACTIVITIES));
  },
};
