import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Wishlist,
  WishlistResponse,
  AddToWishlistRequest,
} from "../interface/wishlistInterface";
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

const addToWishlist = async (
  wishlistData: AddToWishlistRequest,
  dispatch: AppDispatch
): Promise<any> => {
  try {
    const { data } = await api.post<any>("/wishlist", wishlistData);

    // API response shape: { message: string, wishlistItem: {...} }
    const wishlistItem = data.wishlistItem || data;
    toast.success(data.message || "Course added to wishlist");
    return wishlistItem;
  } catch (error: unknown) {
    let errorMessage = "Failed to add course to wishlist";
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

const getWishlist = async (dispatch: AppDispatch): Promise<Wishlist> => {
  try {
    const { data } = await api.get<WishlistResponse>("/wishlist");

    const wishlist = (data.wishlist || data) as Wishlist;
    return wishlist;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch wishlist";
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

const removeFromWishlist = async (
  courseId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const { data } = await api.delete<{ message: string }>(`/wishlist/${courseId}`);

    toast.success(data.message || "Course removed from wishlist");
  } catch (error: unknown) {
    let errorMessage = "Failed to remove course from wishlist";
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
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
