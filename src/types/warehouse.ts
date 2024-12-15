export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  distance: number;
  availableDocks: number;
  totalDocks: number;
  imageUrl: string;
  pricingType: 'hourly' | 'daily' | 'monthly';
  priceRate: number;
}

export interface USLocation {
  state: string;
  cities: string[];
}