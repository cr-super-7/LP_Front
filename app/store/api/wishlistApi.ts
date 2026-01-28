import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Wishlist,
  WishlistResponse,
  AddToWishlistRequest,
} from "../interface/wishlistInterface";
import {
  setWishlistLoading,
  setWishlistError,
  setWishlist,
  removeWishlistItem,
} from "../slice/wishlistSlice";
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

// Wishlist API Response interface
interface WishlistApiResponse {
  wishlistItems?: Array<{
    _id: string;
    user: string;
    course: {
      _id: string;
      title: { ar: string; en: string };
      description: { ar: string; en: string };
      price: number;
      currency: string;
      thumbnail?: string;
      level: string;
      durationHours?: number;
      totalLessons?: number;
      courseType: string;
      category?: {
        _id: string;
        name: string | { ar: string; en: string };
        [key: string]: unknown;
      };
      department?: {
        name?: { ar: string; en: string };
        college?: {
          name?: { ar: string; en: string };
          university?: {
            name: string;
            location?: string;
            [key: string]: unknown;
          };
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };
      othersCourses?: {
        name?: { ar: string; en: string };
        location?: { ar: string; en: string };
        [key: string]: unknown;
      };
      Teacher?: {
        _id: string;
        user: string | { email: string; [key: string]: unknown };
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    createdAt?: string;
    [key: string]: unknown;
  }>;
  wishlist?: Wishlist;
  wishlistItem?: unknown;
  [key: string]: unknown;
}

/**
 * Add course to wishlist
 * 
 * @param wishlistData - Wishlist item data
 * @param dispatch - Redux dispatch
 * @returns Added wishlist item
 */
const addToWishlist = async (
  wishlistData: AddToWishlistRequest,
  dispatch: AppDispatch
): Promise<unknown> => {
  try {
    dispatch(setWishlistLoading(true));
    
    const { data } = await api.post<WishlistApiResponse>("/wishlist", wishlistData);

    // API response shape: { message: string, wishlistItem: {...} }
    const wishlistItem = data.wishlistItem || data;
    
    dispatch(setWishlistLoading(false));
    
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
    
    dispatch(setWishlistError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get current wishlist
 * 
 * @param dispatch - Redux dispatch
 * @returns Wishlist with items
 */
const getWishlist = async (dispatch: AppDispatch): Promise<Wishlist> => {
  try {
    dispatch(setWishlistLoading(true));
    
    const { data } = await api.get<WishlistApiResponse>("/wishlist");

    // API response shape: { wishlistItems: [...] }
    // Convert to Wishlist interface format
    let wishlist: Wishlist;
    if (data.wishlistItems && Array.isArray(data.wishlistItems)) {
      const items = data.wishlistItems.map((item) => ({
        courseId: item.course?._id || "",
        course: item.course,
        addedAt: item.createdAt || new Date().toISOString(),
      }));

      wishlist = {
        _id: data.wishlistItems[0]?._id,
        user: data.wishlistItems[0]?.user || "",
        items: items,
        createdAt: data.wishlistItems[0]?.createdAt,
        updatedAt: data.wishlistItems[0]?.createdAt,
      };
    } else if (data.wishlist) {
      // Fallback to old format if exists
      wishlist = data.wishlist as Wishlist;
    } else {
      // If no items, return empty wishlist
      wishlist = {
        user: "",
        items: [],
      };
    }

    // Update Redux store
    dispatch(setWishlist(wishlist));
    
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
    
    dispatch(setWishlistError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Remove course from wishlist
 * 
 * @param courseId - Course ID to remove
 * @param dispatch - Redux dispatch
 */
const removeFromWishlist = async (
  courseId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(setWishlistLoading(true));
    
    const { data } = await api.delete<{ message: string }>(`/wishlist/${courseId}`);

    // Update Redux store
    dispatch(removeWishlistItem(courseId));
    dispatch(setWishlistLoading(false));
    
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
    
    dispatch(setWishlistError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
