// College Interfaces

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

export interface CollegesResponse {
  colleges: College[];
}

export interface CollegeResponse {
  message?: string;
  college: College;
}

export interface CollegeState {
  colleges: College[];
  currentCollege: College | null;
  isLoading: boolean;
  error: string | null;
}

