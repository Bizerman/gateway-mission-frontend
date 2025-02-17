import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { api } from '../../api';
import {GatewayAddition, GatewayMission, MissionPayload} from "../../api/Api.ts";
import {AxiosError} from "axios";  // Путь к API


interface UpdateMissionElementPayload {
  elementId: string;
  data: GatewayAddition; // данные элемента, который ты обновляешь
}
// Интерфейс состояния для миссий
interface MissionState {
  missions: GatewayMission[];
  currentMission:MissionPayload | null;
  isEditing: boolean;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: MissionState = {
  missions: [],
  currentMission:null,
  isEditing: false,
  loading: false,
  error: null,
};

// Асинхронные экшены для работы с API
export const fetchMissions = createAsyncThunk(
  'missions/fetchMissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.missions.missionsList();
      console.log(response)
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status; // Получаем статус из ответа, если он есть
        return rejectWithValue(status || 'Ошибка при загрузке списка миссий');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const fetchMissionById = createAsyncThunk(
  'missions/fetchMissionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.mission.missionRead(id);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status; // Получаем статус из ответа, если он есть
        return rejectWithValue(status || 'Ошибка при загрузке списка миссий');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const addElementToMission = createAsyncThunk(
  'missions/addElementToMission',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.gatewayel.gatewayelAddtomissionCreate(id);
      return id;
    } catch (error) {
      return rejectWithValue('Ошибка при добавлении элемента в миссию');
    }
  }
);

export const updateMissionForm = createAsyncThunk(
  'missions/updateMissionForm',
  async (_, { rejectWithValue }) => {
    try {
      await api.mission.missionFormUpdate();
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении формы миссии');
    }
  }
);

export const updateMissionElement = createAsyncThunk(
  'missions/updateMissionElement',
  async ({ missionId, elementId, data }: { missionId: string; elementId: string; data: GatewayAddition }, { rejectWithValue }) => {
    try {
      console.log("Update mission element:", { missionId, elementId, data });
      await api.mission.missionElementUpdate(missionId, elementId, data);
      return { elementId, data }; // Возвращаем данные с элементом
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении элемента миссии');
    }
  }
);
// Функция для удаления элемента миссии через API
export const missionElementDelete = createAsyncThunk(
  'missions/missionElementDelete',
  async ({ missionId, elementId }: { missionId: string; elementId: string }) => {
    try {
      await api.mission.missionElementDelete(missionId,elementId)
      return { missionId, elementId };
    } catch (error: any) {
      throw new Error('Ошибка при удалении элемента миссии');
    }
  }
);
// Обновление статуса миссии
  export const missionCompleteUpdate = createAsyncThunk(
    "missions/completeUpdate",
    async ({ id, data }: { id: string; data: { status: 1 | 2 | 3 | 4 | 5 } }, { rejectWithValue }) => {
      try {
        console.log("Complete mission:", { id, data });
        const response = await api.mission.missionCompleteUpdate(id, data);
        return response;
      } catch (error) {
        return rejectWithValue("Ошибка при завершении миссии");
      }
    }
  );


// Удаление миссии
export const missionDelete = createAsyncThunk(
  "missions/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("Delete mission:", { id });
      await api.mission.missionDelete(id);
      return { id }; // Возвращаем ID удаленной миссии
    } catch (error) {
      return rejectWithValue("Ошибка при удалении миссии");
    }
  }
);

// Слайс для миссий
const draftMissionSlice = createSlice({
  name: 'draftMission',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.missions = action.payload;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMissionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMission = action.payload;
        state.error = null;

        // Обновляем элементы миссии, добавляя обработку addition
        state.currentMission.elements = action.payload.elements.map((element) => ({
          ...element,
          addition: element.addition || '', // Если поле addition пустое или undefined, заменяем на пустую строку
        }));
      })
      .addCase(addElementToMission.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addElementToMission.rejected, (state) => {
        state.error = 'Ошибка при добавлении элемента в миссию';
        state.loading = false;
      })
      .addCase(updateMissionForm.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateMissionForm.rejected, (state) => {
        state.error = 'Ошибка при обновлении формы миссии';
        state.loading = false;
      })
      .addCase(updateMissionElement.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { elementId, data } = action.payload as UpdateMissionElementPayload;
        const updatedAddition = data.addition ?? ''; // Заменим undefined на пустую строку

        if (state.currentMission) {
          state.currentMission.elements = state.currentMission.elements.map((element) =>
            String(element.id) === elementId ? { ...element, addition: updatedAddition } : element
          );
        }
      })
      .addCase(updateMissionElement.rejected, (state) => {
        state.error = 'Ошибка при обновлении элемента миссии';
        state.loading = false;
      })
      .addCase(missionElementDelete.pending, (state) => {
        state.loading = true;
      })
      .addCase(missionElementDelete.fulfilled, (state, action) => {
        state.loading = false;
        const { elementId } = action.payload;

        // Найдем миссию по ID
        const mission = state.currentMission

        if (mission && mission.elements) {
          // Удаляем элемент из массива элементов
          mission.elements = mission.elements.filter((element) => Number(element.id) !== Number(elementId));
        }
      })
      .addCase(missionElementDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      .addCase(missionCompleteUpdate.fulfilled, (state, action) => {
        // Обновление состояния после успешного завершения или отклонения миссии
        const updatedMission = action.payload;
        const index = state.missions.findIndex((mission) => mission.id === Number(updatedMission.data.id)); // приводим id к числовому типу
        if (index !== -1) {
          // Обновляем статус, дату завершения и дату планирования
          state.missions[index] = {
            ...state.missions[index],
            status: updatedMission.data.status, // Обновляем статус
            complete_datetime: updatedMission.data.complete_datetime, // Обновляем дату завершения
            plan_date: updatedMission.data.plan_date, // Обновляем дату планирования
          };
        }
      })
      .addCase(missionDelete.fulfilled, (state, action) => {
        // Удаление миссии из состояния
        state.missions = state.missions.filter((mission) => String(mission.id) !== action.payload.id);
      })
      .addCase(missionCompleteUpdate.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(missionDelete.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// Экшены для слайса
export const {setError } = draftMissionSlice.actions;

export default draftMissionSlice.reducer;