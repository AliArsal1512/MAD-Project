import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SalonProfileState {
  salon_name?: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  open_time?: string;
  close_time?: string;
  ambience_images?: string[];
  total_reviews?: number;
  average_rating?: number;
  email?: string;
}

const initialState: SalonProfileState = {};

export const salonProfileSlice = createSlice({
  name: "salonProfile",
  initialState,
  reducers: {
    setSalonProfile: (state, action: PayloadAction<SalonProfileState>) => {
      return { ...state, ...action.payload };
    },
    clearSalonProfile: () => {
      return {};
    },
  },
});

export const { setSalonProfile, clearSalonProfile } = salonProfileSlice.actions;
export default salonProfileSlice.reducer;
