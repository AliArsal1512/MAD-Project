import { configureStore } from "@reduxjs/toolkit";
import salonProfileReducer from "./slices/salonProfileSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    salonProfile: salonProfileReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
