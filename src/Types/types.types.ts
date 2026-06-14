export type APIResponse = {
    message: string;
    status_code: number;
    Token?: string;
}

export type APIResponseWithData<T> = APIResponse & {
    data?: T[];
}

export type UserStatus = 'active' | 'inactive';

export type User = {
    id: number;
    full_name: string;
    email: string;
    dep_id: number;
    status: UserStatus;
    is_first_login: 1;
    email_verified_at: string;
    created_at: Date;
    updated_at: Date;
}