<template>
  <div class="appointments-page">
    <!-- Add page title -->
    <div class="page-title">
      <h1>My Bookings</h1>
    </div>

    <div class="page-container">
      <!-- Update page header -->
      <div class="page-header">
        <div class="header-content">
          <p class="subtitle">View and manage all your dock appointments</p>
        </div>
      </div>

      <!-- Booking status timeline with stats -->
      <div class="booking-timeline">
        <div class="timeline-header">
          <h2>Booking Status Timeline</h2>
          <p>Track your current booking stage</p>
        </div>
        <div class="timeline-flow">
          <div 
            v-for="(status, index) in bookingStatuses" 
            :key="status.value"
            class="timeline-step"
            :class="{ active: hasActiveBookingInStatus(status.value) }"
          >
            <div class="step-icon">
              <el-icon><component :is="status.icon" /></el-icon>
            </div>
            <div class="step-content">
              <span class="step-name">{{ status.label }}</span>
              <span class="step-count">{{ getStatusCount(status.value) }}</span>
              <span class="step-desc">{{ status.description }}</span>
            </div>
            <div v-if="index < bookingStatuses.length - 1" class="step-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and filters -->
      <div class="toolbar">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="Search by booking number or warehouse..."
            :prefix-icon="Search"
            clearable
            class="search-input"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="filter-box">
          <el-radio-group v-model="currentPeriod" size="large">
            <el-radio-button label="today">Today</el-radio-button>
            <el-radio-button label="7days">Next 7 Days</el-radio-button>
            <el-radio-button label="all">All Bookings</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- Booking cards -->
      <div class="bookings-list">
        <div 
          v-for="booking in filteredAppointments" 
          :key="booking.id"
          class="booking-card"
          :class="getStatusClass(booking.status)"
          @click="handleRowClick(booking)"
        >
          <div class="card-header">
            <div class="booking-info">
              <span class="booking-number">Booking #{{ booking.orderNumber }}</span>
              <div class="status-badge" :style="{ background: getStatusColor(booking.status) + '15', color: getStatusColor(booking.status) }">
                <el-icon><component :is="getStatusIcon(booking.status)" /></el-icon>
                <span>{{ getStatusText(booking.status) }}</span>
              </div>
            </div>
            <div class="time-info">
              <el-icon><Timer /></el-icon>
              <span class="date">{{ formatDate(booking.datetime) }}</span>
              <span class="time">{{ formatTime(booking.datetime) }}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="info-grid">
              <div class="info-item warehouse">
                <div class="info-icon">
                  <el-icon><Location /></el-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Warehouse</span>
                  <span class="info-value">{{ booking.warehouse }}</span>
                  <span class="info-sub">{{ booking.city }}</span>
                </div>
              </div>
              
              <div class="info-item load-type">
                <div class="info-icon">
                  <el-icon><Box /></el-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Load Type</span>
                  <span class="info-value">{{ booking.loadType }}</span>
                  <span class="info-sub">Est. {{ booking.duration }}</span>
                </div>
              </div>

              <div class="info-item spot">
                <div class="info-icon">
                  <el-icon><Position /></el-icon>
                </div>
                <div class="info-content">
                  <span class="info-label">Dock Info</span>
                  <span class="info-value">{{ booking.spotNumber || 'To be assigned' }}</span>
                  <span class="info-sub">Please arrive on time</span>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <el-button 
                v-if="booking.status === STATUS.REQUEST"
                type="danger" 
                plain
                class="action-btn cancel-btn"
                @click.stop="handleCancel(booking)"
              >
                Cancel Booking
              </el-button>
              <el-button 
                v-if="booking.status === STATUS.REQUEST"
                type="warning" 
                plain
                class="action-btn edit-btn"
                @click.stop="handleEdit(booking)"
              >
                Edit Booking
                <el-icon class="el-icon--right"><Edit /></el-icon>
              </el-button>
              <el-button 
                v-if="booking.status === STATUS.LOADED"
                type="success" 
                plain
                class="action-btn pay-btn"
                @click.stop="handlePayment(booking)"
              >
                Pay Now
                <el-icon class="el-icon--right"><CreditCard /></el-icon>
              </el-button>
              <el-button 
                type="primary"
                class="action-btn details-btn"
                @click.stop="handleRowClick(booking)"
              >
                View Details
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <div class="page-info">
          <span class="total-count">{{ totalRows }}</span>
          <span class="text">bookings in total</span>
        </div>
        <div class="page-controls">
          <el-button 
            :disabled="currentPage === 1"
            class="nav-btn prev"
            @click="currentPage--"
          >
            <el-icon><ArrowLeft /></el-icon>
            Previous
          </el-button>
          <div class="page-numbers">
            <span class="current">{{ currentPage }}</span>
            <span class="divider">/</span>
            <span class="total">{{ Math.ceil(totalRows / pageSize) }}</span>
          </div>
          <el-button 
            :disabled="isLastPage"
            class="nav-btn next"
            @click="currentPage++"
          >
            Next
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- Help tooltip -->
    <div class="help-tips">
      <el-popover
        placement="left"
        :width="300"
        trigger="click"
      >
        <template #reference>
          <el-button class="help-button" circle>
            <el-icon><QuestionFilled /></el-icon>
          </el-button>
        </template>
        <div class="help-content">
          <h3>Status Explanation</h3>
          <ul>
            <li v-for="status in bookingStatuses" :key="status.value">
              <strong>{{ status.label }}:</strong>
              <span>{{ status.description }}</span>
            </li>
            <li>
              <strong>Cancelled:</strong>
              <span>Booking has been cancelled</span>
            </li>
          </ul>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { 
  ArrowRight, 
  ArrowLeft, 
  Search,
  Timer,
  Location,
  Box,
  Position,
  Document,
  Loading,
  QuestionFilled,
  CreditCard,
  Clock,
  Calendar,
  Van,
  Check,
  Wallet,
  Edit
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()

// Status definitions
const STATUS = {
  REQUEST: 'Request',      // 预约申请
  SCHEDULED: 'Scheduled',  // 预约确认
  ARRIVED: 'Arrived',      // 到达仓库
  LOADING: 'Loading',      // 装卸中
  LOADED: 'Loaded',        // 装卸完成
  COMPLETED: 'Completed',  // 单据完成
  CANCELLED: 'Cancelled'   // 已取消
} as const

// Get status color
const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    [STATUS.REQUEST]: '#6366f1',    // Indigo - 预约申请
    [STATUS.SCHEDULED]: '#3b82f6',  // Blue - 预约确认
    [STATUS.ARRIVED]: '#10b981',    // Emerald - 到达仓库
    [STATUS.LOADING]: '#f59e0b',    // Amber - 装卸中
    [STATUS.LOADED]: '#10b981',     // Emerald - 装卸完成
    [STATUS.COMPLETED]: '#64748b',  // Slate - 单据完成
    [STATUS.CANCELLED]: '#ef4444'   // Red - 已取消
  }
  return colors[status] || '#64748b'
}

