import api from "../utils/api";
import { setLoading, setError, setReviews } from "../slice/reviewSlice";
import { AppDispatch } from "../store";
import type { Review, ReviewsResponse } from "../interface/reviewInterface";

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

const getLessonReviews = async (lessonId: string, dispatch: AppDispatch): Promise<Review[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/reviews/lesson/${lessonId}`);

    // Handle different response structures
    const reviewsResponse: ReviewsResponse = data;
    const reviews = reviewsResponse.reviews || 
                    data.result?.reviews || 
                    (Array.isArray(data) ? data : data.reviews) || 
                    [];

    dispatch(setReviews(reviews));
    dispatch(setLoading(false));
    return reviews;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch lesson reviews";
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

const getCourseReviews = async (courseId: string, dispatch: AppDispatch): Promise<Review[]> => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/reviews/course/${courseId}`);

    // Handle different response structures
    const reviewsResponse: ReviewsResponse = data;
    const reviews = reviewsResponse.reviews || 
                    data.result?.reviews || 
                    (Array.isArray(data) ? data : data.reviews) || 
                    [];

    dispatch(setReviews(reviews));
    dispatch(setLoading(false));
    return reviews;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch course reviews";
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

export { getLessonReviews, getCourseReviews };
