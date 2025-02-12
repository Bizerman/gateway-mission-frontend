import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import {GatewayElement, GatewayElementsResp} from "../../api/Api.ts";


export const empty_element: GatewayElement = {
  id: 0,
  title: '',
  short_description: '',
  status: false,
  img_url: '',
  full_description: '',
};

const initialState: GatewayElementsResp = {
    searchValue: '',
    elements: [],
    draft_mission_id: 1,
    draft_element_count: 0,
    loading: false,
    error: null,
    element: empty_element,
};

export const getGatewayElementsList = createAsyncThunk(
  'elements/getGatewayElementsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.gatewayelsList.gatewayelsListList();
      return response.data.elements;
    } catch (error) {
      console.error("Ошибка при получении данных: ", error);
      // Отправляем ошибку с сообщением в payload
      return rejectWithValue("Ошибка доступа к API. Попробуйте позже.");
    }
  }
);

export const getGatewayElement = createAsyncThunk(
  'elements/getGatewayElement',
  async (element_id: number, { rejectWithValue }) => {
    try {
      setElementDetailId(element_id);
      const response = await api.gatewayel.gatewayelRead(element_id);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении элемента с ID ${element_id}: `, error);
      // Возвращаем ошибку, если элемент не найден
      return rejectWithValue(`Элемент с ID ${element_id} не найден.`);
    }
  }
);



const gatewayElementsSlice = createSlice({
  name: "gateway",
  initialState,
  reducers: {
      setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setElementDetailId(state,action){
      if (state.element!=null){
        state.element.id = action.payload.id
      }
    }
  },
  extraReducers: (builder) => {
      builder
          .addCase(getGatewayElementsList.pending, (state) => {
              state.loading = true;
          })
          .addCase(getGatewayElementsList.fulfilled, (state, action) => {
            state.loading = false;
            // Применяем фильтрацию на основе searchValue
            if (state.searchValue) {
              state.elements = action.payload.filter((element: GatewayElement) =>
                (element.title && element.title.toLowerCase().includes(state.searchValue.toLowerCase()))
              );
            } else {
              state.elements = action.payload;  // Если поисковое значение пустое, показываем все элементы
            }
          })
          .addCase(getGatewayElementsList.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string; // Сохраняем ошибку, если она была
          })
          .addCase(getGatewayElement.pending, (state) => {
              state.loading = true;
          })
          .addCase(getGatewayElement.fulfilled, (state, action) => {
              state.loading = false;
              state.element = action.payload;  // Обновляем элемент
          })
          .addCase(getGatewayElement.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string; // Сохраняем ошибку, если она была
          });
  }
});
export const { setSearchValue,setElementDetailId } = gatewayElementsSlice.actions;
export default gatewayElementsSlice.reducer;