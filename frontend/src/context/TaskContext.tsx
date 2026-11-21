import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import taskService from '../services/taskService';
import type { Task, TaskCreateData, TaskUpdateData, TaskFilterParams } from '../types';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (params?: TaskFilterParams) => Promise<void>;
  addTask: (data: TaskCreateData) => Promise<Task>;
  updateTask: (id: number, data: TaskUpdateData) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (params?: TaskFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(params);
      setTasks(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch tasks.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTask = async (data: TaskCreateData): Promise<Task> => {
    setError(null);
    try {
      const newTask = await taskService.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create task.';
      setError(msg);
      throw new Error(msg, { cause: err });
    }
  };

  const updateTask = async (id: number, data: TaskUpdateData): Promise<Task> => {
    setError(null);
    try {
      const updated = await taskService.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task.';
      setError(msg);
      throw new Error(msg, { cause: err });
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete task.';
      setError(msg);
      throw new Error(msg, { cause: err });
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
