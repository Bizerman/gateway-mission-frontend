import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { api } from '../../api';
import {GatewayAddition, GatewayMission, MissionPayload} from "../../api/Api.ts";  // Путь к API


interface UpdateMissionElementPayload {
  elementId: string;
  data: GatewayAddition; // данные элемента, который ты обновляешь
}
// Интерфейс состояния для миссий
interface MissionState {
  missions: GatewayMission[];
  currentMission:MissionPayload | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: MissionState = {
  missions: [],
  currentMission:null,
  loading: false,
  error: null,
};

// Асинхронные экшены для работы с API
export const fetchMissions = createAsyncThunk(
  'missions/fetchMissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.missions.missionsList();
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке списка миссий');
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
      return rejectWithValue('Ошибка при загрузке миссии');
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
      // Отправляем запрос на удаление элемента
      await api.mission.missionElementDelete(missionId,elementId)
      return { missionId, elementId }; // возвращаем данные для обновления состояния
    } catch (error: any) {
      throw new Error('Ошибка при удалении элемента миссии');
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
        const { missionId, elementId } = action.payload;

        // Преобразуем missionId в число, если оно строка
        const missionIdNumber = Number(missionId);

        // Найдем миссию по ID
        const mission = state.missions.find((mission) => mission.id === missionIdNumber);

        if (mission && mission.elements) {
          // Удаляем элемент из массива элементов
          mission.elements = mission.elements.filter((element) => Number(element.element_id) !== Number(elementId));
        }
      })
      .addCase(missionElementDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      });

  }
});

// Экшены для слайса
export const {setError } = draftMissionSlice.actions;

export default draftMissionSlice.reducer;