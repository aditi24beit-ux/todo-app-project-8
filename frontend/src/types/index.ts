// Task types
export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  due_date: string;
  created_at: string;
  owner_name?: string;
}

export type TaskFormData = Omit<Task, 'id' | 'user_id' | 'created_at' | 'owner_name'>;

// User / Auth types
export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Activity Log for Admin
export interface ActivityItem {
  id: string;
  user_name: string;
  action: string;
  timestamp: string;
}

// Admin Metrics
export interface AdminStats {
  registeredUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  activeUsers: number;
  inactiveUsers: number;
  userGrowth: string;
}
