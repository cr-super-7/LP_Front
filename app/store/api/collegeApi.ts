import api from "../utils/api";
import { setLoading, setError, setColleges, setCurrentCollege } from "../slice/collegeSlice";
import { AppDispatch } from "../store";
import type { College, CollegesResponse, CollegeResponse } from "../interface/collegeInterface";

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

const getColleges = async (dispatch: AppDispatch): Promise<College[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/colleges");

    // API response shape:
    // { colleges: College[] }
    const collegesResponse: CollegesResponse = data;
    const colleges = collegesResponse.colleges || data.result?.colleges || [];

    dispatch(setColleges(colleges));
    dispatch(setLoading(false));
    return colleges;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch colleges";
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

const getCollegeById = async (collegeId: string, dispatch: AppDispatch): Promise<College> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/colleges/${collegeId}`);

    // API response shape:
    // { message: string, college: College }
    const collegeResponse: CollegeResponse = data;
    const college = (collegeResponse.college || data.result?.college || data) as College;

    dispatch(setCurrentCollege(college));
    dispatch(setLoading(false));
    return college;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch college";
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

export { getColleges, getCollegeById };

