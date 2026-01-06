import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BlogState, Blog } from "../interface/blogInterface";

// Initial state
const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Blog slice
const blogSlice = createSlice({
  name: "blog",
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

    // Set blogs list
    setBlogs: (state, action: PayloadAction<{ blogs: Blog[]; pagination: BlogState["pagination"] }>) => {
      state.blogs = action.payload.blogs;
      state.pagination = action.payload.pagination;
      state.isLoading = false;
      state.error = null;
    },

    // Set current blog
    setCurrentBlog: (state, action: PayloadAction<Blog | null>) => {
      state.currentBlog = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Add blog to list
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.unshift(action.payload);
    },

    // Update blog in list
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.blogs.findIndex((blog) => blog._id === action.payload._id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
      if (state.currentBlog?._id === action.payload._id) {
        state.currentBlog = action.payload;
      }
    },

    // Remove blog from list
    removeBlog: (state, action: PayloadAction<string>) => {
      state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      if (state.currentBlog?._id === action.payload) {
        state.currentBlog = null;
      }
    },

    // Reset state
    resetBlogState: (state) => {
      state.blogs = [];
      state.currentBlog = null;
      state.error = null;
      state.isLoading = false;
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setBlogs,
  setCurrentBlog,
  addBlog,
  updateBlog,
  removeBlog,
  resetBlogState,
} = blogSlice.actions;

export default blogSlice.reducer;

