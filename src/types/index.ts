export type TaskPriority = 'no_priority' | 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'doing' | 'completed' | 'on_hold' | 'user_feedback';

export type ThemeMode = 'light' | 'dark';

export type AccentColor = 'blue' | 'amber' | 'pink' | 'rose' | 'emerald' | 'violet' | 'black';

export type ViewMode = 'board' | 'list';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
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
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  members: User[];
  labels: string[];
  subtasks?: Subtask[];
  comments?: TaskComment[];
  projectId?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  priority: TaskPriority;
  lead: User;
  dueDate: string;
  taskCount: number;
}
