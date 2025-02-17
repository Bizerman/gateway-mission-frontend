import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import {GatewayElement, GatewayElementsResp, GatewayElementWithoutImg, RequestParams} from "../../api/Api.ts";


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
      return response.data;
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

export const addNewGatewayElement = createAsyncThunk(
  'gateway/addElement',
  async (data: GatewayElementWithoutImg, { rejectWithValue }) => {
    try {
      const response = await api.gatewayelsList.gatewayelsListCreate(data);
      return response.data; // Используем данные из ответа
    } catch (error) {
      return rejectWithValue(error); // В случае ошибки
    }
  }
);
export const deleteGatewayElement = createAsyncThunk(
  'gateway/deleteElement',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.gatewayel.gatewayelDelete(id);
      return id; // Возвращаем id удаленного элемента для обновления состояния
    } catch (error) {
      return rejectWithValue(error); // В случае ошибки
    }
  }
);
export const updateGatewayElement = createAsyncThunk(
  'gateway/updateElement',
  async ({ id, data }: { id: string; data: GatewayElementWithoutImg }, { rejectWithValue }) => {
    try {
      const response = await api.gatewayel.gatewayelPutUpdate(id, data);
      return response; // Возвращаем обновленные данные
    } catch (error) {
      return rejectWithValue(error); // В случае ошибки
    }
  }
);
// Расширяем тип RequestParams для поддержки FormData
interface ExtendedRequestParams extends RequestParams {
  body?: FormData; // Разрешаем передавать FormData
}

export const uploadImage = createAsyncThunk(
  'gateway/uploadImage',
  async ({ id, image }: { id: string; image: File }) => {
    const formData = new FormData();
    formData.append('img', image); // Убедитесь, что ключ 'img', как на сервере

    // Передаем в запрос с расширенным типом
    const params: ExtendedRequestParams = {
      body: formData,
    };

    const response = await api.gatewayel.gatewayelImageCreate(id, params);

    return response;
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
    },
    setElements: (state, action) => {
      state.elements = action.payload;
    },
  },
  extraReducers: (builder) => {
      builder
          .addCase(getGatewayElementsList.pending, (state) => {
              state.loading = true;
          })
          .addCase(getGatewayElementsList.fulfilled, (state, action) => {
            state.loading = false;
            state.draft_element_count = action.payload.draft_element_count
              state.draft_mission_id = action.payload.draft_mission_id
            // Применяем фильтрацию на основе searchValue
            if (state.searchValue) {
              state.elements = action.payload.elements.filter((element: GatewayElement) =>
                (element.title && element.title.toLowerCase().includes(state.searchValue.toLowerCase()))
              );
            } else {
              state.elements = action.payload.elements;  // Если поисковое значение пустое, показываем все элементы
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
          })
          .addCase(addNewGatewayElement.pending, (state) => {
            state.loading = true;
          })
          .addCase(addNewGatewayElement.fulfilled, (state, action) => {
            state.loading = false;
            state.elements.push(action.payload); // Добавляем новый элемент в состояние
          })
          .addCase(addNewGatewayElement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          .addCase(deleteGatewayElement.pending, (state) => {
            state.loading = true;
          })
          .addCase(deleteGatewayElement.fulfilled, (state, action) => {
            state.loading = false;
            // Удаляем элемент из массива
            state.elements = state.elements.filter(
              (element) => String(element.id) !== action.payload
            );
          })
          .addCase(deleteGatewayElement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          .addCase(updateGatewayElement.pending, (state) => {
            state.loading = true;
          })
          .addCase(updateGatewayElement.fulfilled, (state, action) => {
            state.loading = false;
            // Обновляем элемент в массиве
            state.elements.push({
              ...action.payload,
              status: Boolean(action.payload.status), // Преобразуем статус в boolean
            });
          })
          .addCase(updateGatewayElement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
            .addCase(uploadImage.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadImage.fulfilled, (state) => {
              state.loading = false;
            })
            .addCase(uploadImage.rejected, (state, action) => {
              state.loading = false;
              state.error = String(action.error.message);
            });
  }
});
export const { setSearchValue,setElementDetailId,setElements  } = gatewayElementsSlice.actions;
export default gatewayElementsSlice.reducer;