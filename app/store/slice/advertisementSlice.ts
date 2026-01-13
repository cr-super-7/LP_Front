import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Advertisement, AdvertisementState } from "../interface/advertisementInterface";

const initialState: AdvertisementState = {
  advertisements: [],
  currentAdvertisement: null,
  isLoading: false,
  error: null,
};

const advertisementSlice = createSlice({
  name: "advertisement",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setAdvertisements: (state, action: PayloadAction<Advertisement[]>) => {
      state.advertisements = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentAdvertisement: (state, action: PayloadAction<Advertisement | null>) => {
      state.currentAdvertisement = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addAdvertisement: (state, action: PayloadAction<Advertisement>) => {
      state.advertisements.push(action.payload);
    },
    updateAdvertisement: (state, action: PayloadAction<Advertisement>) => {
      const index = state.advertisements.findIndex((adv) => adv._id === action.payload._id);
      if (index !== -1) {
        state.advertisements[index] = action.payload;
      }
      if (state.currentAdvertisement?._id === action.payload._id) {
        state.currentAdvertisement = action.payload;
      }
    },
    removeAdvertisement: (state, action: PayloadAction<string>) => {
      state.advertisements = state.advertisements.filter((adv) => adv._id !== action.payload);
      if (state.currentAdvertisement?._id === action.payload) {
        state.currentAdvertisement = null;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setAdvertisements,
  setCurrentAdvertisement,
  addAdvertisement,
  updateAdvertisement,
  removeAdvertisement,
} = advertisementSlice.actions;

export default advertisementSlice.reducer;
