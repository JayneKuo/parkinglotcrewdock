// 仓库类型
export interface Warehouse {
  id: number
  name: string
  address: string
  description: string
  openingHours: string
  contactPhone: string
  availableSlots?: TimeSlot[]
}

// 时间段类型
export interface TimeSlot {
  id: number
  date: string
  startTime: string
  endTime: string
  available: boolean
}

// 装卸类型
export interface LoadType {
  id: number
  name: string
  description: string
}

// 预约类型
export interface Appointment {
  id: number
  warehouseId: number
  warehouse?: Warehouse
  loadType: LoadType
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled'
  companyName: string
  driverName: string
  driverPhone: string
  truckNumber: string
  notes?: string
} 