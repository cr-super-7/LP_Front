import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Wishlist, WishlistItem } from "../interface/wishlistInterface";

interface WishlistState {
  wishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: null,
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setWishlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearWishlistError: (state) => {
      state.error = null;
    },
    setWishlist: (state, action: PayloadAction<Wishlist | null>) => {
      state.wishlist = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
      if (state.wishlist) {
        state.wishlist.items.push(action.payload);
      }
    },
    removeWishlistItem: (state, action: PayloadAction<string>) => {
      if (state.wishlist) {
        state.wishlist.items = state.wishlist.items.filter(
          (item) => item.courseId !== action.payload
        );
      }
    },
    clearWishlistState: (state) => {
      if (state.wishlist) {
        state.wishlist.items = [];
      }
    },
    resetWishlistState: (state) => {
      state.wishlist = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setWishlistLoading,
  setWishlistError,
  clearWishlistError,
  setWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlistState,
  resetWishlistState,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
