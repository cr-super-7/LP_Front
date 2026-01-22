export interface ProfessorUser {
  _id: string;
  email: string;
  phone?: string | null;
  role?: string;
  profilePicture?: string | null;
  location?: string | null;
  bio?: string | null;
}

export interface Professor {
  _id: string;
  user: ProfessorUser;
  specialization: string;
  bio: string;
  experience: number;
  consultationPrice: number;
  currency: string;
  isAvailable: boolean;
  rating: number;
  totalConsultations: number;
  createdAt: string;
}

export interface ProfessorsResponse {
  message?: string;
  professors: Professor[];
}
