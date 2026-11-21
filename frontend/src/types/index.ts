// User & Auth types matching FastAPI UserResponse & TokenResponse
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
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

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserStatusUpdate {
  is_active: boolean;
}

// Task types matching FastAPI TaskCreate, TaskUpdate, TaskResponse
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  owner_name?: string; // Cross-referenced client-side in admin views
}

export interface TaskCreateData {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskUpdateData {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskFilterParams {
  status_filter?: TaskStatus;
  q?: string;
  sort?: 'created_at' | 'due_date';
}

// Admin Statistics matching GET /admin/stats
export interface AdminStats {
  total_users: number;
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
}
