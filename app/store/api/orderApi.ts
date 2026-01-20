import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Order,
  OrderResponse,
  OrdersResponse,
  CreateOrderRequest,
} from "../interface/orderInterface";
import {
  setOrderLoading,
  setOrderError,
  setOrders,
  setCurrentOrder,
  addOrder,
} from "../slice/orderSlice";
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

/**
 * Create a new order
 * 
 * @param orderData - Order creation data (courseIds array and optional discount)
 * @param dispatch - Redux dispatch
 * @returns Created order
 */
const createOrder = async (
  orderData: CreateOrderRequest,
  dispatch: AppDispatch
): Promise<Order> => {
  try {
    dispatch(setOrderLoading(true));
    
    const { data } = await api.post<OrderResponse>("/orders", orderData);

    const order = (data.order || data) as Order;
    
    // Update Redux store
    dispatch(addOrder(order));
    dispatch(setOrderLoading(false));
    
    toast.success(data.message || "Order created successfully");
    return order;
  } catch (error: unknown) {
    let errorMessage = "Failed to create order";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setOrderError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get my orders
 * 
 * @param dispatch - Redux dispatch
 * @returns Array of orders
 */
const getMyOrders = async (dispatch: AppDispatch): Promise<Order[]> => {
  try {
    dispatch(setOrderLoading(true));
    
    const { data } = await api.get<OrdersResponse>("/orders");

    const orders = data.orders || [];
    
    // Update Redux store
    dispatch(setOrders(orders));
    
    return orders;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch orders";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setOrderError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get order by ID
 * 
 * @param orderId - Order ID
 * @param dispatch - Redux dispatch
 * @returns Order details
 */
const getOrderById = async (
  orderId: string,
  dispatch: AppDispatch
): Promise<Order> => {
  try {
    dispatch(setOrderLoading(true));
    
    const { data } = await api.get<OrderResponse>(`/orders/${orderId}`);

    const order = (data.order || data) as Order;
    
    // Update Redux store
    dispatch(setCurrentOrder(order));
    
    return order;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch order";
    const err = error as ErrorResponse;
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch(setOrderError(errorMessage));
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  createOrder,
  getMyOrders,
  getOrderById,
};
