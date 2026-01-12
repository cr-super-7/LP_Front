import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Research, ResearchState } from "../interface/researchInterface";

const initialState: ResearchState = {
  researches: [],
  currentResearch: null,
  isLoading: false,
  error: null,
};

const researchSlice = createSlice({
  name: "research",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setResearches: (state, action: PayloadAction<Research[]>) => {
      state.researches = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addResearch: (state, action: PayloadAction<Research>) => {
      state.researches.push(action.payload);
    },
    updateResearch: (state, action: PayloadAction<Research>) => {
      const index = state.researches.findIndex(
        (r) => r._id === action.payload._id
      );
      if (index !== -1) {
        state.researches[index] = action.payload;
      }
      if (state.currentResearch?._id === action.payload._id) {
        state.currentResearch = action.payload;
      }
    },
    removeResearch: (state, action: PayloadAction<string>) => {
      state.researches = state.researches.filter(
        (r) => r._id !== action.payload
      );
      if (state.currentResearch?._id === action.payload) {
        state.currentResearch = null;
      }
    },
    setCurrentResearch: (state, action: PayloadAction<Research | null>) => {
      state.currentResearch = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setResearches,
  addResearch,
  updateResearch,
  removeResearch,
  setCurrentResearch,
} = researchSlice.actions;

export default researchSlice.reducer;
