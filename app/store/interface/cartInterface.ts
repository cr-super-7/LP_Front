// Cart Interfaces

import type { PrivateLesson } from "./privateLessonInterface";

export interface CartItem {
  /**
   * Unique cart record id returned by backend (cart item document _id).
   * NOTE: New DELETE endpoint uses courseId/privateLessonId instead.
   */
  itemId?: string;
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
  // When the cart item is a private lesson, backend returns privateLesson data
  privateLessonId?: string;
  privateLesson?: PrivateLesson;
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
  /**
   * Add course to cart
   */
  courseId?: string;
  /**
   * Add private lesson to cart
   */
  privateLessonId?: string;
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
