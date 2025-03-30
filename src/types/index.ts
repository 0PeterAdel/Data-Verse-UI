export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Theme {
  mode: 'light' | 'dark';
}

export interface DataSet {
  id: string;
  name: string;
  type: 'csv' | 'excel' | 'json';
  size: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'error';
  columns: string[];
  rowCount: number;
}