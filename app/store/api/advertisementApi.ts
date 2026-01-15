import api from "../utils/api";
import {
  setLoading,
  setError,
  setAdvertisements,
  setCurrentAdvertisement,
  addAdvertisement,
  updateAdvertisement as updateAdvertisementAction,
  removeAdvertisement,
} from "../slice/advertisementSlice";
import { AppDispatch } from "../store";
import type {
  Advertisement,
  AdvertisementResponse,
  AdvertisementsResponse,
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
} from "../interface/advertisementInterface";
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

const createAdvertisement = async (
  advertisementData: CreateAdvertisementRequest,
  dispatch: AppDispatch
): Promise<Advertisement> => {
  try {
    dispatch(setLoading(true));
    const formData = new FormData();

    // Add required fields
    formData.append("image", advertisementData.image);
    formData.append("description.ar", advertisementData["description.ar"]);
    formData.append("description.en", advertisementData["description.en"]);
    formData.append("advertisementType", advertisementData.advertisementType);

    const { data } = await api.post<AdvertisementResponse>("/advertisements", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const advertisement = (data.advertisement || data) as Advertisement;
    dispatch(addAdvertisement(advertisement));
    dispatch(setLoading(false));
    
    return advertisement;
  } catch (error: unknown) {
    let errorMessage = "Failed to create advertisement";
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

const getAdvertisements = async (
  advertisementType?: string,
  dispatch?: AppDispatch
): Promise<Advertisement[]> => {
  try {
    if (dispatch) dispatch(setLoading(true));
    const queryParams = advertisementType ? `?advertisementType=${advertisementType}` : "";
    const { data } = await api.get<AdvertisementsResponse>(`/advertisements${queryParams}`);

    const advertisements =
      data.advertisements || (Array.isArray(data) ? data : []) || [];
    if (dispatch) {
      dispatch(setAdvertisements(advertisements));
    }
    return advertisements;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch advertisements";
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
    }
    throw new Error(errorMessage);
  } finally {
    if (dispatch) dispatch(setLoading(false));
  }
};

const getAdvertisementById = async (
  advertisementId: string,
  dispatch: AppDispatch
): Promise<Advertisement> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get<AdvertisementResponse>(`/advertisements/${advertisementId}`);

    const advertisement = (data.advertisement || data) as Advertisement;
    dispatch(setCurrentAdvertisement(advertisement));
    dispatch(setLoading(false));
    return advertisement;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch advertisement";
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

const updateAdvertisement = async (
  advertisementId: string,
  advertisementData: UpdateAdvertisementRequest,
  dispatch: AppDispatch
): Promise<Advertisement> => {
  try {
    dispatch(setLoading(true));

    const formData = new FormData();

    // Add fields that are provided
    if (advertisementData.image) {
      formData.append("image", advertisementData.image);
    }
    if (advertisementData["description.ar"]) {
      formData.append("description.ar", advertisementData["description.ar"]);
    }
    if (advertisementData["description.en"]) {
      formData.append("description.en", advertisementData["description.en"]);
    }
    if (advertisementData.advertisementType) {
      formData.append("advertisementType", advertisementData.advertisementType);
    }

    const { data } = await api.put<AdvertisementResponse>(
      `/advertisements/${advertisementId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const advertisement = (data.advertisement || data) as Advertisement;
    dispatch(updateAdvertisementAction(advertisement));
    dispatch(setLoading(false));
    toast.success(data.message || "Advertisement updated successfully");
    return advertisement;
  } catch (error: unknown) {
    let errorMessage = "Failed to update advertisement";
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

const getMyAdvertisements = async (dispatch: AppDispatch): Promise<Advertisement[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get<AdvertisementsResponse>("/advertisements/my");

    const advertisements =
      data.advertisements || (Array.isArray(data) ? data : []) || [];
    dispatch(setAdvertisements(advertisements));
    dispatch(setLoading(false));
    return advertisements;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch my advertisements";
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

const deleteAdvertisement = async (
  advertisementId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(setLoading(true));
    await api.delete(`/advertisements/${advertisementId}`);
    dispatch(removeAdvertisement(advertisementId));
    dispatch(setLoading(false));
    toast.success("Advertisement deleted successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to delete advertisement";
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
  createAdvertisement,
  getAdvertisements,
  getMyAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
};
