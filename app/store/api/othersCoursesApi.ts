import api from "../utils/api";
import { setLoading, setError, setOthersCourses, setCurrentOthersCourse } from "../slice/othersCoursesSlice";
import { AppDispatch } from "../store";
import type { OthersCourse, OthersCoursesResponse, OthersCourseResponse } from "../interface/othersCoursesInterface";

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

// Note: keep file name for now, but API is for others-courses (backend)
const getOthersCourses = async (dispatch: AppDispatch): Promise<OthersCourse[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/others-courses");

    // API response shape (backend may vary by version):
    // { othersCourses: OthersCourse[] } | { othersCourse: OthersCourse[] }
    const othersPlacesResponse: OthersCoursesResponse = data;
    const othersCourses = othersPlacesResponse.othersCourses ||
                         othersPlacesResponse.othersCourse ||
                         data.result?.othersCourses ||
                         data.result?.othersCourse ||
                         [];

    dispatch(setOthersCourses(othersCourses));
    dispatch(setLoading(false));
    return othersCourses;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch others courses";
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

const getOthersCourseById = async (othersCourseId: string, dispatch: AppDispatch): Promise<OthersCourse> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/others-courses/${othersCourseId}`);

    // API response shape:
    // { message: string, othersCourse: OthersCourse }
    const othersPlaceResponse: OthersCourseResponse = data;
    const othersCourse = (othersPlaceResponse.othersCourse ||
      data.othersCourse ||
      data.result?.othersCourse ||
      data) as OthersCourse;

    dispatch(setCurrentOthersCourse(othersCourse));
    dispatch(setLoading(false));
    return othersCourse;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch others course";
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

export { getOthersCourses, getOthersCourseById };
