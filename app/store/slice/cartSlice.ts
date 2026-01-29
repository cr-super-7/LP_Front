import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Cart, CartItem } from "../interface/cartInterface";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearCartError: (state) => {
      state.error = null;
    },
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      if (state.cart) {
        state.cart.items.push(action.payload);
        state.cart.total = state.cart.items.reduce((sum, item) => sum + item.price, 0);
      }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(
          (item) => item.courseId !== action.payload && item.itemId !== action.payload
        );
        state.cart.total = state.cart.items.reduce((sum, item) => sum + item.price, 0);
      }
    },
    clearCartState: (state) => {
      if (state.cart) {
        state.cart.items = [];
        state.cart.total = 0;
      }
    },
    resetCartState: (state) => {
      state.cart = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setCartLoading,
  setCartError,
  clearCartError,
  setCart,
  addCartItem,
  removeCartItem,
  clearCartState,
  resetCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
