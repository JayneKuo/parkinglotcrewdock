<template>
  <div class="booking-details">
    <el-row justify="center" class="page-header">
      <el-col :span="18">
        <div class="back-link">
          <el-link @click="router.back()">
            <el-icon><ArrowLeft /></el-icon> 返回
          </el-link>
        </div>
        <h1>预约信息</h1>
      </el-col>
    </el-row>

    <el-row justify="center" class="form-content">
      <el-col :span="12">
        <el-form 
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="form.companyName" />
          </el-form-item>

          <el-form-item label="司机姓名" prop="driverName">
            <el-input v-model="form.driverName" />
          </el-form-item>

          <el-form-item label="联系电话" prop="driverPhone">
            <el-input v-model="form.driverPhone" />
          </el-form-item>

          <el-form-item label="车牌号" prop="truckNumber">
            <el-input v-model="form.truckNumber" />
          </el-form-item>

          <el-form-item label="预约日期" prop="date">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="预约时间" prop="timeSlot">
            <el-select
              v-model="form.timeSlot"
              placeholder="选择时间段"
              style="width: 100%"
            >
              <el-option
                v-for="slot in availableTimeSlots"
                :key="slot.id"
                :label="`${slot.startTime}-${slot.endTime}`"
                :value="slot.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="form.notes"
              type="textarea"
              rows="3"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">
              提交预约
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { TimeSlot } from '@/types'

const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  companyName: '',
  driverName: '',
  driverPhone: '',
  truckNumber: '',
  date: '',
  timeSlot: '',
  notes: ''
})

const rules: FormRules = {
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  driverName: [
    { required: true, message: '请输入司机姓名', trigger: 'blur' }
  ],
  driverPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  truckNumber: [
    { required: true, message: '请输入车牌号', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择预约日期', trigger: 'change' }
  ],
  timeSlot: [
    { required: true, message: '请选择预约时间', trigger: 'change' }
  ]
}

// 模拟数据
const availableTimeSlots: TimeSlot[] = [
  {
    id: 1,
    date: '2024-01-20',
    startTime: '09:00',
    endTime: '10:00',
    available: true
  },
  {
    id: 2,
    date: '2024-01-20',
    startTime: '10:00',
    endTime: '11:00',
    available: true
  }
]

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      // TODO: 提交预约信息
      router.push('/appointments')
    }
  })
}
</script>

<style scoped>
.page-header {
  padding: 40px 0;
  background: #f5f7fa;
}

.back-link {
  margin-bottom: 20px;
}

.form-content {
  padding: 40px 0;
}
</style> 