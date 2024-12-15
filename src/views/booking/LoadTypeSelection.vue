<template>
  <div class="load-type-selection">
    <div class="selection-container">
      <!-- 仓库信息 -->
      <div class="warehouse-info">
        <div class="info-header">
          <h2>{{ dockInfo?.name }}</h2>
          <el-tag 
            :type="dockInfo?.status === 'Operating' ? 'success' : 'danger'"
            size="small"
          >
            {{ dockInfo?.status }}
          </el-tag>
        </div>
        <div class="info-address">
          <el-icon><Location /></el-icon>
          <span>{{ dockInfo?.address }}</span>
          <el-button 
            type="primary" 
            link 
            class="copy-btn"
            @click="copyAddress"
          >
            复制
          </el-button>
        </div>
      </div>

      <!-- 装卸类型选择器 -->
      <LoadTypeSelector v-model="selectedType" />

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button @click="goBack">返回</el-button>
        <el-button 
          type="primary" 
          :disabled="!selectedType"
          @click="nextStep"
        >
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import { Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import LoadTypeSelector from '@/components/LoadTypeSelector.vue'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const selectedType = ref('')
const dockInfo = ref<any>(null)

// 获取仓库信息
const fetchDockInfo = async () => {
  const mockData = {
    id: route.params.id,
    name: 'FC: STOCKTON #748',
    status: 'Operating',
    address: '4510 Alitalia Ave, Stockton, CA 95206',
    type: 'Staples'
  }
  dockInfo.value = mockData
}

// 复制地址
const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(dockInfo.value.address)
    ElMessage.success('地址已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const goBack = () => {
  router.back()
}

const nextStep = () => {
  if (selectedType.value) {
    // 保存选择到 store
    bookingStore.setLoadDirection(selectedType.value as any)
    // 跳转到下一步
    router.push('/booking/datetime')
  }
}

onMounted(() => {
  fetchDockInfo()
})
</script>

<style scoped lang="scss">
.load-type-selection {
  padding: 40px 20px;

  .selection-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .warehouse-info {
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;

    .info-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .info-address {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;

      .el-icon {
        color: #999;
      }

      .copy-btn {
        padding: 0;
        height: auto;
        font-size: 14px;
      }
    }
  }

  .action-buttons {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #e5e7eb;

    .el-button {
      min-width: 120px;
    }
  }
}
</style> 