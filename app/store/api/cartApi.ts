import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Cart,
  AddToCartRequest,
} from "../interface/cartInterface";
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
    course: {
      _id: string;
      title: { ar: string; en: string };
      price: number;
      currency: string;
      thumbnail?: string;
      [key: string]: unknown;
    };
    createdAt?: string;
  }>;
  cart?: Cart;
  _id?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

const addToCart = async (
  cartData: AddToCartRequest,
  _dispatch: AppDispatch
): Promise<Cart> => {
  try {
    const { data } = await api.post<CartApiResponse>("/cart", cartData);

    // API response might have cartItems or cart
    let cart: Cart;
    if (data.cartItems && Array.isArray(data.cartItems)) {
      const items = data.cartItems.map((item) => ({
        courseId: item.course?._id || "",
        course: item.course,
        price: item.course?.price || 0,
      }));

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

  
    return cart;
  } catch (error: unknown) {
    let errorMessage = "Failed to add course to cart";
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

const getCart = async (_dispatch: AppDispatch): Promise<Cart> => {
  try {
    const { data } = await api.get<CartApiResponse>("/cart");

    // API response shape: { cartItems: [...] }
    // Convert to Cart interface format
    if (data.cartItems && Array.isArray(data.cartItems)) {
      const items = data.cartItems.map((item) => ({
        courseId: item.course?._id || "",
        course: item.course,
        price: item.course?.price || 0,
      }));

      const total = items.reduce((sum: number, item) => sum + item.price, 0);

      return {
        _id: data._id,
        user: data.user || data.cartItems[0]?.user || "",
        items: items,
        total: total,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }

    // Fallback to old format if exists
    if (data.cart) {
      return data.cart as Cart;
    }

    // If no items, return empty cart
    return {
      user: "",
      items: [],
      total: 0,
    };
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const removeFromCart = async (
  courseId: string,
  _dispatch: AppDispatch
): Promise<void> => {
  try {
    const { data } = await api.delete<{ message: string }>(`/cart/${courseId}`);

    toast.success(data.message || "Course removed from cart");
  } catch (error: unknown) {
    let errorMessage = "Failed to remove course from cart";
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

const clearCart = async (_dispatch: AppDispatch): Promise<void> => {
  try {
    const { data } = await api.delete<{ message: string }>("/cart");

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