// Search and filters
const searchQuery = ref('')
const currentPeriod = ref('all')
const timePeriods = [
  { label: 'Custom', value: 'custom' },
  { label: '7 Days', value: '7days' },
  { label: 'Today', value: 'today' },
  { label: 'All', value: 'all' }
]

// Pagination
const pageSize = ref(15)
const currentPage = ref(1)
const totalRows = ref(100)

// Calculate pagination info
const startRow = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endRow = computed(() => Math.min(currentPage.value * pageSize.value, totalRows.value))
const isLastPage = computed(() => endRow.value >= totalRows.value)

// Mock booking data
const appointments = ref([
  {
    id: '1',
    orderNumber: '20868482',
    status: STATUS.REQUEST,
    warehouse: 'JFC Interbranch Distribution Center (IDC)',
    city: 'Commerce',
    datetime: '2024-12-09 08:30:00',
    duration: '2 hours',
    loadType: 'T-FORCE',
    driver: 'John Smith',
    vehicle: 'ABC-1234',
    spotNumber: 'A-12',
    cargoType: 'General',
    poNumber: 'PO-2024001',
    referenceNumber: 'REF-001',
    totalWeight: '2,500 kg',
    totalQuantity: '120 units'
  },
  {
    id: '2',
    orderNumber: '20868483',
    status: STATUS.SCHEDULED,
    warehouse: 'JFC Distribution Center',
    city: 'Commerce',
    datetime: '2024-12-09 09:30:00',
    duration: '1.5 hours',
    loadType: 'PFG',
    driver: 'Mike Johnson',
    vehicle: 'XYZ-5678',
    spotNumber: 'B-15',
    cargoType: 'Perishable',
    poNumber: 'PO-2024002',
    referenceNumber: 'REF-002',
    totalWeight: '1,800 kg',
    totalQuantity: '90 units'
  },
  {
    id: '3',
    orderNumber: '20868484',
    status: STATUS.ARRIVED,
    warehouse: 'JFC Distribution Center',
    city: 'Commerce',
    datetime: '2024-12-09 10:30:00',
    duration: '2 hours',
    loadType: 'T-FORCE',
    driver: 'David Wilson',
    vehicle: 'DEF-9012',
    spotNumber: 'C-08',
    cargoType: 'Frozen',
    poNumber: 'PO-2024003',
    referenceNumber: 'REF-003',
    totalWeight: '3,200 kg',
    totalQuantity: '150 units'
  },
  {
    id: '4',
    orderNumber: '20868485',
    status: STATUS.LOADING,
    warehouse: 'JFC Distribution Center',
    city: 'Commerce',
    datetime: '2024-12-09 11:30:00',
    duration: '1 hour',
    loadType: 'PFG',
    driver: 'Robert Brown',
    vehicle: 'GHI-3456',
    spotNumber: 'D-04',
    cargoType: 'General',
    poNumber: 'PO-2024004',
    referenceNumber: 'REF-004',
    totalWeight: '1,500 kg',
    totalQuantity: '75 units'
  },
  {
    id: '5',
    orderNumber: '20868486',
    status: STATUS.LOADED,
    warehouse: 'JFC Distribution Center',
    city: 'Commerce',
    datetime: '2024-12-09 12:30:00',
    duration: '2.5 hours',
    loadType: 'T-FORCE',
    driver: 'James Davis',
    vehicle: 'JKL-7890',
    spotNumber: 'E-11',
    cargoType: 'Perishable',
    poNumber: 'PO-2024005',
    referenceNumber: 'REF-005',
    totalWeight: '2,800 kg',
    totalQuantity: '140 units'
  },
  {
    id: '6',
    orderNumber: '20868487',
    status: STATUS.COMPLETED,
    warehouse: 'JFC Distribution Center',
    city: 'Commerce',
    datetime: '2024-12-09 13:30:00',
    duration: '1.5 hours',
    loadType: 'PFG',
    driver: 'William Moore',
    vehicle: 'MNO-1234',
    spotNumber: 'F-07',
    cargoType: 'General',
    poNumber: 'PO-2024006',
    referenceNumber: 'REF-006',
    totalWeight: '2,100 kg',
    totalQuantity: '100 units'
  },
  {
    id: '7',
    orderNumber: '20868488',
    status: STATUS.CANCELLED,
    warehouse: 'JFC Distribution Center',
    city: 'Commerce',
    datetime: '2024-12-09 14:30:00',
    duration: '2 hours',
    loadType: 'T-FORCE',
    driver: 'Richard Taylor',
    vehicle: 'PQR-5678',
    spotNumber: 'G-09',
    cargoType: 'Frozen',
    poNumber: 'PO-2024007',
    referenceNumber: 'REF-007',
    totalWeight: '2,600 kg',
    totalQuantity: '130 units'
  }
])

