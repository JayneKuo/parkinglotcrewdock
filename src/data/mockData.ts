import type { Warehouse, USLocation } from '@/types/warehouse';

// Warehouse data
export const mockWarehouses: Warehouse[] = [
  {
    id: 'dock-001',
    name: 'Oakland Port Terminal A',
    address: '1 Market Street',
    city: 'Oakland',
    state: 'CA',
    zipCode: '94607',
    latitude: 37.7949,
    longitude: -122.2968,
    distance: 0.8,
    availableDocks: 5,
    totalDocks: 8,
    imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    pricingType: 'hourly',
    priceRate: 45
  },
  {
    id: '1',
    name: 'Silicon Valley Storage Hub',
    address: '789 Technology Drive',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95110',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    availableDocks: 15,
    totalDocks: 20,
    distance: 2.5,
    pricingType: 'hourly',
    priceRate: 25,
    latitude: 37.3382,
    longitude: -121.8863
  },
  {
    id: '2',
    name: 'SF Bay Area Logistics Center',
    address: '456 Harbor Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    availableDocks: 8,
    totalDocks: 25,
    distance: 5.7,
    pricingType: 'daily',
    priceRate: 150,
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: '3',
    name: 'LA Port Storage Facility',
    address: '321 Port Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90012',
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    availableDocks: 20,
    totalDocks: 30,
    distance: 8.2,
    pricingType: 'monthly',
    priceRate: 2000,
    latitude: 34.0522,
    longitude: -118.2437
  }
];

// US locations data
export const usLocations: USLocation[] = [
  {
    state: 'California',
    cities: ['San Francisco', 'Los Angeles', 'San Jose', 'San Diego', 'Sacramento']
  },
  {
    state: 'New York',
    cities: ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany']
  },
  {
    state: 'Texas',
    cities: ['Houston', 'Austin', 'Dallas', 'San Antonio', 'Fort Worth']
  },
  {
    state: 'Florida',
    cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee']
  }
]; 