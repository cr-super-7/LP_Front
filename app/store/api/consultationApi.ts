import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Consultation,
  ConsultationResponse,
  ConsultationsResponse,
  CreateConsultationRequest,
  CancelConsultationRequest,
} from "../interface/consultationInterface";
import {
  setConsultationLoading,
  setConsultationError,
  setConsultations,
  setCurrentConsultation,
  addConsultation,
  updateConsultationState,
  removeConsultation,
} from "../slice/consultationSlice";
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
 * Create a new consultation
 * 
 * @param consultationData - Consultation creation data
 * @param dispatch - Redux dispatch
 * @returns Created consultation
 */
const createConsultation = async (
  consultationData: CreateConsultationRequest,
  dispatch: AppDispatch
): Promise<Consultation> => {
  try {
    dispatch(setConsultationLoading(true));
    
    const { data } = await api.post<ConsultationResponse>("/consultations", consultationData);

    const consultation = (data.consultation || data) as Consultation;
    
    // Update Redux store
    dispatch(addConsultation(consultation));
    dispatch(setConsultationLoading(false));
    
    toast.success(data.message || "Consultation booked successfully");
    return consultation;
  } catch (error: unknown) {
    let errorMessage = "Failed to book consultation";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setConsultationError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get my consultations with optional filters
 * 
 * @param status - Optional status filter
 * @param type - Optional type filter
 * @param dispatch - Redux dispatch
 * @returns Array of consultations
 */
const getMyConsultations = async (
  status?: string,
  type?: string,
  dispatch?: AppDispatch
): Promise<Consultation[]> => {
  try {
    if (dispatch) dispatch(setConsultationLoading(true));
    
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (type) queryParams.append("type", type);
    const queryString = queryParams.toString();
    const url = `/consultations/my${queryString ? `?${queryString}` : ""}`;

    const { data } = await api.get<ConsultationsResponse>(url);

    const consultations = data.consultations || [];
    
    // Update Redux store
    if (dispatch) {
      dispatch(setConsultations(consultations));
    }
    
    return consultations;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch consultations";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    if (dispatch) dispatch(setConsultationError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get consultation by ID
 * 
 * @param consultationId - Consultation ID
 * @param dispatch - Redux dispatch
 * @returns Consultation details
 */
const getConsultationById = async (
  consultationId: string,
  dispatch: AppDispatch
): Promise<Consultation> => {
  try {
    dispatch(setConsultationLoading(true));
    
    const { data } = await api.get<ConsultationResponse>(`/consultations/${consultationId}`);

    const consultation = (data.consultation || data) as Consultation;
    
    // Update Redux store
    dispatch(setCurrentConsultation(consultation));
    
    return consultation;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch consultation";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setConsultationError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * End a consultation
 * 
 * @param consultationId - Consultation ID
 * @param dispatch - Redux dispatch
 */
const endConsultation = async (
  consultationId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(setConsultationLoading(true));
    
    const { data } = await api.post<{ message: string }>(`/consultations/${consultationId}/end`);

    dispatch(setConsultationLoading(false));
    toast.success(data.message || "Consultation ended successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to end consultation";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setConsultationError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Cancel a consultation
 * 
 * @param consultationId - Consultation ID
 * @param cancelData - Optional cancellation data
 * @param dispatch - Redux dispatch
 */
const cancelConsultation = async (
  consultationId: string,
  cancelData?: CancelConsultationRequest,
  dispatch?: AppDispatch
): Promise<void> => {
  try {
    if (dispatch) dispatch(setConsultationLoading(true));
    
    const { data } = await api.post<{ message: string }>(
      `/consultations/${consultationId}/cancel`,
      cancelData || {}
    );

    // Update Redux store - remove cancelled consultation
    if (dispatch) {
      dispatch(removeConsultation(consultationId));
      dispatch(setConsultationLoading(false));
    }
    
    toast.success(data.message || "Consultation cancelled successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to cancel consultation";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    if (dispatch) dispatch(setConsultationError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  createConsultation,
  getMyConsultations,
  getConsultationById,
  endConsultation,
  cancelConsultation,
};
