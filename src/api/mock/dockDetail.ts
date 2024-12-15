export const mockDockDetail = {
  id: 'dock-001',
  code: 'DOCK748',
  name: 'FC: STOCKTON',
  status: 1,
  services: [
    'Loading/Unloading',
    'Cross Docking',
    'Temporary Storage',
    'Refrigerated Storage',
    'Hazmat Handling',
    'Container Handling'
  ],
  availableVehicles: 5,
  totalVehicles: 8,
  address: '4510 Alitalia Ave',
  city: 'Stockton',
  state: 'CA',
  zipCode: '95206',
  latitude: 37.7949,
  longitude: -122.2968,
  priceRate: 45,
  pricingType: 'hourly',
  minimumCharge: 90,
  contactPerson: 'John Smith',
  contactPhone: '(209) 234-2195',
  emergencyContact: '(209) 234-2196',
  email: 'receiving748@staples.com',
  cancellationPolicy: 'Free cancellation up to 24 hours before appointment. Late cancellations will be charged 50% of booking fee.',
  lateFee: 25,
  noShowPenalty: 100,
  mainImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  photos: [
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  ],
  description: `
    Modern warehouse facility equipped with state-of-the-art loading docks and material handling equipment. 
    Our facility offers comprehensive logistics solutions including cross-docking, temporary storage, and specialized handling services. 
    Located in the heart of Stockton's industrial district with easy access to major highways.
    
    We maintain strict safety and security protocols, with 24/7 surveillance and trained personnel on-site. 
    Our facility is certified for handling various types of cargo, including temperature-sensitive and hazardous materials.
  `,
  operatingHours: {
    'Monday': '4:00 AM - 2:00 PM',
    'Tuesday': '4:00 AM - 2:00 PM',
    'Wednesday': '4:00 AM - 2:00 PM',
    'Thursday': '4:00 AM - 2:00 PM',
    'Friday': '4:00 AM - 2:00 PM',
    'Saturday': 'Closed',
    'Sunday': 'Closed'
  },
  buildingType: 'Cross-dock Warehouse',
  totalArea: 150000,
  ceilingHeight: 40,
  loadingCapacity: 50000,
  buildingPhotos: [
    'https://images.unsplash.com/photo-1586528116493-d2f45325d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  ],
  facilities: [
    {
      name: 'Loading Equipment',
      icon: 'Van',
      description: 'Forklifts, pallet jacks, and dock levelers available'
    },
    {
      name: 'Security System',
      icon: 'Lock',
      description: '24/7 surveillance, controlled access, and security personnel'
    },
    {
      name: 'Climate Control',
      icon: 'Sunny',
      description: 'Temperature and humidity controlled storage areas'
    },
    {
      name: 'Staging Area',
      icon: 'Box',
      description: 'Dedicated staging areas for efficient loading/unloading'
    },
    {
      name: 'Office Space',
      icon: 'Office',
      description: 'On-site office facilities available'
    },
    {
      name: 'Break Room',
      icon: 'Coffee',
      description: 'Driver break room with amenities'
    }
  ],
  equipment: [
    {
      name: 'Forklifts',
      quantity: 5
    },
    {
      name: 'Pallet Jacks',
      quantity: 10
    },
    {
      name: 'Dock Levelers',
      quantity: 8
    },
    {
      name: 'Dock Seals',
      quantity: 8
    }
  ],
  terms: `
    1. All users must comply with facility safety regulations
    2. Proper documentation required for all shipments
    3. Insurance requirements must be met before using facility
    4. Equipment operation only by certified personnel
    5. Compliance with all local and federal regulations required
  `,
  disclaimer: `
    While we strive to provide the highest level of service and safety, users of this facility do so at their own risk. 
    We are not responsible for any damage, loss, or injury that may occur during the use of our facilities. 
    All users must carry appropriate insurance coverage and follow prescribed safety procedures.
  `,
  insurance: `
    Required Insurance Coverage:
    - Commercial General Liability: $1,000,000 per occurrence
    - Auto Liability: $1,000,000 combined single limit
    - Workers Compensation: As required by state law
    - Cargo Insurance: $100,000 minimum
    
    All policies must name Staples FC: STOCKTON as additional insured.
  `
}; 