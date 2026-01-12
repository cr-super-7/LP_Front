// Private Lesson Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface ScheduleItem {
  date: string; // ISO date string
  time: string; // HH:MM format
  duration: number; // hours
}

export interface PrivateLesson {
  _id: string;
  instructor: string;
  instructorImage?: string;
  instructorName: LocalizedText;
  locationUrl: string;
  jobTitle?: LocalizedText;
  lessonType: "department" | "professional";
  department?: {
    _id: string;
    name: LocalizedText;
    college?: {
      _id: string;
      name: LocalizedText;
      university?: {
        _id: string;
        name: LocalizedText;
      };
    };
  };
  lessonName: LocalizedText;
  lessonLevel: "beginner" | "intermediate" | "advanced";
  price: number;
  currency: "SAR" | "EGP";
  courseHours?: number;
  description: LocalizedText;
  schedule?: ScheduleItem[];
  isPublished?: boolean;
  status?: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePrivateLessonRequest {
  lessonType: "department" | "professional";
  instructorImage?: File;
  "instructorName.ar": string;
  "instructorName.en": string;
  locationUrl: string;
  "jobTitle.ar"?: string;
  "jobTitle.en"?: string;
  department?: string; // Required only if lessonType === "department"
  "lessonName.ar": string;
  "lessonName.en": string;
  lessonLevel: "beginner" | "intermediate" | "advanced";
  price: number;
  currency: "SAR" | "EGP";
  courseHours?: number;
  "description.ar": string;
  "description.en": string;
  schedule?: ScheduleItem[];
  isPublished?: boolean;
}

export interface UpdatePrivateLessonRequest extends Partial<CreatePrivateLessonRequest> {}

export interface PrivateLessonsResponse {
  message?: string;
  privateLessons: PrivateLesson[];
}

export interface PrivateLessonResponse {
  message?: string;
  privateLesson: PrivateLesson;
}

export interface PrivateLessonState {
  privateLessons: PrivateLesson[];
  currentPrivateLesson: PrivateLesson | null;
  isLoading: boolean;
  error: string | null;
}
