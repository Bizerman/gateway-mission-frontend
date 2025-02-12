import { configureStore } from '@reduxjs/toolkit';
import gatewayReducer from './slices/GatewayElementsSlice.ts';
import userReducer from "./slices/userSlice.ts";

const store = configureStore({
  reducer: {
    gateway: gatewayReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
