import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "../interface/orderInterface";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderState: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((o) => o._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o._id !== action.payload);
      if (state.currentOrder?._id === action.payload) {
        state.currentOrder = null;
      }
    },
    resetOrderState: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setOrderLoading,
  setOrderError,
  clearOrderError,
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrderState,
  removeOrder,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
