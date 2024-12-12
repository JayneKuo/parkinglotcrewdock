<template>
  <div class="load-type">
    <el-row justify="center" class="page-header">
      <el-col :span="18">
        <div class="back-link">
          <el-link @click="router.back()">
            <el-icon><ArrowLeft /></el-icon> 返回
          </el-link>
        </div>
        <h1>选择装卸类型</h1>
      </el-col>
    </el-row>

    <el-row justify="center" class="type-content">
      <el-col :span="18">
        <el-row :gutter="20">
          <el-col 
            v-for="type in loadTypes" 
            :key="type.id"
            :span="8"
          >
            <el-card 
              class="type-card" 
              :class="{ active: selectedType?.id === type.id }"
              @click="selectType(type)"
            >
              <h3>{{ type.name }}</h3>
              <p>{{ type.description }}</p>
            </el-card>
          </el-col>
        </el-row>

        <div class="action-footer">
          <el-button 
            type="primary" 
            size="large" 
            :disabled="!selectedType"
            @click="nextStep"
          >
            下一步
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { LoadType } from '@/types'

const router = useRouter()
const selectedType = ref<LoadType | null>(null)

// 模拟数据
const loadTypes: LoadType[] = [
  {
    id: 1,
    name: '装货',
    description: '将货物装载到车辆上'
  },
  {
    id: 2,
    name: '卸货',
    description: '将货物从车辆上卸下'
  },
  {
    id: 3,
    name: '装卸混合',
    description: '需要同时进行装货和卸货操作'
  }
]

const selectType = (type: LoadType) => {
  selectedType.value = type
}

const nextStep = () => {
  if (selectedType.value) {
    router.push('/booking/details')
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

.type-content {
  padding: 40px 0;
}

.type-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.type-card.active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
}

.type-card h3 {
  margin-bottom: 12px;
}

.type-card p {
  color: #666;
}

.action-footer {
  text-align: center;
  margin-top: 40px;
}
</style> 