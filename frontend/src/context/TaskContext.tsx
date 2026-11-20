import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import taskService from '../services/taskService';
import { demoTaskService } from '../services/demo/demoTaskService';
import { DEMO_CONFIG } from '../config/demoConfig';
import type { Task, TaskFormData } from '../types';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: number, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const isDemoMode = DEMO_CONFIG.isDemoMode;
  const activeTaskService = isDemoMode ? demoTaskService : taskService;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await activeTaskService.getTasks();
      setTasks(data);
    } catch {
      setError('Failed to fetch tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTaskService]);

  const addTask = async (data: TaskFormData) => {
    setError(null);
    try {
      const newTask = await activeTaskService.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err: unknown) {
      setError('Failed to create task.');
      throw new Error('Failed to create task.', { cause: err });
    }
  };

  const updateTask = async (id: number, data: Partial<TaskFormData>) => {
    setError(null);
    try {
      const updated = await activeTaskService.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: unknown) {
      setError('Failed to update task.');
      throw new Error('Failed to update task.', { cause: err });
    }
  };

  const deleteTask = async (id: number) => {
    setError(null);
    try {
      await activeTaskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      setError('Failed to delete task.');
      throw new Error('Failed to delete task.', { cause: err });
    }
  };

  const clearError = () => setError(null);

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, error, fetchTasks, addTask, updateTask, deleteTask, clearError }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
