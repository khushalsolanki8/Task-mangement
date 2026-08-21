import {
  AuthResponse,
  CreateTaskPayload,
  Task,
  TaskFilterParams,
  UpdateTaskPayload,
  User,
} from '@/types';
import { MOCK_USERS } from '@/data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  statusCode: number;
  messages: string[];

  constructor(statusCode: number, messages: string[]) {
    super(messages.join(', '));
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.messages = messages;
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // If 401 Unauthorized, automatically clear invalid token
      if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      const messages = Array.isArray(data.message)
        ? data.message
        : [data.message || 'An unexpected server error occurred'];
      throw new ApiError(res.status, messages);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, ['Unable to connect to NestJS backend server. Using local fallback.']);
  }
}

// Auth API Methods
export const authApi = {
  async guestLogin(): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/guest-login', { method: 'POST' });
  },

  async getMe(): Promise<User> {
    return request<User>('/users/me', { method: 'GET' });
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};

// Task API Methods
export const taskApi = {
  async getAll(params: TaskFilterParams = {}): Promise<Task[]> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    if (params.projectId) query.append('projectId', params.projectId);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<Task[]>(`/tasks${queryString}`, { method: 'GET' });
  },

  async getOne(id: string): Promise<Task> {
    return request<Task>(`/tasks/${id}`, { method: 'GET' });
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: UpdateTaskPayload): Promise<Task> {
    return request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' });
  },
};
