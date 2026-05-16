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
  
  const headers = {
    'Authorization': token ? `Bearer ${token}` : '',
    ...options.headers,
  };

  const isFormData = options.body && (options.body instanceof FormData || typeof options.body.append === 'function');
  
  const fetchOptions = {
    ...options,
    headers: {
      ...headers,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    },
    body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined)
  };

  const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

  const data = await response.json();
  if (!response.ok) {
    if (data.errors && Array.isArray(data.errors)) {
      let msg = data.errors.map((e: any) => `${e.path || e.param}: ${e.msg}`).join(', ');
      throw new Error(msg);
    }
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
    body: { handle, password },
  });
}

export async function apiLogin(handle: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { handle, password },
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
    body: reportData,
  });
}

export async function createReview(reviewData: any) {
  return apiFetch('/reviews', {
    method: 'POST',
    body: reviewData,
  });
}
