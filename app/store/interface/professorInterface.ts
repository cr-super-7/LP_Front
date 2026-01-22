export interface LocalizedText {
  ar: string;
  en: string;
}

export interface ProfessorUser {
  _id: string;
  email: string;
  phone?: string | null;
  role?: string;
  profilePicture?: string | null;
  location?: string | null;
  bio?: string | null;
}

export interface Achievement {
  _id: string;
  ar: string;
  en: string;
}

export interface Professor {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  vision: LocalizedText;
  message: LocalizedText;
  user: ProfessorUser;
  image?: string | null;
  achievements?: Achievement[];
  consultationPrice: number;
  currency: string;
  isAvailable: boolean;
  rating: number;
  totalReviews?: number;
  totalConsultations: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ProfessorsResponse {
  message?: string;
  professors: Professor[];
}
