export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  imageUrl: string;
  availableDocks: number;
  totalDocks: number;
  distance: number;
  pricingType: 'hourly' | 'daily' | 'monthly';
  priceRate: number;
  latitude: number;
  longitude: number;
}

export interface USLocation {
  state: string;
  cities: string[];
}