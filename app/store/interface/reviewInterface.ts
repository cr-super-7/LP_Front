// Review Interfaces

export interface User {
  _id: string;
  email: string;
  phone?: string;
  role: string;
}

export interface Lesson {
  _id: string;
  title: {
    ar: string;
    en: string;
  };
  course: string;
  videoUrl: string;
  duration: number;
  isFree: boolean;
  status: string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Review {
  _id: string;
  user: User;
  course: string | null;
  lesson: Lesson | null;
  teacher: string | null;
  rate: number;
  createdAt: string;
  __v?: number;
}

export interface ReviewsResponse {
  reviews: Review[];
}

export interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateCourseReviewRequest {
  rate: number;
}

export interface CreateLessonReviewRequest {
  rate: number;
}