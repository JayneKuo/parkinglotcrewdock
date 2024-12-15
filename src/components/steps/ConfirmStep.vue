<template>
  <div class="confirm-step">
    <h2>Confirm Booking</h2>
    
    <!-- 预定信息确认 -->
    <div class="confirmation-details">
      <!-- 装货信息 -->
      <div class="section">
        <h3>Load Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Load Type</label>
            <span>{{ loadType }}</span>
          </div>
          <div class="info-item">
            <label>Price Type</label>
            <span>{{ priceType }}</span>
          </div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="section">
        <h3>Time & Duration</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Date</label>
            <span>{{ formatDate(datetime) }}</span>
          </div>
          <div class="info-item">
            <label>Time</label>
            <span>{{ formatTime(datetime) }}</span>
          </div>
          <div class="info-item">
            <label>Parking Spots</label>
            <span>{{ spots }}</span>
          </div>
          <div class="info-item">
            <label>Duration</label>
            <span>{{ duration }}</span>
          </div>
        </div>
      </div>

      <!-- 司机信息 -->
      <div class="section">
        <h3>Driver Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Name</label>
            <span>{{ driverInfo.name }}</span>
          </div>
          <div class="info-item">
            <label>Phone</label>
            <span>{{ driverInfo.phone }}</span>
          </div>
          <div class="info-item">
            <label>License Plate</label>
            <span>{{ driverInfo.licensePlate }}</span>
          </div>
        </div>
      </div>

      <!-- 货物信息 -->
      <div class="section">
        <h3>Cargo Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Type</label>
            <span>{{ cargoInfo.type }}</span>
          </div>
          <div class="info-item">
            <label>Weight</label>
            <span>{{ cargoInfo.weight }} kg</span>
          </div>
        </div>
        <div class="info-item full-width" v-if="cargoInfo.instructions">
          <label>Special Instructions</label>
          <p>{{ cargoInfo.instructions }}</p>
        </div>
      </div>

      <!-- 价格计算 -->
      <div class="section price-section">
        <h3>Price Calculation</h3>
        <div class="price-details">
          <div class="price-item">
            <span>Base Rate ({{ getPriceRate() }}/hour)</span>
            <span>${{ calculateBasePrice() }}</span>
          </div>
          <div class="price-item">
            <span>Duration ({{ duration }})</span>
            <span>x {{ getDurationHours() }}</span>
          </div>
          <div class="price-item">
            <span>Parking Spots</span>
            <span>x {{ spots }}</span>
          </div>
          <div class="price-item total">
            <span>Total</span>
            <span>${{ calculateTotalPrice() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="step-actions">
      <el-button @click="handleBack">Back</el-button>
      <el-button type="primary" @click="handleConfirm">Confirm Booking</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  loadType: string
  priceType: string
  datetime: string
  spots: number
  duration: string
  driverInfo: {
    name: string
    phone: string
    licensePlate: string
  }
  cargoInfo: {
    type: string
    weight: number
    instructions: string
  }
}>()

const emit = defineEmits(['prev', 'confirm'])

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY/MM/DD')
}

// 格式化时间
const formatTime = (date: string) => {
  return dayjs(date).format('HH:mm A')
}

// 获取价格费率
const getPriceRate = () => {
  switch (props.priceType) {
    case 'Standard':
      return 50
    case 'Express':
      return 80
    case 'Premium':
      return 100
    default:
      return 50
  }
}

// 获取时长（小时）
const getDurationHours = () => {
  return parseInt(props.duration)
}

// 计算基础价格
const calculateBasePrice = () => {
  return getPriceRate()
}

// 计算总价
const calculateTotalPrice = () => {
  const baseRate = getPriceRate()
  const hours = getDurationHours()
  const spots = props.spots
  return baseRate * hours * spots
}

const handleBack = () => {
  emit('prev')
}

const handleConfirm = () => {
  emit('confirm', {
    loadType: props.loadType,
    priceType: props.priceType,
    datetime: props.datetime,
    spots: props.spots,
    duration: props.duration,
    driverInfo: props.driverInfo,
    cargoInfo: props.cargoInfo,
    totalPrice: calculateTotalPrice()
  })
}
</script>

<style scoped lang="scss">
.confirm-step {
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 32px;
    color: #1a1a1a;
  }

  .confirmation-details {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
  }

  .section {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e4e7ed;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #1a1a1a;
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .info-item {
    &.full-width {
      grid-column: 1 / -1;
    }

    label {
      display: block;
      font-size: 13px;
      color: #909399;
      margin-bottom: 4px;
    }

    span, p {
      font-size: 14px;
      color: #1a1a1a;
      margin: 0;
    }
  }

  .price-section {
    background: white;
    margin: 24px -24px -24px;
    padding: 24px;
    border-radius: 0 0 12px 12px;
  }

  .price-details {
    .price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      
      span {
        font-size: 14px;
        color: #606266;
      }

      &.total {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e4e7ed;
        
        span {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
      }
    }
  }

  .step-actions {
    margin-top: 48px;
    display: flex;
    justify-content: space-between;

    .el-button {
      min-width: 120px;
    }
  }
}
</style> 