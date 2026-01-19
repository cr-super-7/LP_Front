import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  LessonProgress,
  CourseProgress,
  ProgressResponse,
  CourseProgressResponse,
  ProgressesResponse,
  UpdateProgressRequest,
} from "../interface/progressInterface";
import toast from "react-hot-toast";

// Define error response interface
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Update lesson progress - this also increments playCount for lesson and course
 * and updates popularityScore for the course
 * 
 * @param lessonId - The lesson ID
 * @param progressData - { progress?: number (0-100), watchTime?: number (seconds) }
 * @param dispatch - Redux dispatch
 * @returns LessonProgress
 */
const updateLessonProgress = async (
  lessonId: string,
  progressData: UpdateProgressRequest,
  _dispatch: AppDispatch
): Promise<LessonProgress> => {
  try {
    const { data } = await api.put<ProgressResponse>(
      `/progress/lesson/${lessonId}`,
      progressData
    );

    const progress = (data.progress || data) as LessonProgress;
    // Don't show toast for progress updates as they happen frequently
    return progress;
  } catch (error: unknown) {
    let errorMessage = "Failed to update progress";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    // Silent fail for progress updates
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get course progress with lessons
 * 
 * @param courseId - The course ID
 * @param dispatch - Redux dispatch
 * @returns CourseProgress with lessons array
 */
const getCourseProgress = async (
  courseId: string,
  _dispatch: AppDispatch
): Promise<CourseProgress> => {
  try {
    const { data } = await api.get<CourseProgressResponse>(`/progress/course/${courseId}`);

    // Transform response to CourseProgress format
    const progress: CourseProgress = {
      course: data.course,
      enrollment: data.enrollment,
      overallProgress: data.overallProgress || 0,
      completedLessons: data.completedLessons || 0,
      totalLessons: data.totalLessons || 0,
      lessons: data.lessons || [],
    };
    
    return progress;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch course progress";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get all my progress records
 * 
 * @param dispatch - Redux dispatch
 * @returns Array of LessonProgress
 */
const getMyProgress = async (_dispatch: AppDispatch): Promise<LessonProgress[]> => {
  try {
    const { data } = await api.get<ProgressesResponse>("/progress/my");

    const progress = data.progress || [];
    return progress;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch progress";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  updateLessonProgress,
  getCourseProgress,
  getMyProgress,
};
