// University Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface University {
  _id: string;
  name: string | LocalizedText;
  description: string | LocalizedText;
  location: string | LocalizedText;
  image: string;
  createdAt: string;
  __v?: number;
}

export interface UniversitiesResponse {
  universities: University[];
}

export interface UniversityResponse {
  message?: string;
  university: University;
}

export interface UniversityState {
  universities: University[];
  currentUniversity: University | null;
  isLoading: boolean;
  error: string | null;
}

