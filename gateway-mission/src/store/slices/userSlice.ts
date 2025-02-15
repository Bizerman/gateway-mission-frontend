import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import {getCSRFToken, LoginResponse, UpdateResponse, UserRegistration} from "../../api/Api.ts";

interface UserState {
  id: number;
  username?: string | null;
  email?: string;
  first_name: string | null;
  last_name: string | null;
  password: string;
  role: string;
  error?: string | null;
  isLoading: boolean;
  success: boolean;
  isAuthenticated: boolean;
}

const idFromStorage = sessionStorage.getItem('id');
const usernameFromStorage = sessionStorage.getItem('username');
const firstNameFromStorage = sessionStorage.getItem('first_name');
const lastNameFromStorage = sessionStorage.getItem('last_name');
const emailFromStorage = sessionStorage.getItem('email');
const tokenFromStorage = sessionStorage.getItem('token');
const roleFromStorage = sessionStorage.getItem('role');

const initialState: UserState = {
  id: Number(idFromStorage) || 1,
  username: usernameFromStorage || null,
  email: emailFromStorage || '',
  first_name: firstNameFromStorage || '',
  last_name: lastNameFromStorage || '',
  password: '',
  role: roleFromStorage || '',
  error: null,
  isLoading: false,
  success: false,
  isAuthenticated: tokenFromStorage ? true : false,
};

// Асинхронный экшен для входа через сессии Django
export const loginUserAsync = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  'user/loginUserAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.user.userLoginCreate({ email, password }, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': getCSRFToken(),
        }
      });

      if (!response || !response.data) {
        return rejectWithValue('Ошибка авторизации');
      }

      // Сохраняем данные пользователя в sessionStorage
      sessionStorage.setItem('id', response.data.user_data.id);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('first_name', response.data.user_data.first_name);
      sessionStorage.setItem('last_name', response.data.user_data.last_name);
      sessionStorage.setItem('username', response.data.user_data.username);
      sessionStorage.setItem('role', response.data.user_data.role);
      sessionStorage.setItem('token', String(response.data.user_data.token));

      api.updateDefaultsCsrfToken();
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка авторизации');
    }
  }
);



export const logoutUserAsync = createAsyncThunk(
  'user/logoutUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      await api.user.userLogoutCreate({
        withCredentials: true,
        headers: {
          'X-CSRFToken': getCSRFToken(),
        },
      });

      sessionStorage.clear()
      return {};
    } catch (error) {
      return rejectWithValue('Ошибка при выходе из системы');
    }
  }
);



export const updateUserAsync = createAsyncThunk(
  'user/updateUserAsync',
  async ({ id, username, first_name, last_name, email, password }: UserRegistration, { rejectWithValue }) => {
    try {
      const response = await api.user.userChangeProfileUpdate(
        id,
        { id, username, first_name, last_name, email, password },
        { withCredentials: true }
      ) as { data?: { message: string; user_data?: UpdateResponse } };

      if (!response || !response.data) {
        return rejectWithValue('Ошибка при обновлении профиля: пустой ответ');
      }

      const updatedUser = response.data.user_data;

      if (!updatedUser || !updatedUser.id) {
        return rejectWithValue('Профиль успешно изменен, но сервер не вернул обновленные данные.');
      }

      // Если пароль был изменен, очищаем все сессионные данные
      if (password) {
        sessionStorage.clear();
        console.log('Сессионные данные очищены после изменения пароля');
      }

      const updatedFields = {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        username: updatedUser.username,
      };

      Object.entries(updatedFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          sessionStorage.setItem(key, value);
        }
      });

      return updatedUser; // Возвращаем обновленные данные пользователя
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
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

        state.id = Number(action.payload.user_data.id);
        state.username = action.payload.user_data.username || null;
        state.email = action.payload.user_data.email || '';
        state.first_name = action.payload.user_data.first_name || '';
        state.last_name = action.payload.user_data.last_name || '';
        state.password = action.payload.user_data.password || '';
        state.role = action.payload.user_data.role ?? '';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.role = '';
        state.isAuthenticated = false;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        Object.assign(state, {
          id: 0,
          username: null,
          email: '',
          role: '',
          first_name: '',
          last_name: '',
          password: '',
          isAuthenticated: false,
          error: null,
        });
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;

        if (!action.payload.id) {
          return;
        }
        if (action.payload.password) {
          state.id = 0;
          state.username = null;
          state.email = '';
          state.first_name = '';
          state.last_name = '';
          state.password = '';
          state.role = '';
          state.isAuthenticated = false;
        }
        state.id = Number(action.payload.id) || state.id;
        state.username = action.payload.username || state.username;
        state.email = action.payload.email || state.email;
        state.first_name = action.payload.first_name || state.first_name;
        state.last_name = action.payload.last_name || state.last_name;
        state.password = action.payload.password || state.password;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default userSlice.reducer;
