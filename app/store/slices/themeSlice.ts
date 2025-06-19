import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  isLoading: boolean;
}

const initialState: ThemeState = {
  mode: 'light',
  isLoading: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setThemeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setTheme, setThemeLoading, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer; 