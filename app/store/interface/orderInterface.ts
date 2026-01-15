// Order Interfaces

export interface OrderItem {
  courseId: string;
  price: number;
  course?: {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
    currency?: string;
    thumbnail?: string;
    [key: string]: any;
  };
}

export interface Order {
  _id: string;
  user: string | {
    _id: string;
    email: string;
    [key: string]: any;
  };
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  items: Array<{
    courseId: string;
    price: number;
  }>;
}

export interface OrderResponse {
  message?: string;
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}
