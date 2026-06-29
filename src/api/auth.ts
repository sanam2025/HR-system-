import apiClient from './axios';

// ── Types ───
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// ── Login ───
// POST login?email=&password=
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    `login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
  );
  // خزّن التوكن والمستخدم في localStorage
  localStorage.setItem('auth_token', response.data.token);
  localStorage.setItem('auth_user', JSON.stringify(response.data.user));
  return response.data;
}

// ── Logout ──
// POST logout
export async function logout(): Promise<void> {
  try {
    await apiClient.post('logout');
  } finally {
    // امسح البيانات دائماً حتى لو فشل الطلب
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

// ── Helpers ─
export function getStoredToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getStoredUser(): LoginResponse['user'] | null {
  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
