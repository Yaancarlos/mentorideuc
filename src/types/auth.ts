export type UserRole = 'admin' | 'tutor' | 'student';

export interface Profile {
    id: string;
    name: string;
    role: UserRole;
    email: string;
    created_at: string;
    updated_at: string;
    avatar_url: string;
}