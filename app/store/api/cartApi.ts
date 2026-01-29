import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Cart,
  AddToCartRequest,
} from "../interface/cartInterface";
import type { PrivateLesson } from "../interface/privateLessonInterface";
import {
  setCartLoading,
  setCartError,
  setCart,
  removeCartItem,
  clearCartState,
} from "../slice/cartSlice";
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

// Cart API Response interface
interface CartApiResponse {
  cartItems?: Array<{
    _id: string;
    user: string;
    course?: {
      _id: string;
      title: { ar: string; en: string };
      price: number;
      currency: string;
      thumbnail?: string;
      teacher?: string | { _id: string; email: string; [key: string]: unknown };
      [key: string]: unknown;
    };
    privateLesson?: PrivateLesson;
    // Some backends might return ids directly
    courseId?: string;
    privateLessonId?: string;
    price?: number;
    createdAt?: string;
  }>;
  cart?: Cart;
  _id?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

const mapCartItems = (cartItems: NonNullable<CartApiResponse["cartItems"]>) => {
  return cartItems.map((item) => {
    // Course cart item
    if (item.course?._id) {
      return {
        courseId: item.course._id,
        course: item.course,
        price: item.course.price || 0,
      };
    }

    // Private lesson cart item
    if (item.privateLesson?._id) {
      const pl = item.privateLesson;
      const derivedPrice =
        pl.oneLessonPrice ?? pl.packagePrice ?? pl.price ?? item.price ?? 0;
      return {
        courseId: pl._id, // used as unique id across the cart UI
        privateLessonId: pl._id,
        privateLesson: pl,
        price: derivedPrice,
      };
    }

    // Fallback (unknown shape) - keep id to avoid crashes
    const fallbackId = item.courseId || item.privateLessonId || item._id || "";
    return {
      courseId: fallbackId,
      price: item.price || 0,
    };
  });
};

/**
 * Add item to cart (course or private lesson)
 *
 * @param cartData - Cart item data
 * @param dispatch - Redux dispatch
 * @returns Updated cart
 */
const addToCart = async (
  cartData: AddToCartRequest,
  dispatch: AppDispatch
): Promise<Cart> => {
  try {
    dispatch(setCartLoading(true));
    
    const { data } = await api.post<CartApiResponse>("/cart", cartData);

    // API response might have cartItems or cart
    let cart: Cart;
    if (data.cartItems && Array.isArray(data.cartItems)) {
      const items = mapCartItems(data.cartItems);

      const total = items.reduce((sum: number, item) => sum + item.price, 0);

      cart = {
        _id: data._id,
        user: data.user || data.cartItems[0]?.user || "",
        items: items,
        total: total,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } else {
      cart = (data.cart || data) as Cart;
    }

    // Update Redux store
    dispatch(setCart(cart));
  
    return cart;
  } catch (error: unknown) {
    let errorMessage = "Failed to add item to cart";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setCartError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get current cart
 * 
 * @param dispatch - Redux dispatch
 * @returns Cart with items
 */
const getCart = async (dispatch: AppDispatch): Promise<Cart> => {
  try {
    dispatch(setCartLoading(true));
    
    const { data } = await api.get<CartApiResponse>("/cart");

    // API response shape: { cartItems: [...] }
    // Convert to Cart interface format
    let cart: Cart;
    if (data.cartItems && Array.isArray(data.cartItems)) {
      const items = mapCartItems(data.cartItems);

      const total = items.reduce((sum: number, item) => sum + item.price, 0);

      cart = {
        _id: data._id,
        user: data.user || data.cartItems[0]?.user || "",
        items: items,
        total: total,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } else if (data.cart) {
      // Fallback to old format if exists
      cart = data.cart as Cart;
    } else {
      // If no items, return empty cart
      cart = {
        user: "",
        items: [],
        total: 0,
      };
    }

    // Update Redux store
    dispatch(setCart(cart));
    
    return cart;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch cart";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setCartError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Remove item from cart (course/private lesson)
 * 
 * @param courseId - Item ID to remove
 * @param dispatch - Redux dispatch
 */
const removeFromCart = async (
  courseId: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(setCartLoading(true));
    
    const { data } = await api.delete<{ message: string }>(`/cart/${courseId}`);

    // Update Redux store
    dispatch(removeCartItem(courseId));
    dispatch(setCartLoading(false));
    
    toast.success(data.message || "Item removed from cart");
  } catch (error: unknown) {
    let errorMessage = "Failed to remove item from cart";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setCartError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Clear entire cart
 * 
 * @param dispatch - Redux dispatch
 */
const clearCart = async (dispatch: AppDispatch): Promise<void> => {
  try {
    dispatch(setCartLoading(true));
    
    const { data } = await api.delete<{ message: string }>("/cart");

    // Update Redux store
    dispatch(clearCartState());
    dispatch(setCartLoading(false));
    
    toast.success(data.message || "Cart cleared");
  } catch (error: unknown) {
    let errorMessage = "Failed to clear cart";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setCartError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};
