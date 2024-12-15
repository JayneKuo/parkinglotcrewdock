<template>
  <div class="edit-booking-page">
    <div class="page-title">
      <h1>Edit Booking</h1>
    </div>

    <div class="page-container">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="booking-form"
      >
        <!-- Order Information -->
        <div class="form-section">
          <div class="section-header">
            <el-icon class="section-icon"><Document /></el-icon>
            <h2 class="section-title">Order Information</h2>
          </div>
          <div class="form-grid">
            <div class="form-item">
              <div class="form-label">Order Number</div>
              <el-input 
                v-model="form.orderNumber" 
                disabled
                class="readonly-field"
              />
            </div>
            <div class="form-item">
              <div class="form-label">Status</div>
              <el-tag :type="form.status === 'Scheduled' ? 'success' : 'warning'" class="status-tag">
                {{ form.status }}
              </el-tag>
            </div>
            <div class="form-item">
              <div class="form-label">Created Time</div>
              <el-input 
                v-model="form.createdTime" 
                disabled
                class="readonly-field"
              />
            </div>
          </div>
        </div>

        <!-- Step 1: Basic Info -->
        <div class="form-section">
          <div class="section-header">
            <el-icon class="section-icon"><Location /></el-icon>
            <h2 class="section-title">Basic Information</h2>
          </div>
          <div class="form-grid">
            <div class="form-item">
              <div class="form-label">Warehouse</div>
              <el-input 
                v-model="form.warehouse"
                disabled
                class="readonly-field"
              />
            </div>
            <div class="form-item">
              <div class="form-label">Load Type</div>
              <el-input 
                v-model="form.loadType"
                disabled
                class="readonly-field"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Time Slot -->
        <div class="form-section">
          <div class="section-header">
            <el-icon class="section-icon"><Timer /></el-icon>
            <h2 class="section-title">Time Slot</h2>
          </div>
          <div class="form-grid">
            <div class="form-item">
              <div class="form-label">
                Date
                <span class="required">*</span>
              </div>
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="Select date"
                class="full-width"
                :disabled-date="disabledDate"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="form-item">
              <div class="form-label">
                Time
                <span class="required">*</span>
              </div>
              <el-select
                v-model="form.time"
                placeholder="Select time"
                class="full-width"
              >
                <el-option
                  v-for="option in timeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </div>
            <div class="form-item">
              <div class="form-label">
                Estimated Duration
                <span class="required">*</span>
              </div>
              <el-select 
                v-model="form.duration" 
                placeholder="Select duration" 
                class="full-width"
              >
                <el-option
                  v-for="option in durationOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </div>
          </div>
        </div>

        <!-- Step 3: Driver Information -->
        <div class="form-section">
          <div class="section-header">
            <el-icon class="section-icon"><User /></el-icon>
            <h2 class="section-title">Driver Information</h2>
          </div>
          <div class="form-grid">
            <div class="form-item">
              <div class="form-label">
                Carrier
                <span class="required">*</span>
              </div>
              <el-input 
                v-model="form.carrier" 
                placeholder="Enter carrier name"
              />
            </div>
            <div class="form-item">
              <div class="form-label">
                Driver Name
                <span class="required">*</span>
              </div>
              <el-input 
                v-model="form.driverName" 
                placeholder="Enter driver name"
              />
            </div>
            <div class="form-item">
              <div class="form-label">
                Driver Phone
                <span class="required">*</span>
              </div>
              <el-input 
                v-model="form.driverPhone" 
                placeholder="Enter driver phone"
              />
            </div>
            <div class="form-item">
              <div class="form-label">
                License Plate
                <span class="required">*</span>
              </div>
              <el-input 
                v-model="form.licensePlate" 
                placeholder="Enter license plate"
              />
            </div>
          </div>
        </div>

        <!-- Step 4: Cargo Information -->
        <div class="form-section">
          <div class="section-header">
            <el-icon class="section-icon"><Box /></el-icon>
            <h2 class="section-title">Cargo Information</h2>
          </div>
          <div class="form-grid">
            <div class="form-item">
              <div class="form-label">
                Cargo Type
                <span class="required">*</span>
              </div>
              <el-select 
                v-model="form.cargoType" 
                placeholder="Select cargo type"
                class="full-width"
              >
                <el-option label="General" value="General" />
                <el-option label="Perishable" value="Perishable" />
                <el-option label="Frozen" value="Frozen" />
              </el-select>
            </div>
            <div class="form-item">
              <div class="form-label">
                PO Number
                <span class="required">*</span>
              </div>
              <el-input 
                v-model="form.poNumber" 
                placeholder="Enter PO number"
              />
            </div>
            <div class="form-item">
              <div class="form-label">
                Weight (kg)
                <span class="required">*</span>
              </div>
              <el-input-number 
                v-model="form.weight" 
                :min="0" 
                :max="10000"
                class="full-width"
              />
            </div>
            <div class="form-item">
              <div class="form-label">
                Pallets
                <span class="required">*</span>
              </div>
              <el-input-number 
                v-model="form.pallets" 
                :min="0" 
                :max="100"
                class="full-width"
              />
            </div>
            <div class="form-item full-width">
              <div class="form-label">
                Description
              </div>
              <el-input 
                v-model="form.description" 
                type="textarea"
                rows="3"
                placeholder="Enter cargo description"
              />
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            Save Changes
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
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
  Edit,
  User
} from '@element-plus/icons-vue'

// Form data interface
interface BookingForm {
  // Order Info
  orderNumber: string
  status: string
  createdTime: string
  
  // Basic Info
  warehouse: string
  loadType: string
  
  // Time Slot
  date: string
  time: string
  duration: string
  
  // Driver Info
  carrier: string
  driverName: string
  driverPhone: string
  licensePlate: string
  
