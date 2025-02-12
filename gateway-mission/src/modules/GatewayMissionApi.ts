
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





