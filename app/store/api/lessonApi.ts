import api from "../utils/api";
import { setLoading, setError, setLessons, setCurrentLesson, addLesson, updateLesson as updateLessonAction, removeLesson } from "../slice/lessonSlice";
import { AppDispatch } from "../store";
import type { Lesson, LessonsResponse, LessonResponse, CreateLessonRequest, UpdateLessonRequest } from "../interface/lessonInterface";
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

const createLesson = async (lessonData: CreateLessonRequest, dispatch: AppDispatch): Promise<Lesson> => {
  try {
    dispatch(setLoading(true));
    
    const formData = new FormData();
    
    // Add required fields
    formData.append("title.ar", lessonData["title.ar"]);
    formData.append("title.en", lessonData["title.en"]);
    formData.append("course", lessonData.course);
    formData.append("videoUrl", lessonData.videoUrl);
    formData.append("duration", lessonData.duration.toString());
    
    // Add optional fields
    if (lessonData.isFree !== undefined) {
      formData.append("isFree", lessonData.isFree.toString());
    }
    
    const { data } = await api.post("/lessons", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const lessonResponse: LessonResponse = data;
    const lesson = (lessonResponse.lesson || data.result?.lesson || data) as Lesson;

    dispatch(addLesson(lesson));
    dispatch(setLoading(false));
    toast.success(lessonResponse.message || "Lesson created successfully");
    return lesson;
  } catch (error: unknown) {
    let errorMessage = "Failed to create lesson";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const getLessonsByCourse = async (courseId: string, dispatch: AppDispatch): Promise<Lesson[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/lessons/course/${courseId}`);

    // API returns: { lessons: Lesson[] }
    // Handle different response structures
    const lessonsResponse: LessonsResponse = data;
    const lessons = lessonsResponse.lessons || 
                    data.result?.lessons || 
                    (Array.isArray(data) ? data : data.lessons) || 
                    [];

    dispatch(setLessons(lessons));
    dispatch(setLoading(false));
    return lessons;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch lessons";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const updateLesson = async (lessonId: string, lessonData: UpdateLessonRequest, dispatch: AppDispatch): Promise<Lesson> => {
  try {
    dispatch(setLoading(true));
    
    const formData = new FormData();
    
    // Add fields that are provided
    if (lessonData["title.ar"]) formData.append("title.ar", lessonData["title.ar"]);
    if (lessonData["title.en"]) formData.append("title.en", lessonData["title.en"]);
    if (lessonData.videoUrl) formData.append("videoUrl", lessonData.videoUrl);
    if (lessonData.duration !== undefined) formData.append("duration", lessonData.duration.toString());
    if (lessonData.isFree !== undefined) formData.append("isFree", lessonData.isFree.toString());
    
    const { data } = await api.put(`/lessons/${lessonId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle different response structures
    const lessonResponse: LessonResponse = data;
    const lesson = (lessonResponse.lesson || data.result?.lesson || data) as Lesson;

    // Update lesson in Redux state
    dispatch(updateLessonAction(lesson));
    dispatch(setLoading(false));
    
    // Show success message
    const successMessage = lessonResponse.message || data?.message || data?.result?.message || "Lesson updated successfully";
    toast.success(successMessage);
    return lesson;
  } catch (error: unknown) {
    let errorMessage = "Failed to update lesson";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

const deleteLesson = async (lessonId: string, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));
    
    const { data } = await api.delete(`/lessons/${lessonId}`);

    // Remove lesson from Redux state
    dispatch(removeLesson(lessonId));
    dispatch(setLoading(false));
    
    // Show success message
    const successMessage = data?.message || data?.result?.message || "Lesson deleted successfully";
    toast.success(successMessage);
  } catch (error: unknown) {
    let errorMessage = "Failed to delete lesson";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    dispatch(setError(errorMessage));
    toast.error(errorMessage);
    dispatch(setLoading(false));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export { createLesson, getLessonsByCourse, updateLesson, deleteLesson };
