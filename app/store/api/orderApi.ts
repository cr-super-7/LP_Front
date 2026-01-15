import api from "../utils/api";
import { AppDispatch } from "../store";
import type {
  Order,
  OrderResponse,
  OrdersResponse,
  CreateOrderRequest,
} from "../interface/orderInterface";
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

const createOrder = async (
  orderData: CreateOrderRequest,
  dispatch: AppDispatch
): Promise<Order> => {
  try {
    const { data } = await api.post<OrderResponse>("/orders", orderData);

    const order = (data.order || data) as Order;
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getMyOrders = async (dispatch: AppDispatch): Promise<Order[]> => {
  try {
    const { data } = await api.get<OrdersResponse>("/orders");

    const orders = data.orders || [];
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const getOrderById = async (
  orderId: string,
  dispatch: AppDispatch
): Promise<Order> => {
  try {
    const { data } = await api.get<OrderResponse>(`/orders/${orderId}`);

    const order = (data.order || data) as Order;
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export {
  createOrder,
  getMyOrders,
  getOrderById,
};
