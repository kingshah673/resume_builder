export interface ResumeData {
    full_name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    skills?: string[];
    education?: Array<{ degree: string; institution: string; year: string }>;
    work_experience?: Array<{ title: string; company: string; date: string; description: string }>;
    projects?: Array<{ title: string; description: string }>;
    languages?: string[];
    error?: string;
    message?: string;
}
