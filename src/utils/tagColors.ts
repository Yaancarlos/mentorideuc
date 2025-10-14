export function getRepositoryColor (status: string) {
    switch (status) {
        case 'submitted': return 'bg-blue-500';
        case 'reviewed': return 'bg-yellow-500';
        case 'approved': return 'bg-green-500';
        case 'rejected': return 'bg-red-600';
        default: return 'bg-gray-500';
    }
}

export function getSessionColor (status: string) {
    switch (status) {
        case 'booked': return 'bg-green-500';
        case 'canceled': return 'bg-red-500';
        case 'available': return 'bg-blue-500';
        default: return 'bg-gray-500';
    }
}