<template>
  <div class="appointment-detail">
    <el-row justify="center" class="page-header">
      <el-col :span="18">
        <div class="back-link">
          <el-link @click="router.back()">
            <el-icon><ArrowLeft /></el-icon> 返回列表
          </el-link>
        </div>
        <h1>预约详情</h1>
      </el-col>
    </el-row>

    <el-row justify="center" class="detail-content">
      <el-col :span="18">
        <el-card v-if="appointment" class="detail-card">
          <template #header>
            <div class="card-header">
              <h3>预约信息 #{{ appointment.id }}</h3>
              <el-tag :type="getStatusType(appointment.status)">
                {{ getStatusText(appointment.status) }}
              </el-tag>
            </div>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="仓库名称">
              {{ appointment.warehouse?.name }}
            </el-descriptions-item>
            <el-descriptions-item label="仓库地址">
              {{ appointment.warehouse?.address }}
            </el-descriptions-item>
            <el-descriptions-item label="预约日期">
              {{ appointment.date }}
            </el-descriptions-item>
            <el-descriptions-item label="预约时间">
              {{ appointment.startTime }}-{{ appointment.endTime }}
            </el-descriptions-item>
            <el-descriptions-item label="装卸类型">
              {{ appointment.loadType.name }}
            </el-descriptions-item>
            <el-descriptions-item label="公司名称">
              {{ appointment.companyName }}
            </el-descriptions-item>
            <el-descriptions-item label="司机姓名">
              {{ appointment.driverName }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ appointment.driverPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="车牌号">
              {{ appointment.truckNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">
              {{ appointment.notes || '无' }}
            </el-descriptions-item>
          </el-descriptions>

          <div class="action-footer" v-if="appointment.status === 'pending'">
            <el-button type="danger" @click="handleCancel">
              取消预约
            </el-button>
          </div>
        </el-card>

        <el-empty v-else description="预约不存在" />
      </el-col>
    </el-row>

    <el-dialog
      v-model="dialogVisible"
      title="取消预约"
      width="30%"
    >
      <span>确定要取消这个预约吗？取消后将无法恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmCancel" :loading="loading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointmentStore } from '@/stores/appointment'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Appointment } from '@/types'

const route = useRoute()
const router = useRouter()
const appointmentStore = useAppointmentStore()
const appointment = computed(() => appointmentStore.currentAppointment)

const dialogVisible = ref(false)
const loading = ref(false)

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  await appointmentStore.fetchAppointmentById(id)
})

const getStatusType = (status: string) => {
  const types = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger'
  }
  return types[status as keyof typeof types]
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '待确认',
    confirmed: '已确认',
    cancelled: '已取消'
  }
  return texts[status as keyof typeof texts]
}

const handleCancel = () => {
  dialogVisible.value = true
}

const confirmCancel = async () => {
  if (!appointment.value) return
  
  loading.value = true
  try {
    const success = await appointmentStore.cancelAppointment(appointment.value.id)
    if (success) {
      ElMessage.success('预约已取消')
      dialogVisible.value = false
      router.push('/appointments')
    }
  } catch (error) {
    ElMessage.error('取消预约失败')
  } finally {
    loading.value = false
  }
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

.detail-content {
  padding: 40px 0;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-footer {
  margin-top: 24px;
  text-align: center;
}

:deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-end;
}
</style> 