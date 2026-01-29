import api from "../utils/api";
import {
  setLoading,
  setError,
  setPrivateLessons,
  setCurrentPrivateLesson,
  addPrivateLesson,
  updatePrivateLesson as updatePrivateLessonAction,
  removePrivateLesson,
} from "../slice/privateLessonSlice";
import { AppDispatch } from "../store";
import type {
  PrivateLesson,
  PrivateLessonsResponse,
  PrivateLessonResponse,
  CreatePrivateLessonRequest,
  UpdatePrivateLessonRequest,
  ScheduleItem,
} from "../interface/privateLessonInterface";
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

const createPrivateLesson = async (
  lessonData: CreatePrivateLessonRequest,
  dispatch: AppDispatch
): Promise<PrivateLesson> => {
  try {
    dispatch(setLoading(true));

    const formData = new FormData();

    // Add required fields
    formData.append("lessonType", lessonData.lessonType);
    formData.append("instructorName.ar", lessonData["instructorName.ar"]);
    formData.append("instructorName.en", lessonData["instructorName.en"]);
    formData.append("locationUrl", lessonData.locationUrl);
    formData.append("lessonName.ar", lessonData["lessonName.ar"]);
    formData.append("lessonName.en", lessonData["lessonName.en"]);
    formData.append("lessonLevel", lessonData.lessonLevel);
    formData.append("price", lessonData.price.toString());
    formData.append("currency", lessonData.currency);
    formData.append("description.ar", lessonData["description.ar"]);
    formData.append("description.en", lessonData["description.en"]);

    // Add department only if lessonType is "department"
    if (lessonData.lessonType === "department" && lessonData.department) {
      formData.append("department", lessonData.department);
    }

    // Add optional fields
    if (lessonData.instructorImage) {
      formData.append("instructorImage", lessonData.instructorImage);
    }
    if (lessonData["jobTitle.ar"]) {
      formData.append("jobTitle.ar", lessonData["jobTitle.ar"]);
    }
    if (lessonData["jobTitle.en"]) {
      formData.append("jobTitle.en", lessonData["jobTitle.en"]);
    }
    if (lessonData.courseHours !== undefined) {
      formData.append("courseHours", lessonData.courseHours.toString());
    }
    if (lessonData.schedule && lessonData.schedule.length > 0) {
      formData.append("schedule", JSON.stringify(lessonData.schedule));
    }
    if (lessonData.isPublished !== undefined) {
      formData.append("isPublished", lessonData.isPublished.toString());
    }

    const { data } = await api.post("/private-lessons", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // API response shape:
    // { message: string, privateLesson: PrivateLesson }
    const lessonResponse: PrivateLessonResponse = data;
    const privateLesson = (lessonResponse.privateLesson || data.result?.privateLesson || data) as PrivateLesson;

    dispatch(addPrivateLesson(privateLesson));
    dispatch(setLoading(false));
   
    return privateLesson;
  } catch (error: unknown) {
    let errorMessage = "Failed to create private lesson";
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

// Parameters for getPrivateLessons
interface GetPrivateLessonsParams {
  sort?: string; // supports "popular" for popularity sorting
}

const getPrivateLessons = async (
  dispatch?: AppDispatch,
  params?: GetPrivateLessonsParams
): Promise<PrivateLesson[]> => {
  try {
    if (dispatch) dispatch(setLoading(true));

    // Build query params - supports sort=popular
    const queryParams: Record<string, string> = {};
    if (params?.sort) queryParams.sort = params.sort;

    const { data } = await api.get<PrivateLessonsResponse>("/private-lessons", {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    });

    // API response shape: { privateLessons: PrivateLesson[] }
    const lessons: PrivateLesson[] = Array.isArray(data.privateLessons)
      ? data.privateLessons
      : (data as unknown as { result?: { privateLessons?: PrivateLesson[] } }).result?.privateLessons || (Array.isArray(data) ? (data as unknown as PrivateLesson[]) : []);

    if (dispatch) {
      dispatch(setPrivateLessons(lessons));
      dispatch(setLoading(false));
    }
    return lessons;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch private lessons";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    if (dispatch) {
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
    }
    throw new Error(errorMessage);
  } finally {
    if (dispatch) dispatch(setLoading(false));
  }
};

const getMyPrivateLessons = async (dispatch: AppDispatch): Promise<PrivateLesson[]> => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.get("/private-lessons/my");

    // API response shape: { privateLessons: PrivateLesson[] }
    const lessons: PrivateLesson[] = Array.isArray(data.privateLessons)
      ? data.privateLessons
      : data.result?.privateLessons || [];

    dispatch(setPrivateLessons(lessons));
    dispatch(setLoading(false));
    return lessons;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch private lessons";
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

const getPrivateLessonById = async (lessonId: string, dispatch: AppDispatch): Promise<PrivateLesson> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/private-lessons/${lessonId}`);

    // API response shape:
    // { message: string, privateLesson: PrivateLesson }
    const lessonResponse: PrivateLessonResponse = data;
    const privateLesson = (lessonResponse.privateLesson || data.result?.privateLesson || data) as PrivateLesson;

    dispatch(setCurrentPrivateLesson(privateLesson));
    dispatch(setLoading(false));
    return privateLesson;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch private lesson";
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

// Quiet fetch (no global loading state)
const getPrivateLessonByIdQuiet = async (lessonId: string): Promise<PrivateLesson> => {
  const { data } = await api.get(`/private-lessons/${lessonId}`);
  const lessonResponse: PrivateLessonResponse = data;
  return (lessonResponse.privateLesson || data.result?.privateLesson || data) as PrivateLesson;
};

// Schedule management (Teacher only - owner)
const addPrivateLessonScheduleSlot = async (
  lessonId: string,
  slot: ScheduleItem,
  dispatch: AppDispatch
): Promise<PrivateLesson> => {
  try {
    await api.post(`/private-lessons/${lessonId}/schedule`, { slot });
    const updated = await getPrivateLessonByIdQuiet(lessonId);
    dispatch(setCurrentPrivateLesson(updated));
    toast.success("Schedule updated");
    return updated;
  } catch (error: unknown) {
    let errorMessage = "Failed to add schedule slot";
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

const removePrivateLessonScheduleSlot = async (
  lessonId: string,
  slot: ScheduleItem,
  dispatch: AppDispatch
): Promise<PrivateLesson> => {
  try {
    await api.delete(`/private-lessons/${lessonId}/schedule`, {
      params: { date: slot.date, time: slot.time, duration: slot.duration },
    });
    const updated = await getPrivateLessonByIdQuiet(lessonId);
    dispatch(setCurrentPrivateLesson(updated));
    toast.success("Schedule updated");
    return updated;
  } catch (error: unknown) {
    let errorMessage = "Failed to remove schedule slot";
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

const updatePrivateLesson = async (
  lessonId: string,
  lessonData: UpdatePrivateLessonRequest,
  dispatch: AppDispatch
): Promise<PrivateLesson> => {
  try {
    dispatch(setLoading(true));

    const formData = new FormData();

    // Add fields that are provided
    if (lessonData.lessonType) formData.append("lessonType", lessonData.lessonType);
    if (lessonData["instructorName.ar"]) formData.append("instructorName.ar", lessonData["instructorName.ar"]);
    if (lessonData["instructorName.en"]) formData.append("instructorName.en", lessonData["instructorName.en"]);
    if (lessonData.locationUrl) formData.append("locationUrl", lessonData.locationUrl);
    if (lessonData["jobTitle.ar"]) formData.append("jobTitle.ar", lessonData["jobTitle.ar"]);
    if (lessonData["jobTitle.en"]) formData.append("jobTitle.en", lessonData["jobTitle.en"]);
    if (lessonData["lessonName.ar"]) formData.append("lessonName.ar", lessonData["lessonName.ar"]);
    if (lessonData["lessonName.en"]) formData.append("lessonName.en", lessonData["lessonName.en"]);
    if (lessonData.lessonLevel) formData.append("lessonLevel", lessonData.lessonLevel);
    if (lessonData.price !== undefined) formData.append("price", lessonData.price.toString());
    if (lessonData.currency) formData.append("currency", lessonData.currency);
    if (lessonData["description.ar"]) formData.append("description.ar", lessonData["description.ar"]);
    if (lessonData["description.en"]) formData.append("description.en", lessonData["description.en"]);
    if (lessonData.instructorImage) formData.append("instructorImage", lessonData.instructorImage);
    // Add department only if lessonType is "department"
    if (lessonData.lessonType === "department" && lessonData.department) {
      formData.append("department", lessonData.department);
    }
    if (lessonData.courseHours !== undefined) formData.append("courseHours", lessonData.courseHours.toString());
    if (lessonData.schedule && lessonData.schedule.length > 0) {
      formData.append("schedule", JSON.stringify(lessonData.schedule));
    }
    if (lessonData.isPublished !== undefined) {
      formData.append("isPublished", lessonData.isPublished.toString());
    }

    const { data } = await api.put(`/private-lessons/${lessonId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const lessonResponse: PrivateLessonResponse = data;
    const privateLesson = (lessonResponse.privateLesson || data.result?.privateLesson || data) as PrivateLesson;

    dispatch(updatePrivateLessonAction(privateLesson));
    dispatch(setLoading(false));
    toast.success(lessonResponse.message || "Private lesson updated successfully");
    return privateLesson;
  } catch (error: unknown) {
    let errorMessage = "Failed to update private lesson";
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

const deletePrivateLesson = async (lessonId: string, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.delete(`/private-lessons/${lessonId}`);

    dispatch(removePrivateLesson(lessonId));
    dispatch(setLoading(false));
    toast.success(data.message || "Private lesson deleted successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to delete private lesson";
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

export {
  createPrivateLesson,
  getPrivateLessons,
  getMyPrivateLessons,
  getPrivateLessonById,
  getPrivateLessonByIdQuiet,
  addPrivateLessonScheduleSlot,
  removePrivateLessonScheduleSlot,
  updatePrivateLesson,
  deletePrivateLesson,
};
