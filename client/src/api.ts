const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

async function apiFetch(endpoint: string, options: any = {}) {
  const token = getToken();
  
  const headers: any = {
    'Authorization': token ? `Bearer ${token}` : '',
    ...options.headers,
  };

  // Only set Content-Type to JSON if it's not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export type AuthResponse = {
  token: string;
  user: { id: string; handle: string; role: string; avatar: string | null; rating?: number };
};

export async function apiRegister(handle: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ handle, password }),
  });
}

export async function apiLogin(handle: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ handle, password }),
  });
}

export type ReportData = {
  reportId: string;
  reporterHandle: string;
  suspectHandle: string;
  contestId: string;
  problemId: string;
  reason: string;
  description: string;
  evidenceImage?: string;
  status: 'pending' | 'reviewed' | 'resolved';
};

export type PaginatedReports = {
  reports: ReportData[];
  total: number;
  page: number;
  pages: number;
};

export async function getReports(filters?: Record<string, string | number>): Promise<PaginatedReports> {
  const params = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
  return apiFetch(`/reports${params}`);
}

export async function createReport(reportData: any) {
  return apiFetch('/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
}

export async function createReview(reviewData: any) {
  return apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}
