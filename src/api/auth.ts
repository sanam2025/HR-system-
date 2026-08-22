import apiClient from './axios';export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    `login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
  );  localStorage.setItem('auth_token', response.data.token);
  localStorage.setItem('auth_user', JSON.stringify(response.data.user));
  return response.data;
}export async function logout(): Promise<void> {
  try {
    await apiClient.post('logout');
  } finally {    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}export function getStoredToken(): string | null {
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
