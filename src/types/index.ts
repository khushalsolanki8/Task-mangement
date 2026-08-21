export type TaskPriority = 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'no_priority' | 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD' | 'USER_FEEDBACK' | 'todo' | 'doing' | 'completed' | 'on_hold' | 'user_feedback';

export type ThemeMode = 'light' | 'dark';

export type AccentColor = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

export type ViewMode = 'board' | 'list';

export interface User {
  id: string;
  name: string;
  email?: string | null;
  avatar?: string | null;
  isGuest?: boolean;
  initials?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  assignee?: User;
  dueDate?: string;
}

export interface TaskComment {
  id: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  members: User[];
  labels: string[];
  subtasks?: Subtask[];
  comments?: TaskComment[];
  projectId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  priority: TaskPriority;
  lead?: User | null;
  dueDate?: string | null;
  taskCount: number;
}

// API DTO & Response Payload Interfaces
export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  labels?: string[];
  projectId?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  labels?: string[];
  projectId?: string;
}

export interface TaskFilterParams {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}
