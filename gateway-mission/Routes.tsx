export const ROUTES = {
  HOME: "/",
  GATEWAY_ELEMENTS: "/elements",
  GATEWAY_ELEMENT_DETAIL: "/element/:id",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  GATEWAY_ELEMENTS: "Элементы",
  GATEWAY_ELEMENT_DETAIL: "Детали элемента",
};
