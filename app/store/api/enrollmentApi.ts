import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Enrollment,
  EnrollmentResponse,
  EnrollmentsResponse,
  CreateEnrollmentRequest,
} from "../interface/enrollmentInterface";
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

const enrollInCourse = async (
  enrollmentData: CreateEnrollmentRequest,
  dispatch: AppDispatch
): Promise<Enrollment> => {
  try {
    const { data } = await api.post<EnrollmentResponse>("/enrollments", enrollmentData);

    const enrollment = (data.enrollment || data) as Enrollment;
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getMyEnrollments = async (dispatch: AppDispatch): Promise<Enrollment[]> => {
  try {
    const { data } = await api.get<EnrollmentsResponse>("/enrollments/my");

    const enrollments = data.enrollments || [];
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getEnrollmentById = async (
  enrollmentId: string,
  dispatch: AppDispatch
): Promise<Enrollment> => {
  try {
    const { data } = await api.get<EnrollmentResponse>(`/enrollments/${enrollmentId}`);

    const enrollment = (data.enrollment || data) as Enrollment;
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const cancelEnrollment = async (
  enrollmentId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const { data } = await api.put<{ message: string }>(`/enrollments/${enrollmentId}/cancel`);

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
