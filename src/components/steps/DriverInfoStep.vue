<template>
  <div class="driver-info-step">
    <h2>Driver & Cargo Information</h2>
    
    <!-- 司机信息 -->
    <div class="section">
      <h3>Driver Information</h3>
      <el-form 
        ref="driverFormRef"
        :model="driverForm"
        :rules="driverRules"
        label-position="top"
      >
        <el-form-item label="Driver Name" prop="name">
          <el-input v-model="driverForm.name" placeholder="Enter driver's name" />
        </el-form-item>
        
        <el-form-item label="Phone Number" prop="phone">
          <el-input v-model="driverForm.phone" placeholder="Enter phone number" />
        </el-form-item>
        
        <el-form-item label="License Plate" prop="licensePlate">
          <el-input v-model="driverForm.licensePlate" placeholder="Enter license plate number" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 货物信息 -->
    <div class="section">
      <h3>Cargo Information</h3>
      <el-form 
        ref="cargoFormRef"
        :model="cargoForm"
        :rules="cargoRules"
        label-position="top"
      >
        <el-form-item label="Cargo Type" prop="type">
          <el-select v-model="cargoForm.type" placeholder="Select cargo type">
            <el-option label="General Cargo" value="general" />
            <el-option label="Dangerous Goods" value="dangerous" />
            <el-option label="Temperature Controlled" value="temperature" />
            <el-option label="Oversized" value="oversized" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Weight (kg)" prop="weight">
          <el-input-number 
            v-model="cargoForm.weight"
            :min="0"
            :max="50000"
            :step="100"
            placeholder="Enter cargo weight"
          />
        </el-form-item>
        
        <el-form-item label="Special Instructions" prop="instructions">
          <el-input
            v-model="cargoForm.instructions"
            type="textarea"
            :rows="3"
            placeholder="Enter any special instructions or requirements"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <div class="step-actions">
      <el-button @click="handleBack">Back</el-button>
      <el-button type="primary" @click="handleNext">Next</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const emit = defineEmits(['next', 'prev'])

const driverFormRef = ref<FormInstance>()
const cargoFormRef = ref<FormInstance>()

const driverForm = ref({
  name: '',
  phone: '',
  licensePlate: ''
})

const cargoForm = ref({
  type: '',
  weight: 0,
  instructions: ''
})

const driverRules = ref<FormRules>({
  name: [
    { required: true, message: 'Please enter driver name', trigger: 'blur' },
    { min: 2, message: 'Length should be at least 2 characters', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter phone number', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  licensePlate: [
    { required: true, message: 'Please enter license plate', trigger: 'blur' },
    { min: 5, message: 'Length should be at least 5 characters', trigger: 'blur' }
  ]
})

const cargoRules = ref<FormRules>({
  type: [
    { required: true, message: 'Please select cargo type', trigger: 'change' }
  ],
  weight: [
    { required: true, message: 'Please enter cargo weight', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Weight must be greater than 0', trigger: 'blur' }
  ]
})

const validateForms = async () => {
  const [driverValid, cargoValid] = await Promise.all([
    driverFormRef.value?.validate(),
    cargoFormRef.value?.validate()
  ])
  return driverValid && cargoValid
}

const handleNext = async () => {
  const isValid = await validateForms()
  if (isValid) {
    emit('next')
  }
}

const handleBack = () => {
  emit('prev')
}
</script>

<style scoped lang="scss">
.driver-info-step {
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 32px;
    color: #1a1a1a;
  }

  .section {
    margin-bottom: 32px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #1a1a1a;
    }

    .el-form {
      max-width: 480px;

      .el-select,
      .el-input-number {
        width: 100%;
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