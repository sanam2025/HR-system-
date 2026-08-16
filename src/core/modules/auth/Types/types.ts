export type UserStatus = 'active' | 'inactive' ;

export type User = {
    id: number;
    full_name: string;
    email: string;
    dep_id: number;
    status: UserStatus;
    is_first_login: number;
    onboarding_completed_at: Date;
    email_verified_at: Date;
    created_at: Date;
    updated_at: Date;
}

export type UserLogin = {
    email: string;
    password: string;
}

