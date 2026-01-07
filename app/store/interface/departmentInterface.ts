// Department Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface University {
  _id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  createdAt: string;
  __v?: number;
}

export interface College {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  createdAt: string;
  university: University;
  __v?: number;
}

export interface Department {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  createdAt: string;
  college: College;
  __v?: number;
}

export interface DepartmentsResponse {
  departments: Department[];
}

export interface DepartmentResponse {
  message?: string;
  department: Department;
}

export interface DepartmentState {
  departments: Department[];
  currentDepartment: Department | null;
  isLoading: boolean;
  error: string | null;
}

