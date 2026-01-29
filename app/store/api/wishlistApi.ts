import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Wishlist,
  WishlistResponse,
  AddToWishlistRequest,
} from "../interface/wishlistInterface";
import type { PrivateLesson } from "../interface/privateLessonInterface";
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
    course?: {
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
    privateLesson?: PrivateLesson;
    courseId?: string;
    privateLessonId?: string;
    createdAt?: string;
    [key: string]: unknown;
  }>;
  wishlist?: Wishlist;
  wishlistItem?: unknown;
  [key: string]: unknown;
}

const mapWishlistItems = (wishlistItems: NonNullable<WishlistApiResponse["wishlistItems"]>) => {
  return wishlistItems.map((item) => {
    if (item.course?._id) {
      return {
        itemId: item._id,
        courseId: item.course._id,
        course: item.course,
        addedAt: item.createdAt || new Date().toISOString(),
      };
    }
    if (item.privateLesson?._id) {
      return {
        itemId: item._id,
        courseId: item.privateLesson._id, // keep stable id for existing UI checks
        privateLessonId: item.privateLesson._id,
        privateLesson: item.privateLesson,
        addedAt: item.createdAt || new Date().toISOString(),
      };
    }
    const fallbackId = item.courseId || item.privateLessonId || item._id || "";
    return {
      itemId: item._id,
      courseId: fallbackId,
      addedAt: item.createdAt || new Date().toISOString(),
    };
  });
};

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
      const items = mapWishlistItems(data.wishlistItems);

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
 * New API: DELETE /wishlist/{itemId}?type=course|privateLesson
 * - itemId is courseId OR privateLessonId (NOT the wishlist record _id)
 *
 * @param itemId - courseId or privateLessonId to remove
 * @param type - item type
 * @param dispatch - Redux dispatch
 */
const removeFromWishlist = async (
  itemId: string,
  type: "course" | "privateLesson",
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(setWishlistLoading(true));
    
    const { data } = await api.delete<{ message: string }>(`/wishlist/${itemId}`, {
      params: { type },
    });

    // Update Redux store
    dispatch(removeWishlistItem(itemId));
    dispatch(setWishlistLoading(false));
    
    toast.success(data.message || "Item removed from wishlist");
  } catch (error: unknown) {
    let errorMessage = "Failed to remove item from wishlist";
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
