import {
  ApiResponse,
  CreateProjectPayload,
  CreateTaskPayload,
  Project,
  Task,
  TaskFilterParams,
  UpdateProjectPayload,
  UpdateTaskPayload,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage =
        result.error?.message ||
        result.error?.details?.map((d) => `${d.field}: ${d.message}`).join(', ') ||
        'An unexpected error occurred';
      throw new Error(errorMessage);
    }

    return result.data;
  }

  // --- Project Endpoints ---
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProjectById(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(payload: CreateProjectPayload): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  async deleteProject(id: string): Promise<{ id: string }> {
    return this.request<{ id: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Task Endpoints ---
  async getTasks(params: TaskFilterParams = {}): Promise<Task[]> {
    const query = new URLSearchParams();
    if (params.projectId) query.append('projectId', params.projectId);
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);

    const queryString = query.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return this.request<Task[]>(endpoint);
  }

  async getTaskById(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  async deleteTask(id: string): Promise<{ id: string }> {
    return this.request<{ id: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
