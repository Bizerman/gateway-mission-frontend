import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {api} from "../../api";


export interface UserRegistration {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface UserRegistrationState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserRegistrationState = {
  isLoading: false,
  error: null,
  success: false,
};

// Асинхронный thunk для регистрации пользователя
export const registerUserAsync = createAsyncThunk(
  'user/register',
  async (data: UserRegistration, { rejectWithValue }) => {
    try {
      await api.user.userRegistrationCreate(data); // Отправка запроса на сервер
      return true;
    } catch (error) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

const userRegistrationSlice = createSlice({
  name: 'userRegistration',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUserAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default userRegistrationSlice.reducer;
