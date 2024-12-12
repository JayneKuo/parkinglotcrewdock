<template>
  <div class="appointment-list">
    <el-row justify="center" class="page-header">
      <el-col :span="18">
        <h1>我的预约</h1>
      </el-col>
    </el-row>

    <el-row justify="center" class="list-content">
      <el-col :span="18">
        <el-table :data="appointments" style="width: 100%">
          <el-table-column prop="id" label="预约编号" width="120" />
          <el-table-column prop="warehouse.name" label="仓库名称" />
          <el-table-column prop="date" label="预约日期" width="120" />
          <el-table-column label="预约时间" width="180">
            <template #default="{ row }">
              {{ row.startTime }}-{{ row.endTime }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button 
                link 
                type="primary" 
                @click="viewDetail(row.id)"
              >
                查看详情
              </el-button>
              <el-button
                v-if="row.status === 'pending'"
                link
                type="danger"
                @click="handleCancel(row)"
              >
                取消预约
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentStore } from '@/stores/appointment'
import type { Appointment } from '@/types'
import { ElMessage } from 'element-plus'

const router = useRouter()
const appointmentStore = useAppointmentStore()
const appointments = ref<Appointment[]>([])

onMounted(async () => {
  await appointmentStore.fetchAppointments()
  appointments.value = appointmentStore.appointments
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

const viewDetail = (id: number) => {
  router.push(`/appointment/${id}`)
}

const dialogVisible = ref(false)
const loading = ref(false)
const currentAppointment = ref<Appointment | null>(null)

const handleCancel = (appointment: Appointment) => {
  currentAppointment.value = appointment
  dialogVisible.value = true
}

const confirmCancel = async () => {
  if (!currentAppointment.value) return
  
  loading.value = true
  try {
    const success = await appointmentStore.cancelAppointment(currentAppointment.value.id)
    if (success) {
      ElMessage.success('预约已取消')
      dialogVisible.value = false
      await appointmentStore.fetchAppointments()
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

.list-content {
  padding: 40px 0;
}
</style> 