// Enums
export type UserRole = 'admin' | 'pm' | 'member';
export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type RagStatus = 'green' | 'amber' | 'red';
export type PortfolioStatus = 'active' | 'archived';

// Base entity
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// User
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  tenant_id: number;
}

export interface UserWithCounts extends User {
  active_tasks?: number;
  total_assigned?: number;
  completed_tasks?: number;
  overdue_tasks?: number;
}

// Tenant
export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  primary_domain: string;
  status: 'pending' | 'active' | 'suspended';
  onboarded_at: string | null;
}

// Portfolio
export interface Portfolio extends BaseEntity {
  tenant_id: number;
  created_by: number;
  name: string;
  description: string | null;
  client_name: string | null;
  start_date: string | null;
  end_date: string | null;
  status: PortfolioStatus;
  archived_at: string | null;
  projects_count?: number;
  projects?: Project[];
  creator?: User;
}

// Project
export interface Project extends BaseEntity {
  tenant_id: number;
  portfolio_id: number;
  created_by: number;
  template_used_id: number | null;
  name: string;
  client_name: string;
  project_type: string | null;
  location: string | null;
  estimated_hours: number | null;
  rag_status: RagStatus;
  start_date: string | null;
  end_date: string | null;
  portfolio?: Portfolio;
  creator?: User;
  template_used?: TaskTemplate;
  root_tasks?: Task[];
  total_tasks?: number;
  completed_tasks?: number;
  completion_percentage?: number;
  overdue_task_count?: number;
  blocked_task_count?: number;
  tasks_due_soon_count?: number;
}

// Task
export interface Task extends BaseEntity {
  tenant_id: number;
  project_id: number;
  parent_id: number | null;
  created_by: number;
  assigned_to: number | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  is_blocked: boolean;
  has_issue: boolean;
  order_index: number;
  nesting_level: number;
  completed_at: string | null;
  project?: Project;
  assignee?: User;
  creator?: User;
  parent?: Task;
  children?: Task[];
  path?: Task[];
}

// Task Template
export interface TaskTemplate extends BaseEntity {
  tenant_id: number;
  created_by: number;
  name: string;
  description: string | null;
  is_active: boolean;
  items_count?: number;
  items?: TaskTemplateItem[];
  creator?: User;
}

export interface TaskTemplateItem extends BaseEntity {
  task_template_id: number;
  parent_id: number | null;
  title: string;
  description: string | null;
  estimated_hours: number | null;
  order_index: number;
  nesting_level: number;
  parent?: TaskTemplateItem;
  children?: TaskTemplateItem[];
}

// Comment
export interface Comment extends BaseEntity {
  tenant_id: number;
  user_id: number;
  commentable_type: string;
  commentable_id: number;
  body: string;
  user?: User;
  commentable?: Task | Project;
}

// Dashboard
export interface DashboardData {
  portfolios: Portfolio[];
  my_tasks: {
    total: number;
    overdue: number;
    due_soon: number;
    blocked: number;
  };
  at_risk_projects: Project[];
  timeline: TimelineItem[];
}

export interface TimelineItem {
  id: number;
  name: string;
  start: string;
  end: string;
  rag_status: RagStatus;
  days_total: number;
  days_elapsed: number;
}

export interface WorkloadData {
  tasks_by_status: Record<TaskStatus, Task[]>;
  workload_by_project: {
    project_id: number;
    project_name: string;
    task_count: number;
  }[];
  total_hours: number;
  overdue_count: number;
}

export interface TeamWorkloadMember {
  id: number;
  name: string;
  role: UserRole;
  total_tasks: number;
  overdue_tasks: number;
  due_soon_tasks: number;
  at_risk: boolean;
}

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  tenant_name: string;
  domain: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  tenant: Tenant;
  token: string;
}

// API
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}