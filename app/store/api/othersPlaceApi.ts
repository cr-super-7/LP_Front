import api from "../utils/api";
import { setLoading, setError, setOthersPlaces, setCurrentOthersPlace } from "../slice/othersPlaceSlice";
import { AppDispatch } from "../store";
import type { OthersPlace, OthersPlacesResponse, OthersPlaceResponse } from "../interface/othersPlaceInterface";

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

const getOthersPlaces = async (dispatch: AppDispatch): Promise<OthersPlace[]> => {
  try {
    dispatch(setLoading(true));
    // Try /others-places endpoint first (most common REST API pattern)
    let data;
    try {
      const response = await api.get("/others-places");
      data = response.data;
    } catch {
      // Fallback to alternative endpoint
      try {
        const response = await api.get("/othersPlace");
        data = response.data;
      } catch {
        // Last fallback
        const response = await api.get("/others-places");
        data = response.data;
      }
    }

    // API response shape:
    // { othersPlaces: OthersPlace[] } or { othersPlace: OthersPlace[] }
    const othersPlacesResponse: OthersPlacesResponse = data;
    const othersPlaces = othersPlacesResponse.othersPlaces || 
                         othersPlacesResponse.othersPlace || 
                         data.result?.othersPlaces || 
                         data.result?.othersPlace || 
                         [];

    dispatch(setOthersPlaces(othersPlaces));
    dispatch(setLoading(false));
    return othersPlaces;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch others places";
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

const getOthersPlaceById = async (othersPlaceId: string, dispatch: AppDispatch): Promise<OthersPlace> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/others-places/${othersPlaceId}`).catch(async () => {
      return await api.get(`/othersPlace/${othersPlaceId}`);
    });

    // API response shape:
    // { message: string, othersPlace: OthersPlace }
    const othersPlaceResponse: OthersPlaceResponse = data;
    const othersPlace = (othersPlaceResponse.othersPlace || data.result?.othersPlace || data) as OthersPlace;

    dispatch(setCurrentOthersPlace(othersPlace));
    dispatch(setLoading(false));
    return othersPlace;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch others place";
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

export { getOthersPlaces, getOthersPlaceById };
