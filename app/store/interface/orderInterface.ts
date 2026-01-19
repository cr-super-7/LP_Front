// Order Interfaces

export interface OrderCourse {
  _id: string;
  title: {
    ar: string;
    en: string;
  };
  currency?: string;
  thumbnail?: string;
  // Popularity fields (included in order response)
  enrollCount?: number;
  playCount?: number;
  purchaseCount?: number;
  popularityScore?: number;
  [key: string]: unknown;
}

export interface OrderItem {
  courseId: string;
  price: number;
  course?: OrderCourse;
}

export interface Order {
  _id: string;
  user: string | {
    _id: string;
    email: string;
    [key: string]: unknown;
  };
  courses?: OrderCourse[]; // New format from API
  items?: OrderItem[]; // Legacy format
  discount?: number;
  subtotal?: number;
  totalPayment?: number;
  total?: number; // Legacy field
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt?: string;
}

// New API format
export interface CreateOrderRequest {
  courseIds: string[];
  discount?: number;
}

// Legacy format (kept for backward compatibility)
export interface CreateOrderRequestLegacy {
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
