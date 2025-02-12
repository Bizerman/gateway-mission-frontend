import {GatewayElementsResp} from "../api/Api.ts";

export const mockGatewayElements = (): GatewayElementsResp => ({
  draft_mission_id: 1,
  draft_element_count: 0,
  searchValue: '',
  elements: [
    {
      id: 11,
      title: "Cygnus",
      short_description: "Автономный грузовой космический корабль одноразового использования.",
      status: true,
      img_url: "http://127.0.0.1:9000/img-for-rip/images/cygnus.png",
      full_description: "Cygnus состоит из двух основных компонентов: сервисного модуля и грузового отсека. Сервисный модуль содержит двигатели, топливные баки, систему управления и другие системы, необходимые для управления полётом корабля."
    },
    {
      id: 12,
      title: "Power and Propulsion Element (PPE)",
      short_description: "Модуль будет обеспечивать станцию Gateway энергией и управлять её двигательной установкой.",
      status: true,
      img_url: "http://127.0.0.1:9000/img-for-rip/images/PPE.png",
      full_description: "Энерго-двигательный модуль обеспечит электроснабжение, маневрирование, контроль ориентации, системы связи и возможность стыковки. Испытательный запуск готового модуля на коммерческой ракете уже запланирован к концу 2022 года."
    },
    {
      id: 13,
      title: "Dragon Crew Spacecraft",
      short_description: "Автономный космический корабль, предназначенный для доставки экипажа и критически важных грузов на орбиту.",
      status: true,
      img_url: "http://127.0.0.1:9000/img-for-rip/images/dragon_crew.png",
      full_description: "Dragon Crew имеет длину около 8,1 метра и диаметр около 4 метров. Корабль состоит из двух основных частей: герметичного отсека, в котором находятся астронавты во время полёта, и негерметичного грузового отсека, который используется для перевозки грузов."
    },
    // Добавьте остальные элементы по аналогии
  ],
  loading: false,
  error: null,
});