// Get count for each status
const getStatusCount = (status: string) => {
  return appointments.value.filter(a => a.status === status).length
}

// Update status configurations
const bookingStatuses = [
  {
    value: STATUS.REQUEST,
    label: 'Booking Request',
    icon: Clock,
    description: 'Awaiting warehouse confirmation'
  },
  {
    value: STATUS.SCHEDULED,
    label: 'Scheduled',
    icon: Calendar,
    description: 'Ready for pickup'
  },
  {
    value: STATUS.ARRIVED,
    label: 'Arrived at Warehouse',
    icon: Van,
    description: 'Vehicle checked in'
  },
  {
    value: STATUS.LOADING,
    label: 'Loading in Progress',
    icon: Loading,
    description: 'Loading/Unloading operation'
  },
  {
    value: STATUS.LOADED,
    label: 'Loading Completed',
    icon: Wallet,
    description: 'Pending payment'
  },
  {
    value: STATUS.COMPLETED,
    label: 'Documents Completed',
    icon: Check,
    description: 'All procedures finished'
  }
]

// Filter bookings based on search and filters
const filteredAppointments = computed(() => {
  let result = appointments.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(app => 
      app.orderNumber.toLowerCase().includes(query) ||
      app.warehouse.toLowerCase().includes(query) ||
      app.city.toLowerCase().includes(query)
    )
  }

  // Time period filter
  if (currentPeriod.value !== 'all') {
    const now = dayjs()
    switch (currentPeriod.value) {
      case 'today':
        result = result.filter(app => dayjs(app.datetime).isSame(now, 'day'))
        break
      case '7days':
        result = result.filter(app => 
          dayjs(app.datetime).isAfter(now.subtract(7, 'day')) &&
          dayjs(app.datetime).isBefore(now.add(7, 'day'))
        )
        break
    }
  }

  return result
})

