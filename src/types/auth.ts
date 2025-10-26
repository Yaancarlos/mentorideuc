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

export enum EventStatus {
    ALL = 'all',
    AVAILABLE = 'available',
    BOOKED = 'booked',
    CANCELED = 'canceled',
    PENDING = 'pending'
}

export enum Role {
    ALL = 'all',
    STUDENT = 'student',
    ADMIN = 'admin',
    TUTOR = 'tutor',
}

export enum RepositoryStatus {
    ALL = 'all',
    SUBMITTED = 'submitted',
    REVIEWED = 'reviewed',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export interface UserFormData {
    email: string;
    name: string;
    role: UserRole;
    password: string;
}

export interface CareerFormData {
    name: string;
    code: string;
    faculty: string;
    duration_semesters: number;
    is_active: boolean;
}