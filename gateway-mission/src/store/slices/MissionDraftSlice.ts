import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { api } from '../../api';
import {GatewayAddition, GatewayMission, MissionPayload} from "../../api/Api.ts";  // Путь к API



// Интерфейс состояния для миссий
interface MissionState {
  missions: GatewayMission[];
  draftMission: MissionPayload | null;
  currentMission:MissionPayload | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: MissionState = {
  missions: [],
  draftMission: null,
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
      setMissionDraftId(id)
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
      await api.mission.missionElementUpdate(missionId, elementId, data);
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
    setMissionDraftId: (state, action) => {
      if (state.draftMission != null){
        state.draftMission.mission = action.payload.mission.id;
      }
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
        if (action.payload.mission.status == 1){
          state.draftMission = action.payload;
        }
        state.currentMission = action.payload;
        state.error= null;
      })

      .addCase(fetchMissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка при загрузке миссии";
      })
      .addCase(addElementToMission.fulfilled, (state) => {
        if (state.draftMission) {
        }
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
      .addCase(updateMissionElement.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
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
export const {setError, setMissionDraftId } = draftMissionSlice.actions;

export default draftMissionSlice.reducer;
