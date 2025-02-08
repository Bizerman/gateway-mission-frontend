import { GatewayElementsResult } from "./GatewayMissionApi.ts";
import image from "../assets/default.jpg"
export const mockGatewayElements = (): GatewayElementsResult => ({
  elements: [
    {
      id: 1,
      title: "Apollo 11",
      short_description: "Первый пилотируемый полет на Луну",
      status: true,
      img_url: image,
      full_description: "Apollo 11 – миссия НАСА, которая доставила первых людей на Луну в 1969 году.",
    },
    {
      id: 2,
      title: "Falcon Heavy",
      short_description: "Тяжелая ракета-носитель SpaceX",
      status: true,
      img_url: image,
      full_description: "Falcon Heavy – мощнейшая ракета-носитель, разработанная компанией SpaceX.",
    },
    {
      id: 3,
      title: "ISS Module",
      short_description: "Модуль Международной космической станции",
      status: false,
      img_url: image,
      full_description: "Один из модулей Международной космической станции (МКС), используемый для научных исследований.",
    },
  ],
  draft_mission_id: 1,
  draft_element_count: 3,
});
