// Progress Interfaces

export interface LessonProgress {
  _id?: string;
  student?: string;
  course?: string;
  lesson?: string | {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
    duration?: number;
    isFree?: boolean;
  };
  enrollment?: string;
  progress: number; // 0-100
  completed?: boolean;
  completedAt?: string | null;
  lastWatchedAt?: string;
  watchTime?: number; // seconds
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseProgressLesson {
  lesson: {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
    duration?: number;
    isFree?: boolean;
  };
  progress: {
    progress: number;
    completed: boolean;
    completedAt?: string | null;
    lastWatchedAt?: string;
    watchTime?: number;
  } | null;
}

export interface CourseProgress {
  _id?: string;
  course?: {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
  };
  enrollment?: {
    enrolledAt: string;
    status: string;
  } | null;
  overallProgress: number; // 0-100
  completedLessons: number;
  totalLessons: number;
  lessons?: CourseProgressLesson[];
  updatedAt?: string;
}

export interface UpdateProgressRequest {
  progress?: number; // 0-100
  watchTime?: number; // seconds
}

export interface ProgressResponse {
  message?: string;
  progress: LessonProgress;
}

export interface CourseProgressResponse {
  message?: string;
  course?: {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
  };
  enrollment?: {
    enrolledAt: string;
    status: string;
  } | null;
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  lessons?: CourseProgressLesson[];
}

export interface ProgressesResponse {
  message?: string;
  progress: LessonProgress[];
}

export interface ProgressState {
  progress: LessonProgress[];
  currentCourseProgress: CourseProgress | null;
  isLoading: boolean;
  error: string | null;
}
