// Lesson Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

// Review interface for lessons
export interface LessonReview {
  _id: string;
  user: string;
  comment: string;
  rate: number;
  createdAt: string;
}

export interface Lesson {
  _id: string;
  course: string;
  title: LocalizedText;
  videoUrl: string;
  duration?: number;
  order?: number;
  isFree?: boolean;
  status?: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  // Play count (new)
  playCount?: number;
  // Reviews (new)
  reviews?: LessonReview[];
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLessonRequest {
  "title.ar": string;
  "title.en": string;
  course: string;
  videoUrl: File;
  duration: number;
  isFree?: boolean;
}

export interface UpdateLessonRequest {
  "title.ar"?: string;
  "title.en"?: string;
  videoUrl?: File;
  duration?: number;
  isFree?: boolean;
}

export interface LessonResponse {
  message?: string;
  lesson: Lesson;
}

export interface LessonsResponse {
  message?: string;
  lessons: Lesson[];
  total?: number;
}

export interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;
}
