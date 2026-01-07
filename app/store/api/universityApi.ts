import api from "../utils/api";
import { setLoading, setError, setUniversities, setCurrentUniversity } from "../slice/universitySlice";
import { AppDispatch } from "../store";
import type { University, UniversitiesResponse, UniversityResponse } from "../interface/universityInterface";

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

const getUniversities = async (dispatch: AppDispatch): Promise<University[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/universities");

    // API response shape:
    // { universities: University[] }
    const universitiesResponse: UniversitiesResponse = data;
    const universities = universitiesResponse.universities || data.result?.universities || [];

    dispatch(setUniversities(universities));
    dispatch(setLoading(false));
    return universities;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch universities";
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

const getUniversityById = async (universityId: string, dispatch: AppDispatch): Promise<University> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/universities/${universityId}`);

    // API response shape:
    // { message: string, university: University }
    const universityResponse: UniversityResponse = data;
    const university = (universityResponse.university || data.result?.university || data) as University;

    dispatch(setCurrentUniversity(university));
    dispatch(setLoading(false));
    return university;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch university";
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

export { getUniversities, getUniversityById };

