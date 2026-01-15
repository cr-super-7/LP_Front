// Progress Interfaces

export interface LessonProgress {
  lessonId: string;
  lesson?: {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
    [key: string]: any;
  };
  progress: number; // 0-100
  completedAt?: string;
  updatedAt: string;
}

export interface CourseProgress {
  courseId: string;
  course?: {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
    [key: string]: any;
  };
  lessons: LessonProgress[];
  overallProgress: number; // 0-100
  completedLessons: number;
  totalLessons: number;
  updatedAt: string;
}

export interface UpdateProgressRequest {
  progress: number; // 0-100
}

export interface ProgressResponse {
  message?: string;
  progress: LessonProgress | CourseProgress;
}

export interface ProgressesResponse {
  progress: CourseProgress[];
}

export interface ProgressState {
  progress: CourseProgress[];
  currentProgress: CourseProgress | null;
  isLoading: boolean;
  error: string | null;
}
