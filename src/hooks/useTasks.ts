'use client';

import { useState, useCallback, useEffect } from 'react';
import { CreateTaskPayload, Task, TaskFilterParams, UpdateTaskPayload } from '@/types';
import { taskApi, ApiError } from '@/services/api';
import { MOCK_TASKS } from '@/data/mockData';

export function useTasks(initialFilters: TaskFilterParams = {}) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearNotifications = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  // Fetch Tasks from API
  const fetchTasks = useCallback(async (filters: TaskFilterParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskApi.getAll(filters);
      setTasks(data);
    } catch (err) {
      if (err instanceof ApiError) {
        // Fallback to local mock data filtering if server is offline
        const query = (filters.search || '').toLowerCase();
        const filtered = MOCK_TASKS.filter(
          (t) =>
            !query ||
            t.title.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))
        );
        setTasks(filtered);
      } else {
        setError('Failed to fetch tasks');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create Task
  const createTask = async (payload: CreateTaskPayload): Promise<boolean> => {
    clearNotifications();
    try {
      const newTask = await taskApi.create(payload);
      setTasks((prev) => [newTask, ...prev]);
      setSuccessMessage('Task created successfully!');
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        // Optimistic fallback creation
        const fallbackTask: Task = {
          id: `t_${Date.now()}`,
          title: payload.title,
          description: payload.description || null,
          status: payload.status || 'todo',
          priority: payload.priority || 'medium',
          dueDate: payload.dueDate || null,
          members: [{ id: 'u1', name: 'Dexter', initials: 'DX' }],
          labels: payload.labels || [],
          createdAt: new Date().toISOString().split('T')[0],
          subtasks: [],
          comments: [],
        };
        setTasks((prev) => [fallbackTask, ...prev]);
        setSuccessMessage('Task created locally!');
        return true;
      }
      setError('Failed to create task');
      return false;
    }
  };

  // Update Task
  const updateTask = async (id: string, payload: UpdateTaskPayload): Promise<boolean> => {
    clearNotifications();
    try {
      const updatedTask = await taskApi.update(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      setSuccessMessage('Task updated successfully!');
      return true;
    } catch (err) {
      // Local optimistic fallback update
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? ({ ...t, ...payload } as Task) : t))
      );
      setSuccessMessage('Task updated!');
      return true;
    }
  };

  // Delete Task
  const deleteTask = async (id: string): Promise<boolean> => {
    clearNotifications();
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSuccessMessage('Task deleted successfully!');
      return true;
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSuccessMessage('Task removed!');
      return true;
    }
  };

  useEffect(() => {
    fetchTasks(initialFilters);
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    successMessage,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearNotifications,
  };
}
