import axios from 'axios';
import { Department, Company, InternalMentor, ExternalMentor, Student, Internship, StudentInternship } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const departmentService = {
  getAll: () => api.get<Department[]>('/departments'),
  create: (data: Omit<Department, 'id'>) => api.post<Department>('/departments', data),
  update: (id: number, data: Partial<Department>) => api.put<Department>(`/departments/${id}`, data),
  delete: (id: number) => api.delete(`/departments/${id}`),
};

export const companyService = {
  getAll: () => api.get<Company[]>('/companies'),
  create: (data: Omit<Company, 'id'>) => api.post<Company>('/companies', data),
  update: (id: number, data: Partial<Company>) => api.put<Company>(`/companies/${id}`, data),
  delete: (id: number) => api.delete(`/companies/${id}`),
};

export const mentorService = {
  getAllInternal: () => api.get<InternalMentor[]>('/mentors/internal'),
  createInternal: (data: Omit<InternalMentor, 'id'>) => api.post<InternalMentor>('/mentors/internal', data),
  updateInternal: (id: number, data: Partial<InternalMentor>) => api.put<InternalMentor>(`/mentors/internal/${id}`, data),
  deleteInternal: (id: number) => api.delete(`/mentors/internal/${id}`),
  
  getAllExternal: () => api.get<ExternalMentor[]>('/mentors/external'),
  createExternal: (data: Omit<ExternalMentor, 'id'>) => api.post<ExternalMentor>('/mentors/external', data),
  updateExternal: (id: number, data: Partial<ExternalMentor>) => api.put<ExternalMentor>(`/mentors/external/${id}`, data),
  deleteExternal: (id: number) => api.delete(`/mentors/external/${id}`),
};

export const studentService = {
  getAll: () => api.get<Student[]>('/students'),
  create: (data: Omit<Student, 'id'>) => api.post<Student>('/students', data),
  update: (id: number, data: Partial<Student>) => api.put<Student>(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

export const internshipService = {
  getAll: () => api.get<Internship[]>('/internships'),
  create: (data: Omit<Internship, 'id'>) => api.post<Internship>('/internships', data),
  update: (id: number, data: Partial<Internship>) => api.put<Internship>(`/internships/${id}`, data),
  delete: (id: number) => api.delete(`/internships/${id}`),
  enrollStudent: (data: { studentId: number; internshipId: number }) => 
    api.post<StudentInternship>('/internships/enroll', data),
};

export default api;