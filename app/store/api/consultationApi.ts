import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Consultation,
  ConsultationResponse,
  ConsultationsResponse,
  CreateConsultationRequest,
  CancelConsultationRequest,
} from "../interface/consultationInterface";
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

const createConsultation = async (
  consultationData: CreateConsultationRequest,
  dispatch: AppDispatch
): Promise<Consultation> => {
  try {
    const { data } = await api.post<ConsultationResponse>("/consultations", consultationData);

    const consultation = (data.consultation || data) as Consultation;
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getMyConsultations = async (
  status?: string,
  type?: string,
  dispatch?: AppDispatch
): Promise<Consultation[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (type) queryParams.append("type", type);
    const queryString = queryParams.toString();
    const url = `/consultations/my${queryString ? `?${queryString}` : ""}`;

    const { data } = await api.get<ConsultationsResponse>(url);

    const consultations = data.consultations || [];
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getConsultationById = async (
  consultationId: string,
  dispatch: AppDispatch
): Promise<Consultation> => {
  try {
    const { data } = await api.get<ConsultationResponse>(`/consultations/${consultationId}`);

    const consultation = (data.consultation || data) as Consultation;
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const endConsultation = async (
  consultationId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const { data } = await api.post<{ message: string }>(`/consultations/${consultationId}/end`);

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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const cancelConsultation = async (
  consultationId: string,
  cancelData?: CancelConsultationRequest,
  dispatch?: AppDispatch
): Promise<void> => {
  try {
    const { data } = await api.post<{ message: string }>(
      `/consultations/${consultationId}/cancel`,
      cancelData || {}
    );

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
