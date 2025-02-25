export interface Student {
    id: string;
    name: string;
    nis: string;
    StudentGradeHistory?: {
        startDate: string;
        dormitory: { name: string };
        grade: { name: string };
    } | null;
}

export interface StudentResponse {
    data: Student[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export type SortOrder = 'asc' | 'desc';

export interface StudentQueryParams {
    page: number;
    limit: number;
    search: string;
    grade: string;
    sortBy: string;
    sortOrder: SortOrder;
}
