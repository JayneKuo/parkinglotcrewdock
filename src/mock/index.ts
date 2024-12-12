import type { Warehouse, LoadType, TimeSlot, Appointment } from '@/types'

// 仓库列表
export const warehouses: Warehouse[] = [
  {
    id: 1,
    name: '上海浦东物流仓',
    address: '上海市浦东新区XX路123号',
    description: '位于浦东自贸区，配备现代化装卸设备，提供24小时服务。靠近外环线，交通便利。',
    openingHours: '全天24小时',
    contactPhone: '021-12345678',
  },
  {
    id: 2,
    name: '青浦配送中心',
    address: '上海市青浦区XX路456号',
    description: '位于沪青平高速入口处，交通便利，配备自动化立体仓储系统。',
    openingHours: '06:00-22:00',
    contactPhone: '021-87654321',
  },
  {
    id: 3,
    name: '松江物流园',
    address: '上海市松江区XX路789号',
    description: '靠近G60科创走廊，专业冷链仓储，温控精准。',
    openingHours: '07:00-21:00',
    contactPhone: '021-98765432',
  }
]

// 装卸类型
export const loadTypes: LoadType[] = [
  {
    id: 1,
    name: '普通装货',
    description: '适用于标准货物的装载，包括纸箱、托盘等'
  },
  {
    id: 2,
    name: '普通卸货',
    description: '适用于标准货物的卸载，包括纸箱、托盘等'
  },
  {
    id: 3,
    name: '冷链装货',
    description: '适用于需要温控的货物装载，如食品、药品等'
  },
  {
    id: 4,
    name: '冷链卸货',
    description: '适用于需要温控的货物卸载，如食品、药品等'
  },
  {
    id: 5,
    name: '大件装货',
    description: '适用于超大或超重货物的装载，需要特殊设备'
  },
  {
    id: 6,
    name: '大件卸货',
    description: '适用于超大或超重货物的卸载，需要特殊设备'
  }
]

// 时间段
export const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 8
  const endHour = 20
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      id: hour - startHour + 1,
      date: date,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      available: Math.random() > 0.3 // 随机生成可用状态
    })
  }
  
  return slots
}

// 预约列表
export const appointments: Appointment[] = [
  {
    id: 1,
    warehouseId: 1,
    warehouse: warehouses[0],
    loadType: loadTypes[0],
    date: '2024-01-20',
    startTime: '09:00',
    endTime: '10:00',
    status: 'confirmed',
    companyName: '上海XX物流有限公司',
    driverName: '张三',
    driverPhone: '13812345678',
    truckNumber: '沪A12345'
  },
  {
    id: 2,
    warehouseId: 2,
    warehouse: warehouses[1],
    loadType: loadTypes[1],
    date: '2024-01-21',
    startTime: '14:00',
    endTime: '15:00',
    status: 'pending',
    companyName: '江苏XX运输有限公司',
    driverName: '李四',
    driverPhone: '13987654321',
    truckNumber: '苏B67890'
  },
  {
    id: 3,
    warehouseId: 3,
    warehouse: warehouses[2],
    loadType: loadTypes[2],
    date: '2024-01-22',
    startTime: '10:00',
    endTime: '11:00',
    status: 'cancelled',
    companyName: '浙江XX快运有限公司',
    driverName: '王五',
    driverPhone: '13567890123',
    truckNumber: '浙C54321'
  }
] 