
export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status_code: number;
}

export interface APIResponseWithData<T> {
  success: boolean;
  message: string;
  data: T;
  status_code: number;
}

export interface APIResponseWithDataArray<T> {
  success: boolean;
  message: string;
  data: T[];
  status_code: number;
}
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: { url: string | null; label: string; active: boolean }[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}
export type UserRole = 'm' | 'h' | 'v' | null;
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  dep_id?: number;
  is_first_login?: boolean;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: { user: User };
  Token: string;
  status_code: number;
}