import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CategoryState, Category } from "../interface/categoryInterface";

// Initial state
const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

// Category slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set categories list
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set current category
    setCurrentCategory: (state, action: PayloadAction<Category | null>) => {
      state.currentCategory = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add category to list
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.unshift(action.payload);
    },

    // Update category in list
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (state.currentCategory?._id === action.payload._id) {
        state.currentCategory = action.payload;
      }
    },

    // Remove category from list
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      if (state.currentCategory?._id === action.payload) {
        state.currentCategory = null;
      }
    },

    // Reset state
    resetCategoryState: (state) => {
      state.categories = [];
      state.currentCategory = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setCategories,
  setCurrentCategory,
  addCategory,
  updateCategory,
  removeCategory,
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;

