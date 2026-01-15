// Cart Interfaces

export interface CartItem {
  courseId: string;
  course?: {
    _id: string;
    title: {
      ar: string;
      en: string;
    };
    price: number;
    currency: string;
    thumbnail?: string;
    teacher?: string | {
      _id: string;
      email: string;
      [key: string]: unknown;
    };
    level?: string;
    durationHours?: number;
    totalLessons?: number;
    [key: string]: unknown;
  };
  price: number;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  courseId: string;
}

export interface CartResponse {
  message?: string;
  cart: Cart;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}
