<template>
  <div class="warehouse-detail">
    <el-row justify="center" class="page-header">
      <el-col :span="18">
        <div class="back-link">
          <el-link @click="router.back()">
            <el-icon><ArrowLeft /></el-icon> 返回列表
          </el-link>
        </div>
        <h1>{{ warehouse?.name }}</h1>
      </el-col>
    </el-row>

    <el-row justify="center" class="detail-content">
      <el-col :span="18">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <h3>仓库信息</h3>
              <el-tag size="small" type="success">营业中</el-tag>
            </div>
          </template>
          
          <div class="info-list">
            <p>
              <el-icon><Location /></el-icon>
              <span>地址：</span>
              {{ warehouse?.address }}
            </p>
            <p>
              <el-icon><Clock /></el-icon>
              <span>营业时间：</span>
              {{ warehouse?.openingHours }}
            </p>
            <p>
              <el-icon><Phone /></el-icon>
              <span>联系电话：</span>
              {{ warehouse?.contactPhone }}
            </p>
          </div>

          <div class="description">
            <h4>仓库介绍</h4>
            <p>{{ warehouse?.description }}</p>
          </div>

          <div class="action-footer">
            <el-button type="primary" size="large" @click="startBooking">
              预约装卸货
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWarehouseStore } from '@/stores/warehouse'
import { Location, Clock, Phone, ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const warehouseStore = useWarehouseStore()
const warehouse = computed(() => warehouseStore.currentWarehouse)

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  await warehouseStore.fetchWarehouseById(id)
})

const startBooking = () => {
  router.push('/booking/load-type')
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

.info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-list p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  color: #666;
}

.description {
  margin: 24px 0;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.action-footer {
  text-align: center;
  margin-top: 40px;
}
</style> 