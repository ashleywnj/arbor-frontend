import axios, { AxiosError, AxiosInstance } from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async me(): Promise<{ user: User }> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Dashboard
  async getDashboard() {
    const response = await this.client.get('/dashboard');
    return response.data;
  }

  async getWorkload() {
    const response = await this.client.get('/dashboard/workload');
    return response.data;
  }

  async getTeamWorkload() {
    const response = await this.client.get('/dashboard/team-workload');
    return response.data;
  }

  // Portfolios
  async getPortfolios() {
    const response = await this.client.get('/portfolios');
    return response.data;
  }

  async getPortfolio(id: number) {
    const response = await this.client.get(`/portfolios/${id}`);
    return response.data;
  }

  async createPortfolio(data: {
    name: string;
    description?: string;
    client_name?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const response = await this.client.post('/portfolios', data);
    return response.data;
  }

  async updatePortfolio(id: number, data: Partial<{
    name: string;
    description: string;
    client_name: string;
    start_date: string;
    end_date: string;
  }>) {
    const response = await this.client.put(`/portfolios/${id}`, data);
    return response.data;
  }

  async deletePortfolio(id: number) {
    await this.client.delete(`/portfolios/${id}`);
  }

  async archivePortfolio(id: number) {
    const response = await this.client.post(`/portfolios/${id}/archive`);
    return response.data;
  }

  async unarchivePortfolio(id: number) {
    const response = await this.client.post(`/portfolios/${id}/unarchive`);
    return response.data;
  }

  // Projects
  async getProjects() {
    const response = await this.client.get('/projects');
    return response.data;
  }

  async getProjectsByPortfolio(portfolioId: number) {
    const response = await this.client.get(`/portfolios/${portfolioId}/projects`);
    return response.data;
  }

  async getProject(id: number) {
    const response = await this.client.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: {
    portfolio_id: number;
    name: string;
    client_name: string;
    project_type?: string;
    location?: string;
    estimated_hours?: number;
    start_date?: string;
    end_date?: string;
    template_id?: number;
  }) {
    const response = await this.client.post('/projects', data);
    return response.data;
  }

  async updateProject(id: number, data: Partial<{
    name: string;
    client_name: string;
    project_type: string;
    location: string;
    estimated_hours: number;
    rag_status: string;
    start_date: string;
    end_date: string;
  }>) {
    const response = await this.client.put(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: number) {
    await this.client.delete(`/projects/${id}`);
  }

  // Tasks
  async getTasks() {
    const response = await this.client.get('/tasks');
    return response.data;
  }

  async getTasksByProject(projectId: number) {
    const response = await this.client.get(`/projects/${projectId}/tasks`);
    return response.data;
  }

  async getTaskTree(projectId: number) {
    const response = await this.client.get(`/projects/${projectId}/tasks/tree`);
    return response.data;
  }

  async getTask(id: number) {
    const response = await this.client.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(data: {
    project_id: number;
    parent_id?: number;
    title: string;
    description?: string;
    due_date?: string;
    assigned_to?: number;
    priority?: 'low' | 'medium' | 'high';
    order_index?: number;
  }) {
    const response = await this.client.post('/tasks', data);
    return response.data;
  }

  async updateTask(id: number, data: Partial<{
    title: string;
    description: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high';
    parent_id: number;
    order_index: number;
  }>) {
    const response = await this.client.put(`/tasks/${id}`, data);
    return response.data;
  }

  async deleteTask(id: number) {
    await this.client.delete(`/tasks/${id}`);
  }

  async updateTaskStatus(id: number, status: string) {
    const response = await this.client.post(`/tasks/${id}/status`, { status });
    return response.data;
  }

  async assignTask(id: number, assignedTo: number | null) {
    const response = await this.client.post(`/tasks/${id}/assign`, { assigned_to: assignedTo });
    return response.data;
  }

  async reorderTask(id: number, orderIndex: number) {
    const response = await this.client.post(`/tasks/${id}/reorder`, { order_index: orderIndex });
    return response.data;
  }

  async blockTask(id: number) {
    const response = await this.client.post(`/tasks/${id}/block`);
    return response.data;
  }

  async unblockTask(id: number) {
    const response = await this.client.post(`/tasks/${id}/unblock`);
    return response.data;
  }

  async flagTaskIssue(id: number) {
    const response = await this.client.post(`/tasks/${id}/flag-issue`);
    return response.data;
  }

  async clearTaskIssue(id: number) {
    const response = await this.client.post(`/tasks/${id}/clear-issue`);
    return response.data;
  }

  // Task Templates
  async getTaskTemplates() {
    const response = await this.client.get('/task-templates');
    return response.data;
  }

  async getTaskTemplate(id: number) {
    const response = await this.client.get(`/task-templates/${id}`);
    return response.data;
  }

  async createTaskTemplate(data: {
    name: string;
    description?: string;
    items: {
      title: string;
      description?: string;
      estimated_hours?: number;
      parent_index?: number;
    }[];
  }) {
    const response = await this.client.post('/task-templates', data);
    return response.data;
  }

  async applyTaskTemplate(templateId: number, projectId: number) {
    const response = await this.client.post(`/task-templates/${templateId}/apply/${projectId}`);
    return response.data;
  }

  // Users
  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  async getUser(id: number) {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data: {
    name: string;
    email: string;
    role: 'admin' | 'pm' | 'member';
    password: string;
  }) {
    const response = await this.client.post('/users', data);
    return response.data;
  }

  async updateUser(id: number, data: Partial<{ name: string; email: string }>) {
    const response = await this.client.put(`/users/${id}`, data);
    return response.data;
  }

  async changeUserRole(id: number, role: string) {
    const response = await this.client.post(`/users/${id}/change-role`, { role });
    return response.data;
  }

  async deactivateUser(id: number) {
    const response = await this.client.post(`/users/${id}/deactivate`);
    return response.data;
  }

  async activateUser(id: number) {
    const response = await this.client.post(`/users/${id}/activate`);
    return response.data;
  }

  // Comments
  async getTaskComments(taskId: number) {
    const response = await this.client.get(`/tasks/${taskId}/comments`);
    return response.data;
  }

  async getProjectComments(projectId: number) {
    const response = await this.client.get(`/projects/${projectId}/comments`);
    return response.data;
  }

  async createComment(data: {
    commentable_type: 'task' | 'project';
    commentable_id: number;
    body: string;
  }) {
    const response = await this.client.post('/comments', data);
    return response.data;
  }

  async deleteComment(id: number) {
    await this.client.delete(`/comments/${id}`);
  }
}

export const api = new ApiClient();