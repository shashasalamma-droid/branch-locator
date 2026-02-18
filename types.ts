
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  coords: Coordinates;
  phone: string;
  hours: string;
  specialties: string[];
  transport?: string;
  distance?: number;
}

export interface UserLocation {
  coords: Coordinates;
  address?: string;
}

export interface AIResponse {
  message: string;
  recommendation?: string;
  groundingUrls?: Array<{ title: string; uri: string }>;
}