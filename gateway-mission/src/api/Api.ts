/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface GatewayElement {
  /** ID */
  id?: number;
  /**
   * Название элемента
   * @minLength 1
   * @maxLength 64
   */
  title?: string;
  /**
   * Описание карточки
   * @minLength 1
   */
  short_description?: string;
  /** Статус */
  status?: boolean;
  /**
   * Изображение элемента
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  img_url?: string;
  /** Полное описание элемента */
  full_description?: string | null;
}
export interface GatewayElementsResp {
    element?: GatewayElement | null;
    draft_mission_id: 1,
    draft_element_count: 0
    searchValue: string;
    elements: GatewayElement[];
    loading: boolean;
    error: string | null;
}
export interface GatewayElementWithoutImg {
  /** ID */
  id?: number;
  /**
   * Название элемента
   * @minLength 1
   * @maxLength 64
   */
  title?: string;
  /**
   * Описание карточки
   * @minLength 1
   */
  short_description?: string;
  /** Статус */
  status?: boolean;
  /** Полное описание элемента */
  full_description?: string | null;
}

export interface GatewayElementMission {
  /** Element id */
  element_id?: string;
  /** Mission id */
  mission_id?: string;
}

export interface GatewayMission {
  /** ID */
  id?: number;
  /** Название миссии */
  mission_name?: string | null;
  /**
   * Дата полета
   * @format date-time
   */
  plan_date?: string | null;
  /** Cтатус */
  status?: 1 | 2 | 3 | 4 | 5;
  /**
   * Дата создания
   * @format date-time
   */
  create_datetime?: string;
  /**
   * Form datetime
   * @format date-time
   */
  form_datetime?: string | null;
  /**
   * Complete datetime
   * @format date-time
   */
  complete_datetime?: string | null;
  /** Модер */
  moderator?: number | null;
  /** Пользователь */
  creator?: number | null;
  /** Комментарий */
  addition?: string | null;
  elements?: GatewayElementMission[];
}
export interface MissionPayload {
  mission: {
    id: number;
    mission_name: string | null;
    plan_date: string | null;
    status: 'Введена' | 'В процессе' | 'Завершена'; // Статус можно уточнить, если есть больше значений
    create_datetime: string;
    form_datetime: string | null;
    complete_datetime: string | null;
    moderator: string | null;
    creator: string;
    addition: string | null;
  };
  elements: {
    id: number;
    title: string;
    short_description: string;
    status: boolean;
    img_url: string;
    full_description: string;
  }[];
}

export interface GatewayMissionAddition {
  /** Название миссии */
  mission_name?: string | null;
  /** Комментарий */
  addition?: string | null;
}

export interface GatewayAddition {
  /**
   * Комментарий
   * @maxLength 256
   */
  addition?: string | null;
}
export interface LoginResponse {
  message: string;
  user_data: {
    username: string;
    email: string;
    role: number;
    id: number;
    token: string;
  };
}

export interface UpdateResponse{
    username:string;
    email: string;
}
export interface UserLogin {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Password
   * @minLength 1
   * @maxLength 128
   */
  password: string;
}

