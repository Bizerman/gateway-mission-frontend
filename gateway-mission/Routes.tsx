export const ROUTES = {
  HOME: "/",
  GATEWAY_ELEMENTS: "/elements",
  ELEMENTS_EDITION: "/elements/edit",
  GATEWAY_ELEMENT_DETAIL: "/element/:element_id",
  ADD_TO_MISSION: "/gatewayel/:element_id/addtomission",
  MISSION: "/mission/:mission_id",
  MISSIONS: "/missions/",
  LOGIN: "/login",
  PROFILE: "/profile",
  REGISTER: "/register"
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  GATEWAY_ELEMENTS: "Элементы",
  ELEMENTS_EDITION: "Редактирование элементов",
  GATEWAY_ELEMENT_DETAIL: "Полная информация элемента",
  MISSION: "Миссия",
  MISSIONS: "Миссии",
  ADD_TO_MISSION: "Добавить в миссию",
  LOGIN: "Авторизация",
  PROFILE: "Профиль",
  REGISTER: "Регистрация"
};