import { configureStore } from "@reduxjs/toolkit";
import salonProfileReducer from "./slices/salonProfileSlice";

export const store = configureStore({
  reducer: {
    salonProfile: salonProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
