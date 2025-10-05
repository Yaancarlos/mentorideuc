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
    AVAILABLE = 'available',
    BOOKED = 'booked',
    CANCELED = 'canceled'
}

export enum RepositoryStatus {
    SUBMITTED = 'submitted',
    REVIEWED = 'reviewed',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}