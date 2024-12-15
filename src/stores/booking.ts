import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  // 预定信息
  const selectedWarehouse = ref('')
  const selectedLoadType = ref('')
  const selectedDate = ref('')
  const selectedTime = ref('')
  const selectedDuration = ref('')
  
  // 司机信息
  const driverInfo = ref({
    carrier: '',
    name: '',
    phone: '',
    licensePlate: ''
  })
  
  // 货物信息
  const cargoInfo = ref({
    type: '',
    poNumber: '',
    weight: 0,
    pallets: 0,
    description: ''
  })

  // 重置所有数据
  const resetAll = () => {
    selectedWarehouse.value = ''
    selectedLoadType.value = ''
    selectedDate.value = ''
    selectedTime.value = ''
    selectedDuration.value = ''
    
    driverInfo.value = {
      carrier: '',
      name: '',
      phone: '',
      licensePlate: ''
    }
    
    cargoInfo.value = {
      type: '',
      poNumber: '',
      weight: 0,
      pallets: 0,
      description: ''
    }
  }

  // 设置仓库和装卸类型
  const setBasicInfo = (warehouse: string, loadType: string) => {
    selectedWarehouse.value = warehouse
    selectedLoadType.value = loadType
  }

  // 设置时间信息
  const setTimeInfo = (date: string, time: string, duration: string) => {
    selectedDate.value = date
    selectedTime.value = time
    selectedDuration.value = duration
  }

  // 设置司机信息
  const setDriverInfo = (info: {
    carrier: string
    name: string
    phone: string
    licensePlate: string
  }) => {
    driverInfo.value = info
  }

  // 设置货物信息
  const setCargoInfo = (info: {
    type: string
    poNumber: string
    weight: number
    pallets: number
    description: string
  }) => {
    cargoInfo.value = info
  }

  return {
    // 状态
    selectedWarehouse,
    selectedLoadType,
    selectedDate,
    selectedTime,
    selectedDuration,
    driverInfo,
    cargoInfo,
    
    // 方法
    resetAll,
    setBasicInfo,
    setTimeInfo,
    setDriverInfo,
    setCargoInfo
  }
}) 