  // Cargo Info
  cargoType: string
  poNumber: string
  weight: number
  pallets: number
  description: string
}

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)

// Form data with proper types
const form = ref<BookingForm>({
  // Order Info
  orderNumber: '',
  status: '',
  createdTime: '',
  
  // Basic Info
  warehouse: '',
  loadType: '',
  
  // Time Slot
  date: '',
  time: '',
  duration: '',
  
  // Driver Info
  carrier: '',
  driverName: '',
  driverPhone: '',
  licensePlate: '',
  
  // Cargo Info
  cargoType: '',
  poNumber: '',
  weight: 0,
  pallets: 0,
  description: ''
})

// Form validation rules
const rules = {
  // Basic Info
  warehouse: [{ required: true, message: 'Please select warehouse', trigger: 'change' }],
  loadType: [{ required: true, message: 'Please select load type', trigger: 'change' }],
  
  // Time Slot
  date: [{ required: true, message: 'Please select date', trigger: 'change' }],
  time: [{ required: true, message: 'Please select time', trigger: 'change' }],
  duration: [{ required: true, message: 'Please select duration', trigger: 'change' }],
  
  // Driver Info
  carrier: [{ required: true, message: 'Please enter carrier name', trigger: 'blur' }],
  driverName: [{ required: true, message: 'Please enter driver name', trigger: 'blur' }],
  driverPhone: [{ required: true, message: 'Please enter driver phone', trigger: 'blur' }],
  licensePlate: [{ required: true, message: 'Please enter license plate', trigger: 'blur' }],
  
  // Cargo Info
  cargoType: [{ required: true, message: 'Please select cargo type', trigger: 'change' }],
  poNumber: [{ required: true, message: 'Please enter PO number', trigger: 'blur' }],
  weight: [{ required: true, message: 'Please enter weight', trigger: 'change' }],
  pallets: [{ required: true, message: 'Please enter number of pallets', trigger: 'change' }]
}

// Disable past dates
const disabledDate = (time: Date) => {
  return dayjs(time).isBefore(dayjs(), 'day')
}

// Duration options
const durationOptions = [
  { label: '1 hour', value: '1 hour' },
  { label: '1.5 hours', value: '1.5 hours' },
  { label: '2 hours', value: '2 hours' },
  { label: '2.5 hours', value: '2.5 hours' },
  { label: '3 hours', value: '3 hours' }
]

// Time options
const generateTimeOptions = () => {
  const times = []
  let hour = 8
  let minute = 0
  
  while (hour < 18 || (hour === 18 && minute === 0)) {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    times.push({
      label: timeString,
      value: timeString
    })
    minute += 30
    if (minute === 60) {
      minute = 0
      hour++
    }
  }
  return times
}

const timeOptions = generateTimeOptions()

// Load booking data
onMounted(() => {
  const query = route.query
  if (query.id) {
    // TODO: Call API to get booking details
    // For now, simulate API response
    form.value = {
      // Order Info
      orderNumber: query.orderNumber as string || 'ORD-2024-001',
      status: 'Scheduled',
      createdTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      
      // Basic Info
      warehouse: query.warehouse as string || '',
      loadType: query.loadType as string || '',
      
      // Time Slot
      date: query.date as string || '',
      time: query.time as string || '',
      duration: query.duration as string || '',
      
      // Driver Info
      carrier: query.carrier as string || '',
      driverName: query.driverName as string || '',
      driverPhone: query.driverPhone as string || '',
      licensePlate: query.licensePlate as string || '',
      
      // Cargo Info
      cargoType: query.cargoType as string || '',
      poNumber: query.poNumber as string || '',
      weight: parseInt(query.weight as string) || 0,
      pallets: parseInt(query.pallets as string) || 0,
      description: query.description as string || ''
    }
  }
})

// Handle form submission
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        loading.value = true
        // Combine date and time
        const datetime = dayjs(form.value.date)
          .hour(parseInt(form.value.time.split(':')[0]))
          .minute(parseInt(form.value.time.split(':')[1]))
          .format('YYYY-MM-DD HH:mm:ss')

        // TODO: Call API to update booking
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

        ElMessage.success('Booking updated successfully')
        router.push('/appointments')
      } catch (error) {
        ElMessage.error('Failed to update booking')
      } finally {
        loading.value = false
      }
    }
  })
}

// Handle cancel
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel? Any unsaved changes will be lost.',
      'Cancel Edit',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }
    )
    router.push('/appointments')
  } catch {
    // User cancelled the operation
  }
}
</script>

<style scoped lang="scss">
.edit-booking-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 0;
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
  padding: 0 24px 48px;
}

.booking-form {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 32px;
  position: relative;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 24px;
    display: flex;
    align-items: center;
    gap: 12px;

    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 24px;
      background: #6366f1;
      border-radius: 2px;
    }
  }
}

.load-type-group {
  width: 100%;
  display: flex;
  gap: 16px;

  :deep(.el-radio-button__inner) {
    width: 160px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
}

.full-width {
  width: 100%;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  padding-bottom: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;

  .el-button {
    min-width: 120px;
  }
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-date-picker) {
  width: 100%;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;

  .section-icon {
    font-size: 20px;
    color: #6366f1;
  }

  .section-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.form-item {
  &.full-width {
    grid-column: span 2;
  }

  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 8px;

    .required {
      color: #ff4d4f;
      margin-left: 4px;
    }
  }
}

.readonly-field {
  :deep(.el-input__wrapper) {
    background-color: #f8fafc;
    box-shadow: none !important;
    cursor: not-allowed;
  }
  
  :deep(.el-input__inner) {
    color: #64748b;
  }
}

.status-tag {
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
}
</style> 