// Format date and time
const formatDate = (datetime: string) => dayjs(datetime).format('ddd, MMM D, YYYY')
const formatTime = (datetime: string) => dayjs(datetime).format('h:mm A')

// Handle row click events
const handleRowClick = (row: any) => {
  router.push({
    path: `/appointment/${row.orderNumber}`,
    query: {
      id: row.id,
      status: row.status
    }
  })
}

// Cancel booking
const handleCancel = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel this appointment?',
      'Cancel Appointment',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }
    )
    // TODO: Call cancel booking API
    console.log('Cancelling appointment:', row.orderNumber)
  } catch {
    // User cancelled the operation
  }
}

// Check if there are active bookings in a status
const hasActiveBookingInStatus = (status: string) => {
  return appointments.value.some(booking => booking.status === status)
}

// Get status class
const getStatusClass = (status: string) => {
  return `status-${status.toLowerCase()}`
}

// Get status icon
const getStatusIcon = (status: string) => {
  const statusConfig = bookingStatuses.find(s => s.value === status)
  return statusConfig?.icon
}

// Get status text
const getStatusText = (status: string) => {
  const statusConfig = bookingStatuses.find(s => s.value === status)
  return statusConfig?.label || status
}

// Update card actions in template
const handlePayment = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      'Proceed to payment for this booking?',
      'Payment Required',
      {
        confirmButtonText: 'Pay Now',
        cancelButtonText: 'Later',
        type: 'info'
      }
    )
    // TODO: Redirect to payment page
    router.push({
      path: `/payment/${row.orderNumber}`,
      query: {
        id: row.id,
        amount: row.amount
      }
    })
  } catch {
    // User cancelled payment
  }
}

// Add edit booking handler
const handleEdit = (row: any) => {
  router.push({
    path: `/booking/edit/${row.orderNumber}`,
    query: {
      id: row.id,
      loadType: row.loadType,
      warehouse: row.warehouse,
      datetime: row.datetime,
      duration: row.duration,
      driver: row.driver,
      vehicle: row.vehicle,
      cargoType: row.cargoType,
      totalWeight: row.totalWeight,
      totalQuantity: row.totalQuantity,
      poNumber: row.poNumber,
      referenceNumber: row.referenceNumber
    }
  })
}
</script>

<style scoped lang="scss">
.appointments-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 0;
  position: relative;
}

.page-title {
  background: white;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;

  h1 {
    max-width: 1200px;
    margin: 0 auto;
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
  }
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 24px;
}

.page-header {
  margin-bottom: 32px;

  .subtitle {
    color: #64748b;
    font-size: 16px;
    margin: 0;
  }
}

