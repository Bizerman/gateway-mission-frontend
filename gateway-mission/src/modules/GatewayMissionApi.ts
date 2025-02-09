import {mockGatewayElements} from "./mocks.ts";

export interface GatewayElement {
  id: number;
  title: string;
  short_description: string;
  status: boolean;
  img_url: string;
  full_description: string;
}

export interface GatewayElementsResult {
  elements: GatewayElement[];
  draft_mission_id: number;
  draft_element_count: number;
}

const API_URL = "http://192.168.1.20:8000/gatewayels_list/"; // Используем правильный URL

// Функция запроса к API с fallback на mock-данные
export const getGatewayElements = async (): Promise<GatewayElementsResult> => {
  try {
    const url = API_URL;
    console.log('API запрос на:', url);  // Выводим URL для проверки
    const response = await fetch(url);
    if (!response.ok) throw new Error("Ошибка запроса");
    return await response.json();
  } catch (error) {
    console.warn("Ошибка доступа к API, используем mock-данные", error);
    return mockGatewayElements();
  }
};
export const getElementById = async (id: number | string): Promise<GatewayElement> => {
    try {
        const response = await fetch(`http://localhost:8000/gatewayel/${id}`);
        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
        }
        return await response.json(); // API возвращает один объект, а не массив
    } catch (error) {
        console.warn(`Ошибка доступа к API, используем mock-данные: ${error}`);

        // Ищем нужный элемент среди моковых данных
        const mockElement = mockGatewayElements().elements.find(el => el.id === Number(id));

        if (!mockElement) {
            throw new Error("Элемент не найден даже в моковых данных");
        }

        return mockElement;
    }
};



