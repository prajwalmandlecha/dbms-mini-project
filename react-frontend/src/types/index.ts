export interface Department {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  address: string;
  website: string;
}

export interface InternalMentor {
  id: number;
  name: string;
  email: string;
  mobileNo: string;
}

export interface ExternalMentor {
  id: number;
  name: string;
  email: string;
  mobileNo: string;
}

export interface Student {
  id: number;
  rollno: string;
  name: string;
  year: 'FE' | 'SE' | 'TE' | 'BE';
  div: string;
  mobileNo: string;
  email: string;
  departmentId: number;
  department?: Department;
}

export interface Internship {
  id: number;
  title: string;
  description: string;
  academicYear: 'YEAR_2023_24' | 'YEAR_2024_25' | 'YEAR_2025_26';
  duration: number; // in months
  mode: 'REMOTE' | 'ONSITE' | 'PART_TIME';
  stipend: number;
  PPO: boolean;
  CompletionCertificate: string;
  Remarks?: string;
  CompanyId: number;
  company?: Company;
  externalMentorId: number;
  externalMentor?: ExternalMentor;
  internalMentorId: number;
  internalMentor?: InternalMentor;
  students?: StudentInternship[];
}

export interface StudentInternship {
  studentId: number;
  internshipId: number;
  student?: Student;
  internship?: Internship;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}