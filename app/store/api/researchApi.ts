import api from "../utils/api";
import {
  setLoading,
  setError,
  setResearches,
  setCurrentResearch,
  addResearch,
  updateResearch as updateResearchAction,
  removeResearch,
} from "../slice/researchSlice";
import { AppDispatch } from "../store";
import type {
  Research,
  ResearchesResponse,
  ResearchResponse,
  CreateResearchRequest,
  UpdateResearchRequest,
} from "../interface/researchInterface";
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

const createResearch = async (
  researchData: CreateResearchRequest,
  dispatch: AppDispatch
): Promise<Research> => {
  try {
    dispatch(setLoading(true));

    const formData = new FormData();

    // Add file only if provided (optional)
    if (researchData.file) {
      formData.append("file", researchData.file);
    }

    // Add required fields
    formData.append("researcherName.ar", researchData["researcherName.ar"]);
    formData.append("researcherName.en", researchData["researcherName.en"]);
    formData.append("title.ar", researchData["title.ar"]);
    formData.append("title.en", researchData["title.en"]);
    formData.append("description.ar", researchData["description.ar"]);
    formData.append("description.en", researchData["description.en"]);
    formData.append("researchType", researchData.researchType);

    // Add conditional fields
    if (researchData.researchType === "university" && researchData.department) {
      formData.append("department", researchData.department);
    }
    if (researchData.researchType === "others" && researchData.othersPlace) {
      formData.append("othersPlace", researchData.othersPlace);
    }

    const { data } = await api.post("/researches", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const researchResponse: ResearchResponse = data;
    const research = (researchResponse.research || data.result?.research || data) as Research;

    dispatch(addResearch(research));
    dispatch(setLoading(false));
    toast.success(researchResponse.message || "Research created successfully");
    return research;
  } catch (error: unknown) {
    let errorMessage = "Failed to create research";
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

const getMyResearches = async (dispatch: AppDispatch): Promise<Research[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/researches/my");

    const researchesResponse: ResearchesResponse = data;
    const researches = (researchesResponse.researches || data.result?.researches || []) as Research[];

    dispatch(setResearches(researches));
    dispatch(setLoading(false));
    return researches;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch researches";
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

const getResearchById = async (researchId: string, dispatch: AppDispatch): Promise<Research> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/researches/${researchId}`);

    // API response shape:
    // { message: string, research: Research }
    const researchResponse: ResearchResponse = data;
    const research = (researchResponse.research || data.result?.research || data) as Research;

    dispatch(setCurrentResearch(research));
    dispatch(setLoading(false));
    return research;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch research";
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

const updateResearch = async (
  researchId: string,
  researchData: UpdateResearchRequest,
  dispatch: AppDispatch
): Promise<Research> => {
  try {
    dispatch(setLoading(true));

    const formData = new FormData();

    // Add fields that are provided
    if (researchData.file) formData.append("file", researchData.file);
    if (researchData["researcherName.ar"]) formData.append("researcherName.ar", researchData["researcherName.ar"]);
    if (researchData["researcherName.en"]) formData.append("researcherName.en", researchData["researcherName.en"]);
    if (researchData["title.ar"]) formData.append("title.ar", researchData["title.ar"]);
    if (researchData["title.en"]) formData.append("title.en", researchData["title.en"]);
    if (researchData["description.ar"]) formData.append("description.ar", researchData["description.ar"]);
    if (researchData["description.en"]) formData.append("description.en", researchData["description.en"]);
    if (researchData.researchType) formData.append("researchType", researchData.researchType);
    if (researchData.researchType === "university" && researchData.department) {
      formData.append("department", researchData.department);
    }
    if (researchData.researchType === "others" && researchData.othersPlace) {
      formData.append("othersPlace", researchData.othersPlace);
    }

    const { data } = await api.put(`/researches/${researchId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const researchResponse: ResearchResponse = data;
    const research = (researchResponse.research || data.result?.research || data) as Research;

    dispatch(updateResearchAction(research));
    dispatch(setLoading(false));
    toast.success(researchResponse.message || "Research updated successfully");
    return research;
  } catch (error: unknown) {
    let errorMessage = "Failed to update research";
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

const deleteResearch = async (researchId: string, dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));

    const { data } = await api.delete(`/researches/${researchId}`);

    dispatch(removeResearch(researchId));
    dispatch(setLoading(false));
    toast.success(data.message || "Research deleted successfully");
  } catch (error: unknown) {
    let errorMessage = "Failed to delete research";
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
  createResearch,
  getMyResearches,
  getResearchById,
  updateResearch,
  deleteResearch,
};