.booking-timeline {
  background: white;
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(148, 163, 184, 0.05);

  .timeline-header {
    margin-bottom: 32px;

    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px;
    }

    p {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }
  }

  .timeline-flow {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    position: relative;
    padding: 0 12px;

    &::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 32px;
      right: 32px;
      height: 2px;
      background: #e2e8f0;
      z-index: 0;
    }

    .timeline-step {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      text-align: center;
      position: relative;
      z-index: 1;

      &.active {
        .step-icon {
          background: #6366f1;
          color: white;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
          
          :deep(.el-icon) {
            animation: pulse 2s infinite;
          }
        }

        .step-name {
          color: #6366f1;
        }

        .step-count {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }

        & ~ .timeline-step {
          .step-icon {
            background: #f1f5f9;
            color: #94a3b8;
          }

          .step-name {
            color: #94a3b8;
          }

          .step-count {
            background: #f1f5f9;
            color: #94a3b8;
          }
        }
      }

      .step-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #f8fafc;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.3s ease;
        border: 2px solid white;

        :deep(.el-icon) {
          width: 24px;
          height: 24px;
          font-size: 24px;
        }
      }

      .step-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .step-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 15px;
          transition: color 0.3s ease;
        }

        .step-count {
          display: inline-block;
          padding: 2px 12px;
          background: #f1f5f9;
          color: #64748b;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .step-desc {
          font-size: 13px;
          color: #64748b;
          max-width: 140px;
          margin: 0 auto;
        }
      }

      .step-arrow {
        display: none;
      }
    }
  }
}

.toolbar {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .search-box {
    :deep(.el-input__wrapper) {
      border-radius: 8px;
      padding: 8px 16px;
    }
  }

  .filter-box {
    :deep(.el-radio-button__inner) {
      padding: 8px 20px;
      border-radius: 8px;
      height: auto;
      line-height: 1.5;
    }
  }
}

.bookings-list {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;

  .booking-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      padding: 24px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .booking-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .booking-number {
          font-family: 'SF Mono', monospace;
          font-weight: 500;
          color: #1e293b;
          font-size: 15px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          background: #f8fafc;
          color: #64748b;
        }
      }

      .time-info {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #64748b;

        .date {
          font-weight: 500;
        }

        .time {
          color: #94a3b8;
        }
      }
    }

    .card-body {
      padding: 24px;

      .info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
        margin-bottom: 20px;

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;

          .info-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: #f8fafc;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }

          .info-content {
            flex: 1;

            .info-label {
              display: block;
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            }

            .info-value {
              display: block;
              font-weight: 500;
              color: #1e293b;
              font-size: 15px;
              margin-bottom: 4px;
            }

            .info-sub {
              font-size: 13px;
              color: #94a3b8;
            }
          }
        }
      }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;

        .action-btn {
          min-width: 120px;
        }

        .pay-btn {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10b981;
          color: #10b981;

          &:hover {
            background: #10b981;
            color: white;
          }
        }

        .edit-btn {
          background: rgba(245, 158, 11, 0.1);
          border-color: #f59e0b;
          color: #f59e0b;

          &:hover {
            background: #f59e0b;
            color: white;
          }
        }
      }
    }
  }
}

.help-tips {
  position: fixed;
  bottom: 24px;
  right: 24px;

  .help-button {
    width: 48px;
    height: 48px;
    font-size: 20px;
    background: #6366f1;
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

    &:hover {
      background: #4f46e5;
    }
  }

  .help-content {
    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      color: #1e293b;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 8px;
        font-size: 14px;
        color: #64748b;

        strong {
          color: #1e293b;
          margin-right: 4px;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pagination {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .page-info {
    display: flex;
    align-items: baseline;
    gap: 8px;

    .total-count {
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
    }

    .text {
      color: #64748b;
      font-size: 15px;
    }
  }

  .page-controls {
    display: flex;
    align-items: center;
    gap: 16px;

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #1e293b;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: #f8fafc;
        border-color: #cbd5e1;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .el-icon {
        font-size: 16px;
      }

      &.prev {
        padding-left: 12px;
      }

      &.next {
        padding-right: 12px;
      }
    }

    .page-numbers {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 15px;
      color: #64748b;

      .current {
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
      }

      .divider {
        color: #cbd5e1;
      }

      .total {
        color: #94a3b8;
      }
    }
  }
}
</style>