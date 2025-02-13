import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import {LoginResponse, UpdateResponse} from "../../api/Api.ts";

interface UserState {
  username?: string | null;
  email?: string | null;
  role: string;
  error?: string | null;
  isLoading: boolean;
  success: boolean;
  isAuthenticated: boolean;
}

const usernameFromStorage = localStorage.getItem('username');
const emailFromStorage = localStorage.getItem('email');
const tokenFromStorage = localStorage.getItem('token')
const roleFronStorage = localStorage.getItem('role')

const initialState: UserState = {
  username: usernameFromStorage || null,
  email: emailFromStorage || null,
  role: roleFronStorage || '',
  error: null,
  isLoading: false,
  success: false,
  isAuthenticated: tokenFromStorage ? true : false,
};


// Асинхронный экшен для входа через сессии Django
// Асинхронный экшен для входа через сессии Django
export const loginUserAsync = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  'user/loginUserAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.user.userLoginCreate({ email, password }, { withCredentials: true });
      if (!response || !response.data) {
        return rejectWithValue('Ошибка авторизации');
      }
      // Сохраняем данные пользователя в localStorage
      localStorage.setItem('email', email);
      localStorage.setItem('password', password); // Если необходимо сохранять пароль
      localStorage.setItem('username', response.data.user_data.username);
      localStorage.setItem('role', response.data.user_data.role);
      localStorage.setItem('token', String(response.data.user_data.token));
      return response.data; // Возвращаем данные о пользователе
    } catch (error) {
      return rejectWithValue('Ошибка авторизации');
    }
  }
);


// Асинхронный экшен для выхода
export const logoutUserAsync = createAsyncThunk(
  'user/logoutUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      await api.user.userLogoutCreate({
        withCredentials: true,
        headers: { 'X-CSRFToken': getCSRFToken() },
      });

      // Очищаем данные из localStorage после успешного выхода
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('token');

      return {}; // Возвращаем пустой объект
    } catch (error) {
      return rejectWithValue('Ошибка при выходе из системы');
    }
  }
);


function getCSRFToken() {
  const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
  return csrfToken || '';
}


// Асинхронный экшен для обновления профиля
export const updateUserAsync = createAsyncThunk(
  'user/updateUserAsync',
  async (
    { id, username, first_name, last_name, email, password }:
    { id: number; username: string; first_name: string; last_name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.user.userChangeProfileUpdate(
        id,
        { username, first_name, last_name, email, password },
        { withCredentials: true }
      ) as { data?: UpdateResponse };

      if (!response || !response.data) {
        return rejectWithValue('Ошибка при обновлении профиля: пустой ответ');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении профиля');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        if (!action.payload) {
          console.error("Ошибка: action.payload undefined!");
          return;
        }

        state.username = action.payload.user_data.username || null;
        state.email = action.payload.user_data.email || null;
        state.role = action.payload.user_data.role ?? 0;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        console.error("Ошибка входа:", action.payload);
        state.error = action.payload as string;
        state.role = ''
        state.isAuthenticated = false;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.username = null;
        state.email = null;
        state.role = '';
        state.isAuthenticated = false;
        state.error = null; // Очистить ошибку при выходе
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default userSlice.reducer;
