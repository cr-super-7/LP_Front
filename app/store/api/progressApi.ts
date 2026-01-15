import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  LessonProgress,
  CourseProgress,
  ProgressResponse,
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
    toast.success(data.message || "Progress updated successfully");
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getCourseProgress = async (
  courseId: string,
  dispatch: AppDispatch
): Promise<CourseProgress> => {
  try {
    const { data } = await api.get<ProgressResponse>(`/progress/course/${courseId}`);

    const progress = (data.progress || data) as CourseProgress;
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

const getMyProgress = async (dispatch: AppDispatch): Promise<CourseProgress[]> => {
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
