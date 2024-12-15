<template>
  <div class="appointment-detail">
    <!-- 顶部导航 -->
    <div class="detail-header">
      <div class="header-content">
        <div class="left-section">
          <button class="back-btn" @click="router.push('/appointments')">
            <el-icon><ArrowLeft /></el-icon>
          </button>
          <h1 class="title">Dock Order Details</h1>
        </div>
        <el-button type="primary" @click="printDetails">
          <el-icon><Printer /></el-icon>
          Print
        </el-button>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="detail-content">
      <!-- 订单信息 -->
      <div class="info-card">
        <div class="card-header">
          <h2>Order Information</h2>
          <el-tag :type="getStatusType" effect="light" size="large">{{ orderData.status }}</el-tag>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <label>Order Number</label>
              <div class="value text-mono">{{ orderData.orderNumber }}</div>
            </div>
            <div class="info-item">
              <label>Created Time</label>
              <div class="value">{{ orderData.createdAt }}</div>
            </div>
            <div class="info-item">
              <label>Status</label>
              <div class="value highlight">{{ orderData.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 司机信息 -->
      <div class="info-card">
        <div class="card-header">
          <h2>Driver Information</h2>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <label>Driver Name</label>
              <div class="value">{{ driverInfo.name }}</div>
            </div>
            <div class="info-item">
              <label>Phone Number</label>
              <div class="value">{{ driverInfo.phone }}</div>
            </div>
            <div class="info-item">
              <label>License Plate</label>
              <div class="value">{{ driverInfo.licensePlate }}</div>
            </div>
            <div class="info-item">
              <label>Carrier</label>
              <div class="value">{{ driverInfo.carrier }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 预定信息 -->
      <div class="info-card">
        <div class="card-header">
          <h2>Booking Information</h2>
        </div>
        <div class="card-content">
          <div class="warehouse-info">
            <div class="warehouse-name">{{ warehouseData.name }}</div>
            <div class="warehouse-address">{{ warehouseData.address }}</div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>Load Type</label>
              <div class="value">{{ bookingData.loadType }}</div>
            </div>
            <div class="info-item">
              <label>Billing Type</label>
              <div class="value">{{ bookingData.billingType }}</div>
            </div>
            <div class="info-item">
              <label>Number of Spots</label>
              <div class="value">{{ bookingData.spotCount }}</div>
            </div>
            <div class="info-item">
              <label>Start Time</label>
              <div class="value highlight">{{ bookingData.startTime }}</div>
            </div>
            <div class="info-item">
              <label>Estimated Duration</label>
              <div class="value">{{ bookingData.duration }}</div>
            </div>
            <div class="info-item">
              <label>Dock Number</label>
              <div class="value">
                <template v-if="bookingData.dockNumber">
                  {{ bookingData.dockNumber }}
                </template>
                <template v-else>
                  <el-tag type="info" effect="plain">Will be assigned after check-in</el-tag>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 停车信息 -->
      <div class="info-card" v-if="parkingInfo.hasInfo">
        <div class="card-header">
          <h2>Parking Information</h2>
        </div>
        <div class="card-content">
          <div class="timeline">
            <div class="timeline-item" v-if="parkingInfo.checkInTime">
              <div class="time">{{ parkingInfo.checkInTime }}</div>
              <div class="label">Check In</div>
            </div>
            <div class="timeline-item" v-if="parkingInfo.loadingCompleteTime">
              <div class="time">{{ parkingInfo.loadingCompleteTime }}</div>
              <div class="label">Loading Complete</div>
            </div>
            <div class="timeline-item" v-if="parkingInfo.checkOutTime">
              <div class="time">{{ parkingInfo.checkOutTime }}</div>
              <div class="label">Check Out</div>
            </div>
          </div>
          <div class="duration-info" v-if="parkingInfo.duration">
            <label>Total Duration</label>
            <div class="value highlight">{{ parkingInfo.duration }}</div>
          </div>
        </div>
      </div>

      <!-- 货物信息 -->
      <div class="info-card">
        <div class="card-header">
          <h2>Cargo Information</h2>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <label>Cargo Type</label>
              <div class="value">{{ cargoInfo.type || 'Not provided' }}</div>
            </div>
            <div class="info-item">
              <label>PO Number</label>
              <div class="value">{{ cargoInfo.poNumber || 'Not provided' }}</div>
            </div>
            <div class="info-item">
              <label>Weight</label>
              <div class="value">{{ cargoInfo.weight ? `${cargoInfo.weight} kg` : 'Not provided' }}</div>
            </div>
            <div class="info-item">
              <label>Quantity</label>
              <div class="value">{{ cargoInfo.quantity || 'Not provided' }}</div>
            </div>
          </div>
          <div class="description-item">
            <label>Description</label>
            <div class="value">{{ cargoInfo.description || 'Not provided' }}</div>
          </div>
        </div>
      </div>

      <!-- 订单摘要 -->
      <div class="info-card" v-if="!isLoadingComplete && orderSummary.show">
        <div class="card-header">
          <h2>Order Summary</h2>
        </div>
        <div class="card-content">
          <div class="summary-grid">
            <div class="summary-item">
              <label>Billing Type</label>
              <div class="value">{{ orderSummary.billingType }}</div>
            </div>
            <div class="summary-item">
              <label>Duration</label>
              <div class="value">{{ orderSummary.duration }}</div>
            </div>
            <div class="summary-item">
              <label>Service Fee</label>
              <div class="value">${{ orderSummary.serviceFee }}</div>
            </div>
            <div class="summary-item">
              <label>Tax</label>
              <div class="value">${{ orderSummary.tax }}</div>
            </div>
            <div class="summary-total">
              <label>Total Amount</label>
              <div class="value highlight">${{ orderSummary.total }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 支付信息 -->
      <div class="info-card" v-if="paymentInfo.show">
        <div class="card-header">
          <h2>Payment Information</h2>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <label>Payment Amount</label>
              <div class="value highlight">${{ paymentInfo.amount }}</div>
            </div>
            <div class="info-item">
              <label>Payment Method</label>
              <div class="value">{{ paymentInfo.method }}</div>
            </div>
            <div class="info-item">
              <label>Transaction ID</label>
              <div class="value text-mono">{{ paymentInfo.transactionId }}</div>
            </div>
            <div class="info-item">
              <label>Payment Time</label>
              <div class="value">{{ paymentInfo.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.appointment-detail {
  min-height: 100vh;
  background: #f8f9fa;

  .detail-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: white;
    border-bottom: 1px solid #eee;
    z-index: 10;

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left-section {
        display: flex;
        align-items: center;
        gap: 16px;

        .back-btn {
          padding: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #666;
          
          &:hover {
            color: #6366f1;
          }
        }

        .title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }
      }
    }
  }

  .detail-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 88px 24px 40px;

    .info-card {
      background: white;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      .card-header {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
      }

      .card-content {
        padding: 24px;
      }

      .warehouse-info {
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #f0f0f0;

        .warehouse-name {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .warehouse-address {
          font-size: 14px;
          color: #666;
        }
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;

        .info-item {
          label {
            display: block;
            font-size: 13px;
            color: #666;
            margin-bottom: 4px;
          }

          .value {
            font-size: 14px;
            color: #1a1a1a;

            &.highlight {
              color: #6366f1;
              font-weight: 500;
            }

            &.text-mono {
              font-family: monospace;
            }
          }
        }
      }

      .timeline {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 16px;

          .time {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 500;
            min-width: 150px;
          }

          .label {
            font-size: 14px;
            color: #666;
          }
        }
      }

      .duration-info {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        label {
          font-size: 14px;
          color: #666;
        }

        .value {
          font-size: 16px;
          font-weight: 500;
          color: #6366f1;
        }
      }

      .description-item {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #f0f0f0;

        label {
          display: block;
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }

        .value {
          font-size: 14px;
          color: #1a1a1a;
        }
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;

        .summary-item {
          label {
            display: block;
            font-size: 13px;
            color: #666;
            margin-bottom: 4px;
          }

          .value {
            font-size: 14px;
            color: #1a1a1a;
          }
        }

        .summary-total {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;

          label {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
          }

          .value {
            font-size: 18px;
            font-weight: 600;
            color: #6366f1;
          }
        }
      }
    }
  }
}

@media print {
  .detail-header {
    display: none;
  }

  .detail-content {
    padding: 0;
  }
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft,
  Printer,
  Check,
  DocumentCopy
} from '@element-plus/icons-vue'

const router = useRouter()

// 订单状态类型映射
const getStatusType = computed(() => {
  const statusMap: Record<string, string> = {
    'Scheduled': 'info',
    'Checked In': 'warning',
    'Loading Complete': 'success',
    'Checked Out': 'success',
    'Cancelled': 'danger'
  }
  return statusMap[orderData.value.status] || 'info'
})

// 模拟数据
const orderData = ref({
  orderNumber: 'DO2024022001',
  createdAt: '2024-02-20 10:30:00',
  status: 'Scheduled'
})

const driverInfo = ref({
  name: 'John Doe',
  phone: '123-456-7890',
  licensePlate: 'ABC123',
  carrier: 'ABC Logistics'
})

const warehouseData = ref({
  name: 'JFC Interbranch Distribution Center (IDC)',
  address: '7101 E. Slauson Ave. Commerce, CA 90040'
})

const bookingData = ref({
  loadType: 'Receiving - Ambient 35° to 53° trailers',
  billingType: 'Hourly Rate',
  spotCount: '1',
  startTime: '2024-02-21 09:00:00',
  duration: '2 hours',
  dockNumber: '' // 为空表示未分配
})

const parkingInfo = ref({
  hasInfo: true,
  checkInTime: '2024-02-21 09:05:00',
  loadingCompleteTime: '2024-02-21 10:30:00',
  checkOutTime: '2024-02-21 10:45:00',
  duration: '1 hour 40 minutes'
})

const cargoInfo = ref({
  type: 'General Cargo',
  poNumber: 'PO2024022001',
  weight: '1000',
  quantity: '100',
  description: 'Mixed goods'
})

const orderSummary = ref({
  show: true,
  billingType: 'Hourly Rate',
  duration: '2 hours',
  serviceFee: '100.00',
  tax: '10.00',
  total: '110.00'
})

const paymentInfo = ref({
  show: true,
  amount: '110.00',
  method: 'Credit Card',
  transactionId: 'TXN2024022001',
  time: '2024-02-21 10:50:00'
})

const isLoadingComplete = computed(() => {
  return orderData.value.status === 'Loading Complete'
})

const printDetails = () => {
  window.print()
}
</script> 