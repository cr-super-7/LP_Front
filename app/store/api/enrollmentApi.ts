import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Enrollment,
  EnrollmentResponse,
  EnrollmentsResponse,
  CreateEnrollmentRequest,
} from "../interface/enrollmentInterface";
import {
  setEnrollmentLoading,
  setEnrollmentError,
  setEnrollments,
  setCurrentEnrollment,
  addEnrollment,
  removeEnrollment,
} from "../slice/enrollmentSlice";
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
 * Enroll in a course
 * 
 * @param enrollmentData - Enrollment data
 * @param dispatch - Redux dispatch
 * @returns Created enrollment
 */
const enrollInCourse = async (
  enrollmentData: CreateEnrollmentRequest,
  dispatch: AppDispatch
): Promise<Enrollment> => {
  try {
    dispatch(setEnrollmentLoading(true));
    
    const { data } = await api.post<EnrollmentResponse>("/enrollments", enrollmentData);

    const enrollment = (data.enrollment || data) as Enrollment;
    
    // Update Redux store
    dispatch(addEnrollment(enrollment));
    dispatch(setEnrollmentLoading(false));
    
    toast.success(data.message || "Enrolled successfully");
    return enrollment;
  } catch (error: unknown) {
    let errorMessage = "Failed to enroll in course";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setEnrollmentError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get my enrollments
 * 
 * @param dispatch - Redux dispatch
 * @returns Array of enrollments
 */
const getMyEnrollments = async (dispatch: AppDispatch): Promise<Enrollment[]> => {
  try {
    dispatch(setEnrollmentLoading(true));
    
    const { data } = await api.get<EnrollmentsResponse>("/enrollments/my");

    const enrollments = data.enrollments || [];
    
    // Update Redux store
    dispatch(setEnrollments(enrollments));
    
    return enrollments;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch enrollments";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setEnrollmentError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get enrollment by ID
 * 
 * @param enrollmentId - Enrollment ID
 * @param dispatch - Redux dispatch
 * @returns Enrollment details
 */
const getEnrollmentById = async (
  enrollmentId: string,
  dispatch: AppDispatch
): Promise<Enrollment> => {
  try {
    dispatch(setEnrollmentLoading(true));
    
    const { data } = await api.get<EnrollmentResponse>(`/enrollments/${enrollmentId}`);

    const enrollment = (data.enrollment || data) as Enrollment;
    
    // Update Redux store
    dispatch(setCurrentEnrollment(enrollment));
    
    return enrollment;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch enrollment";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setEnrollmentError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Cancel an enrollment
 * 
 * @param enrollmentId - Enrollment ID
 * @param dispatch - Redux dispatch
 */
const cancelEnrollment = async (
  enrollmentId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(setEnrollmentLoading(true));
    
    const { data } = await api.put<{ message: string }>(`/enrollments/${enrollmentId}/cancel`);

    // Update Redux store - remove cancelled enrollment
    dispatch(removeEnrollment(enrollmentId));
    dispatch(setEnrollmentLoading(false));
    
    toast.success(data.message || "Enrollment cancelled successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to cancel enrollment";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setEnrollmentError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentById,
  cancelEnrollment,
};
