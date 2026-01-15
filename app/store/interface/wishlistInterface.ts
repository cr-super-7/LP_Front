// Wishlist Interfaces

export interface WishlistItem {
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
    [key: string]: any;
  };
  addedAt: string;
}

export interface Wishlist {
  _id?: string;
  user: string;
  items: WishlistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToWishlistRequest {
  courseId: string;
}

export interface WishlistResponse {
  message?: string;
  wishlist: Wishlist;
}

export interface WishlistState {
  wishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;
}
