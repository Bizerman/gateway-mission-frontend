import { configureStore } from '@reduxjs/toolkit';
import gatewayReducer from './slices/GatewayElementsSlice.ts';
import userReducer from "./slices/userSlice.ts";
import RegistrationReducer from "./slices/RegistrationSlice.ts"
import missionReducer from './slices/MissionDraftSlice.ts'; // Импорт редьюсера для миссий

const store = configureStore({
  reducer: {
    gateway: gatewayReducer,
    user: userReducer,
    registration: RegistrationReducer,
    missions: missionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