export interface UserRegistration {
  /**
   * Username
   * @minLength 1
   * @maxLength 150
   */
  username: string;
  /**
   * First name
   * @minLength 1
   * @maxLength 150
   */
  first_name: string;
  /**
   * Last name
   * @minLength 1
   * @maxLength 150
   */
  last_name: string;
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Password
   * @minLength 1
   * @maxLength 128
   */
  password: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";
import Cookies from 'js-cookie'; // Используем js-cookie для получения CSRF токена из cookie

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');
axios.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('csrftoken'); // Получаем новый CSRF токен из cookies
  console.log("Это токен из интерцептора", csrfToken);
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken; // Добавляем токен в заголовки каждого запроса
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Обновление CSRF токена
export const updateCsrfToken = () => {
  const csrfToken = Cookies.get('csrftoken');

  if (csrfToken) {
    if (axios.defaults.headers.common['X-CSRFToken'] !== csrfToken) {
      axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
      console.log('Токен обновлен:', csrfToken);
    } else {
      console.log('Токен не обновился, текущий:', csrfToken);
    }
  } else {
    console.error('CSRF токен отсутствует!');
  }
}

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  gatewayel = {
    /**
     * @description Возвращает элемент шлюза по ID.
     *
     * @tags gatewayel
     * @name GatewayelRead
     * @summary Получить элемент шлюза
     * @request GET:/gatewayel/{id}/
     * @secure
     */
    gatewayelRead: (id: number, params: RequestParams = {}) =>
      this.request<GatewayElement, any>({
        path: `/gatewayel/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет элемент и связанные данные.
     *
     * @tags gatewayel
     * @name GatewayelDelete
     * @summary Удалить элемент
     * @request DELETE:/gatewayel/{id}/
     * @secure
     */
    gatewayelDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/gatewayel/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags gatewayel
     * @name GatewayelAddtomissionCreate
     * @request POST:/gatewayel/{id}/addtomission/
     * @secure
     */
    gatewayelAddtomissionCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/gatewayel/${id}/addtomission/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags gatewayel
     * @name GatewayelImageCreate
     * @request POST:/gatewayel/{id}/image/
     * @secure
     */
    gatewayelImageCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/gatewayel/${id}/image/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновляет данные элемента
     *
     * @tags gatewayel
     * @name GatewayelPutUpdate
     * @summary Обновить элемент
     * @request PUT:/gatewayel/{id}/put/
     * @secure
     */
    gatewayelPutUpdate: (id: string, data: GatewayElement, params: RequestParams = {}) =>
      this.request<GatewayElement, void>({
        path: `/gatewayel/${id}/put/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  gatewayelsList = {
    /**
     * @description Возвращает список элементов.
     *
     * @tags gatewayels_list
     * @name GatewayelsListList
     * @summary Получить список элементов
     * @request GET:/gatewayels_list/
     * @secure
     */
    gatewayelsListList: (params: RequestParams = {}) =>
      this.request<GatewayElementsResp, any>({
        path: `/gatewayels_list/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gatewayels_list
     * @name GatewayelsListCreate
     * @request POST:/gatewayels_list/
     * @secure
     */
    gatewayelsListCreate: (data: GatewayElementWithoutImg, params: RequestParams = {}) =>
      this.request<GatewayElementWithoutImg, any>({
        path: `/gatewayels_list/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  mission = {
    /**
     * @description Переводит миссию в статус 2, проверяет данные.
     *
     * @tags mission
     * @name MissionFormUpdate
     * @summary Сформировать миссию
     * @request PUT:/mission/form/
     * @secure
     */
    missionFormUpdate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/mission/form/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает миссию по ID. Также возвращает связанные элементы.
     *
     * @tags mission
     * @name MissionRead
     * @summary Получить миссию
     * @request GET:/mission/{id}/
     * @secure
     */
    missionRead: (id: string, params: RequestParams = {}) =>
      this.request<MissionPayload, any>({
        path: `/mission/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные миссии. Доступно только для статусов 1 и 2.
     *
     * @tags mission
     * @name MissionUpdate
     * @summary Обновить миссию шлюза
     * @request PUT:/mission/{id}/
     * @secure
     */
    missionUpdate: (id: string, data: GatewayMissionAddition, params: RequestParams = {}) =>
      this.request<GatewayMissionAddition, any>({
        path: `/mission/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Помечает миссию удаленной, если она не является черновиком.
     *
     * @tags mission
     * @name MissionDelete
     * @summary Удалить миссию
     * @request DELETE:/mission/{id}/
     * @secure
     */
    missionDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/mission/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Меняет статус миссии на завершен или отклонен. Устанавливает модератора.
     *
     * @tags mission
     * @name MissionCompleteUpdate
     * @summary Завершить миссию
     * @request PUT:/mission/{id}/complete/
     * @secure
     */
    missionCompleteUpdate: (id: string, data: GatewayMission, params: RequestParams = {}) =>
      this.request<GatewayMission, any>({
        path: `/mission/${id}/complete/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновление элемента в м-м
     *
     * @tags mission
     * @name MissionElementUpdate
     * @request PUT:/mission/{mission_id}/element/{element_id}/
     * @secure
     */
    missionElementUpdate: (missionId: string, elementId: string, data: GatewayAddition, params: RequestParams = {}) =>
      this.request<GatewayElementMission, void>({
        path: `/mission/${missionId}/element/${elementId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление элемента из заявки
     *
     * @tags mission
     * @name MissionElementDelete
     * @request DELETE:/mission/{mission_id}/element/{element_id}/
     * @secure
     */
    missionElementDelete: (missionId: string, elementId: string, params: RequestParams = {}) =>
      this.request<
        {
          message?: string;
          mission_id?: number;
          element_id?: number;
        },
        void
      >({
        path: `/mission/${missionId}/element/${elementId}/`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  missions = {
    /**
     * @description Возвращает список миссий с возможностью фильтрации по статусу и дате.
     *
     * @tags missions
     * @name MissionsList
     * @summary Получить список миссий
     * @request GET:/missions/
     * @secure
     */
    missionsList: (params: RequestParams = {}) =>
      this.request<GatewayMission[], any>({
        path: `/missions/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserLoginCreate
     * @request POST:/user/login/
     * @secure
     */
    userLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<LoginResponse, any>({
        path: `/user/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserLogoutCreate
     * @request POST:/user/logout/
     * @secure
     */
    userLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserRegistrationCreate
     * @request POST:/user/registration/
     * @secure
     */
    userRegistrationCreate: (data: UserRegistration, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/registration/`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserChangeProfileUpdate
     * @request PUT:/user/{id}/change_profile/
     * @secure
     */
    userChangeProfileUpdate: (id: number, data: UserRegistration, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/${id}/change_profile/`,
        method: "PUT",
        body: data,
        secure: true,
        ...params,
      }),
  };
}
