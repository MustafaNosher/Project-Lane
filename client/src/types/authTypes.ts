export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface DashboardStats {
  activeProjectsCount: number;
  pendingTasksCount: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  allUsers: User[] | null;
  dashboardStats: DashboardStats | null;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterResponse {
  message: string;
  data: User; 
}

