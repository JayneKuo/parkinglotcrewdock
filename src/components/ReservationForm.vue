<template>
  <div class="reservation-form">
    <!-- 装货类型选择 -->
    <div class="form-section">
      <h3>Load Type</h3>
      <div class="load-type-grid">
        <div
          v-for="type in loadTypes"
          :key="type.value"
          class="load-type-card"
          :class="{ active: formData.loadType === type.value }"
          @click="formData.loadType = type.value"
        >
          <el-icon class="icon"><component :is="type.icon" /></el-icon>
          <span class="label">{{ type.label }}</span>
          <span class="description">{{ type.description }}</span>
        </div>
      </div>
    </div>

    <!-- 价格类型和时间选择 -->
    <div class="form-section">
      <h3>Pricing & Time</h3>
      <div class="pricing-time-container">
        <!-- 价格类型 -->
        <div class="pricing-type">
          <div
            v-for="type in pricingTypes"
            :key="type.value"
            class="pricing-card"
            :class="{ active: formData.priceType === type.value }"
            @click="formData.priceType = type.value"
          >
            <div class="price-header">
              <span class="label">{{ type.label }}</span>
              <span class="rate">${{ type.rate }}</span>
            </div>
            <span class="unit">per {{ type.unit }}</span>
          </div>
        </div>

        <!-- 时间选择 -->
        <div class="time-selection">
          <el-date-picker
            v-model="formData.reservationTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
            placeholder="Select date and time"
            :shortcuts="dateShortcuts"
            :disabledDate="disabledDate"
            :disabledHours="disabledHours"
          />
        </div>
      </div>
    </div>

    <!-- 数量和时长 -->
    <div class="form-section">
      <h3>Quantity & Duration</h3>
      <div class="quantity-duration-grid">
        <div class="input-group">
          <label>Number of Spots</label>
          <el-input-number 
            v-model="formData.parkingSpots" 
            :min="1" 
            :max="10"
            size="large"
          />
        </div>
        <div class="input-group">
          <label>Duration ({{ formData.priceType === 'hourly' ? 'Hours' : 'Days' }})</label>
          <el-input-number 
            v-model="formData.duration" 
            :min="1"
            :precision="0"
            size="large"
          />
        </div>
      </div>
    </div>

    <!-- 预定摘要 -->
    <div class="summary-section" v-if="showSummary">
      <h3>Booking Summary</h3>
      <div class="summary-content">
        <div class="summary-item">
          <span class="label">Load Type:</span>
          <span class="value">{{ getLoadTypeLabel(formData.loadType) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Rate Type:</span>
          <span class="value">{{ formData.priceType === 'hourly' ? 'Hourly Rate' : 'Daily Rate' }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Time:</span>
          <span class="value">{{ formatDateTime(formData.reservationTime) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Parking Spots:</span>
          <span class="value">{{ formData.parkingSpots }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Duration:</span>
          <span class="value">{{ formData.duration }} {{ formData.priceType === 'hourly' ? 'Hours' : 'Days' }}</span>
        </div>
        <div class="summary-item total">
          <span class="label">Total:</span>
          <span class="value">${{ calculateTotalPrice() }}</span>
        </div>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="form-actions">
      <el-button @click="handleCancel" size="large">Back</el-button>
      <el-button type="primary" @click="handleSubmit" size="large">Confirm Booking</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { 
  Box, Van, Warning, Timer, Calendar,
  Refrigerator, TakeawayBox
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const props = defineProps<{
  dockId: string | string[]
}>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'cancel'): void
  (e: 'update:loadType', type: string): void
  (e: 'update:datetime', datetime: Date): void
}>()

// 装货类型选项
const loadTypes = [
  {
    label: 'General Cargo',
    value: 'general',
    icon: 'Box',
    description: 'Standard goods and packages'
  },
  {
    label: 'Refrigerated',
    value: 'refrigerated',
    icon: 'Refrigerator',
    description: 'Temperature controlled storage'
  },
  {
    label: 'Hazardous',
    value: 'hazardous',
    icon: 'Warning',
    description: 'Dangerous goods handling'
  },
  {
    label: 'Express',
    value: 'express',
    icon: 'Van',
    description: 'Quick loading/unloading'
  }
]

// 价格类型选项
const pricingTypes = [
  {
    label: 'Hourly Rate',
    value: 'hourly',
    rate: 50,
    unit: 'hour',
    icon: Timer
  },
  {
    label: 'Daily Rate',
    value: 'daily',
    rate: 300,
    unit: 'day',
    icon: Calendar
  }
]

// 日期快捷选项
const dateShortcuts = [
  {
    text: 'Today',
    value: new Date()
  },
  {
    text: 'Tomorrow',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: 'Next Week',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
      return date
    }
  }
]

const formData = reactive({
  loadType: '',
  priceType: 'hourly',
  reservationTime: '',
  parkingSpots: 1,
  duration: 1
})

// 显示摘要的计算属性
const showSummary = computed(() => {
  return formData.loadType && formData.reservationTime && formData.parkingSpots > 0 && formData.duration > 0
})

// 获取装货类型标签
const getLoadTypeLabel = (type: string) => {
  const found = loadTypes.find(t => t.value === type)
  return found ? found.label : type
}

// 格式化日期时间
const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 禁用过去的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7
}

// 禁用的小时
const disabledHours = () => {
  const hours = []
  const currentHour = new Date().getHours()
  
  // 如果是今天，禁用过去的小时
  if (dayjs(formData.reservationTime).isSame(dayjs(), 'day')) {
    for (let i = 0; i < currentHour; i++) {
      hours.push(i)
    }
  }
  
  return hours
}

// 计算总价
const calculateTotalPrice = () => {
  const basePrice = formData.priceType === 'hourly' ? 50 : 300
  return basePrice * formData.parkingSpots * formData.duration
}

// 提交表单
const handleSubmit = async () => {
  if (!formData.loadType || !formData.reservationTime) {
    ElMessage.warning('Please fill in all required fields')
    return
  }
  
  ElMessage.success('Booking successful')
  emit('success')
}

// 取消预定
const handleCancel = () => {
  emit('cancel')
}

// 修改表单数据变更的处理
watch(() => formData.loadType, (newType) => {
  emit('update:loadType', getLoadTypeLabel(newType))
})

watch(() => formData.reservationTime, (newTime) => {
  if (newTime) {
    emit('update:datetime', newTime)
  }
})
</script>

<style scoped lang="scss">
.reservation-form {
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 32px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 16px;
  }
}

.load-type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.load-type-card {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: var(--el-color-primary);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }

  .icon {
    font-size: 24px;
    color: var(--el-color-primary);
    margin-bottom: 12px;
  }

  .label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .description {
    display: block;
    font-size: 13px;
    color: #666;
  }
}

.pricing-time-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.pricing-type {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.pricing-card {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &.active {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }

  .price-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .label {
    font-weight: 500;
  }

  .rate {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-color-primary);
  }

  .unit {
    font-size: 13px;
    color: #666;
  }
}

.time-selection {
  :deep(.el-date-editor) {
    width: 100%;
  }
}

.quantity-duration-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.input-group {
  label {
    display: block;
    margin-bottom: 8px;
    color: #606266;
  }
}

.summary-section {
  margin-top: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-content {
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    
    &.total {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e4e7ed;
      font-weight: 600;
      font-size: 18px;
    }
  }
}

.form-actions {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style> 