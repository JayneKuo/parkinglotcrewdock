<template>
  <div class="warehouse-list">
    <el-row justify="center" class="page-header">
      <el-col :span="18">
        <h1>选择仓库</h1>
      </el-col>
    </el-row>

    <el-row justify="center" class="warehouse-grid">
      <el-col :span="18">
        <el-row :gutter="20">
          <el-col 
            v-for="warehouse in warehouses" 
            :key="warehouse.id" 
            :xs="24" 
            :sm="12" 
            :md="8"
            class="warehouse-item"
          >
            <el-card 
              shadow="hover" 
              @click="goToDetail(warehouse.id)"
            >
              <template #header>
                <div class="warehouse-header">
                  <h3>{{ warehouse.name }}</h3>
                  <el-tag size="small" type="success">营业中</el-tag>
                </div>
              </template>
              
              <div class="warehouse-info">
                <p>
                  <el-icon><Location /></el-icon>
                  {{ warehouse.address }}
                </p>
                <p>
                  <el-icon><Clock /></el-icon>
                  营业时间：{{ warehouse.openingHours }}
                </p>
                <p>
                  <el-icon><Phone /></el-icon>
                  {{ warehouse.contactPhone }}
                </p>
              </div>

              <div class="warehouse-footer">
                <el-button type="primary" @click.stop="goToDetail(warehouse.id)">
                  查看详情
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWarehouseStore } from '@/stores/warehouse'
import { Location, Clock, Phone } from '@element-plus/icons-vue'

const router = useRouter()
const warehouseStore = useWarehouseStore()
const warehouses = computed(() => warehouseStore.warehouses)

onMounted(async () => {
  await warehouseStore.fetchWarehouses()
})

const goToDetail = (id: number) => {
  router.push(`/warehouse/${id}`)
}
</script>

<style scoped>
.page-header {
  padding: 40px 0;
  background: #f5f7fa;
}

.warehouse-grid {
  padding: 40px 0;
}

.warehouse-item {
  margin-bottom: 20px;
}

.warehouse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warehouse-info {
  margin-bottom: 20px;
}

.warehouse-info p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: #666;
}

.warehouse-footer {
  text-align: right;
}
</style> 