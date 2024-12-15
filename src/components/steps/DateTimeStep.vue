<template>
  <div class="date-time-step">
    <h2>Select Date & Time</h2>
    
    <!-- 日期时间选择 -->
    <div class="section">
      <h3>Appointment Date & Time</h3>
      <el-date-picker
        v-model="selectedDateTime"
        type="datetime"
        placeholder="Select date and time"
        format="YYYY-MM-DD HH:mm"
        value-format="YYYY-MM-DD HH:mm"
        :disabled-date="disabledDate"
        :disabled-hours="disabledHours"
        @change="handleDateTimeChange"
      />
    </div>

    <!-- 停车位数量 -->
    <div class="section">
      <h3>Number of Parking Spots</h3>
      <el-input-number 
        v-model="selectedSpots"
        :min="1"
        :max="10"
        @change="handleSpotsChange"
      />
    </div>

    <!-- 预计时长 -->
    <div class="section">
      <h3>Estimated Duration</h3>
      <el-select 
        v-model="selectedDuration"
        placeholder="Select duration"
        @change="handleDurationChange"
      >
        <el-option label="1 hour" value="1" />
        <el-option label="2 hours" value="2" />
        <el-option label="3 hours" value="3" />
        <el-option label="4 hours" value="4" />
        <el-option label="5 hours" value="5" />
        <el-option label="6 hours" value="6" />
      </el-select>
    </div>

    <!-- 底部按钮 -->
    <div class="step-actions">
      <el-button @click="handleBack">Back</el-button>
      <el-button type="primary" @click="handleNext" :disabled="!isValid">Next</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

const emit = defineEmits(['next', 'prev', 'update:datetime', 'update:spots', 'update:duration'])

const selectedDateTime = ref('')
const selectedSpots = ref(1)
const selectedDuration = ref('')

const isValid = computed(() => {
  return selectedDateTime.value && selectedSpots.value && selectedDuration.value
})

// 禁用过去的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7 // 禁用今天之前的日期
}

// 禁用非工作时间
const disabledHours = () => {
  const hours = []
  for (let i = 0; i < 24; i++) {
    if (i < 8 || i > 18) { // 只允许 8:00 - 18:00
      hours.push(i)
    }
  }
  return hours
}

const handleDateTimeChange = (value: string) => {
  emit('update:datetime', value)
}

const handleSpotsChange = (value: number) => {
  emit('update:spots', value)
}

const handleDurationChange = (value: string) => {
  emit('update:duration', `${value} hour${value === '1' ? '' : 's'}`)
}

const handleNext = () => {
  if (isValid.value) {
    emit('next')
  }
}

const handleBack = () => {
  emit('prev')
}
</script>

<style scoped lang="scss">
.date-time-step {
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

    .el-date-picker,
    .el-input-number,
    .el-select {
      width: 100%;
      max-width: 320px;
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