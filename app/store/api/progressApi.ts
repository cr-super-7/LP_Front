import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  LessonProgress,
  CourseProgress,
  ProgressResponse,
  CourseProgressResponse,
  ProgressesResponse,
  UpdateProgressRequest,
  OverallProgressResponse,
  OverallProgressSummary,
  OverallCourseProgress,
  LessonProgressResponse,
  LessonProgressData,
} from "../interface/progressInterface";
import {
  setProgressLoading,
  setProgressError,
  setProgress,
  setCourseProgress,
  updateLessonProgressState,
  setOverallProgress,
} from "../slice/progressSlice";
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
  dispatch: AppDispatch
): Promise<LessonProgress> => {
  try {
    const { data } = await api.put<ProgressResponse>(
      `/progress/lesson/${lessonId}`,
      progressData
    );

    const progress = (data.progress || data) as LessonProgress;
    
    // Update Redux store
    dispatch(updateLessonProgressState(progress));
    
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
  dispatch: AppDispatch
): Promise<CourseProgress> => {
  try {
    dispatch(setProgressLoading(true));
    
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
    
    // Update Redux store
    dispatch(setCourseProgress(progress));
    
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
    
    dispatch(setProgressError(errorMessage));
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
const getMyProgress = async (dispatch: AppDispatch): Promise<LessonProgress[]> => {
  try {
    dispatch(setProgressLoading(true));
    
    const { data } = await api.get<ProgressesResponse>("/progress/my");

    const progress = data.progress || [];
    
    // Update Redux store
    dispatch(setProgress(progress));
    
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
    
    dispatch(setProgressError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get lesson progress for a specific lesson
 * 
 * @param lessonId - The lesson ID
 * @param dispatch - Redux dispatch
 * @returns LessonProgressData
 */
const getLessonProgress = async (
  lessonId: string,
  dispatch: AppDispatch
): Promise<LessonProgressData> => {
  try {
    dispatch(setProgressLoading(true));
    
    const { data } = await api.get<LessonProgressResponse>(`/progress/lesson/${lessonId}`);
    
    dispatch(setProgressLoading(false));
    
    return data.data;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch lesson progress";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setProgressLoading(false));
    console.error(errorMessage);
    
    // Return default progress instead of throwing
    return {
      lesson: { _id: lessonId, title: "" },
      progress: {
        progress: 0,
        completed: false,
        completedAt: null,
        watchTime: 0,
        lastWatchedAt: null,
      },
    };
  }
};

/**
 * Get overall progress summary for all enrolled courses
 * 
 * @param dispatch - Redux dispatch
 * @returns { summary: OverallProgressSummary, courses: OverallCourseProgress[] }
 */
const getMyOverallProgress = async (
  dispatch: AppDispatch
): Promise<{ summary: OverallProgressSummary; courses: OverallCourseProgress[] }> => {
  try {
    dispatch(setProgressLoading(true));
    
    const { data } = await api.get<OverallProgressResponse>("/progress/my/overall");
    
    // Update Redux store
    dispatch(setOverallProgress(data.data));
    
    return data.data;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch overall progress";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setProgressError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  updateLessonProgress,
  getCourseProgress,
  getMyProgress,
  getLessonProgress,
  getMyOverallProgress,
};
