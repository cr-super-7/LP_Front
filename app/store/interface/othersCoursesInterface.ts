// OthersCourses Interfaces

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface OthersCourse {
  _id: string;
  name: string | LocalizedText;
  description?: string | LocalizedText;
  location?: string | LocalizedText;
  image?: string;
  createdAt?: string;
  __v?: number;
}

export interface OthersCoursesResponse {
  othersCourses?: OthersCourse[];
  othersCourse?: OthersCourse[];
  message?: string;
}

export interface OthersCourseResponse {
  message?: string;
  othersCourse: OthersCourse;
}

export interface OthersCoursesState {
  othersCourses: OthersCourse[];
  currentOthersCourse: OthersCourse | null;
  isLoading: boolean;
  error: string | null;
}
