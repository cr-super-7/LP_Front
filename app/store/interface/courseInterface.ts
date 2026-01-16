// Course Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface Course {
  _id: string;
  title: LocalizedText;
  description: LocalizedText;
  teacher: string;
  category: string;
  courseType: "university" | "others";
  department?: string;
  othersPlace?: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  currency: string;
  durationHours: number;
  totalLessons?: number;
  isPublished?: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCourseRequest {
  "title.ar": string;
  "title.en": string;
  "description.ar": string;
  "description.en": string;
  Teacher: string;
  category: string;
  courseType: "university" | "others";
  department?: string;
  othersPlace?: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  currency: string;
  durationHours: number;
  totalLessons?: number;
  isPublished?: boolean;
  thumbnail?: File;
}

export interface CoursesResponse {
  message?: string;
  courses: Course[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface CourseResponse {
  message?: string;
  course: Course;
}

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  department?: string;
  courseType?: "university" | "others";
  level?: "beginner" | "intermediate" | "advanced";
  teacher?: string;
}

export interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

