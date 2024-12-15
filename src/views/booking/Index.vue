<template>
  <div class="booking-page">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="nav-left">
        <el-button link @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          Book Appointment
        </el-button>
      </div>

      <div class="nav-steps">
        <div class="step-item" 
          v-for="(step, index) in steps" 
          :key="index"
          :class="{ 'active': currentStep >= index, 'completed': currentStep > index }"
        >
          <div class="step-icon">
            <el-icon v-if="currentStep > index"><Check /></el-icon>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="step-text">{{ step.label }}</span>
          <div class="step-line" v-if="index < steps.length - 1"></div>
        </div>
      </div>

      <div class="nav-right">
        <el-button type="primary" @click="nextStep">
          Date and time
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧信息 -->
      <div class="left-panel">
        <div class="warehouse-info">
          <h2>{{ warehouse.name }}</h2>
          <p class="sub-title">{{ warehouse.subTitle }}</p>
          <div class="address">
            {{ warehouse.address }}
            <el-button link @click="copyAddress">
              <el-icon><DocumentCopy /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="appointment-summary">
          <h3>Appointment summary</h3>
          <div class="summary-item">
            <label>Load type</label>
            <span>{{ formData.loadType }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="right-panel">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="Search loadtype"
            prefix-icon="Search"
          />
        </div>

        <div class="load-type-list">
          <div 
            v-for="type in loadTypes" 
            :key="type.id"
            class="load-type-item"
            :class="{ active: formData.loadType === type.id }"
            @click="selectLoadType(type)"
          >
            <div class="type-header">
              <img :src="type.icon" :alt="type.name" class="type-icon" />
              <h4>{{ type.name }}</h4>
              <el-radio v-model="formData.loadType" :label="type.id" />
            </div>
            <div class="type-info">
              <div class="info-item">
                <label>Operation</label>
                <span>{{ type.operation }}</span>
              </div>
              <div class="info-item">
                <label>Equipment Type</label>
                <span>{{ type.equipmentType }}</span>
              </div>
              <div class="info-item">
                <label>Transportation Mode</label>
                <span>{{ type.transportMode }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, DocumentCopy, Check, Search } from '@element-plus/icons-vue'

interface LoadType {
  id: string
  name: string
  icon: string
  operation: string
  equipmentType: string
  transportMode: string
}

const router = useRouter()
const currentStep = ref(0)
const searchQuery = ref('')

const steps = ref([
  { label: 'Warehouse' },
  { label: 'Loadtype' },
  { label: 'Date & Time' },
  { label: 'Details' }
])

const warehouse = ref({
  name: 'FC: STOCKTON #748',
  subTitle: 'Staples',
  address: '4510 Alitalia Ave, Stockton, CA 95206'
})

const formData = ref({
  loadType: ''
})

const loadTypes = ref<LoadType[]>([
  {
    id: 'T-FORCE',
    name: 'T-FORCE',
    icon: '/icons/t-force.svg',
    operation: 'Live',
    equipmentType: 'Other',
    transportMode: 'Other'
  },
  {
    id: 'PFG',
    name: 'PFG',
    icon: '/icons/pfg.svg',
    operation: 'Live',
    equipmentType: 'Other',
    transportMode: 'Other'
  },
  {
    id: 'FLOOR_LOAD',
    name: 'Floor Load (Hirsh, Dart, Hon)',
    icon: '/icons/floor-load.svg',
    operation: 'Live',
    equipmentType: 'Other',
    transportMode: 'Other'
  }
])

const goBack = () => {
  router.back()
}

const copyAddress = () => {
  navigator.clipboard.writeText(warehouse.value.address)
  ElMessage.success('Address copied')
}

const selectLoadType = (type: LoadType) => {
  formData.value.loadType = type.id
}

const nextStep = () => {
  if (!formData.value.loadType) {
    ElMessage.warning('Please select a load type')
    return
  }
  currentStep.value++
}
</script>

<style scoped lang="scss">
.booking-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.nav-header {
  height: 64px;
  padding: 0 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .nav-left {
    min-width: 200px;
  }

  .nav-steps {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 8px;

    .step-item {
      display: flex;
      align-items: center;
      color: #909399;

      &.active {
        color: #409eff;
        .step-icon {
          background: #409eff;
          color: white;
        }
        .step-line {
          background: #409eff;
        }
      }

      &.completed {
        color: #67c23a;
        .step-icon {
          background: #67c23a;
        }
        .step-line {
          background: #67c23a;
        }
      }

      .step-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #dcdfe6;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        font-size: 12px;
      }

      .step-text {
        font-size: 14px;
      }

      .step-line {
        width: 60px;
        height: 1px;
        background: #dcdfe6;
        margin: 0 16px;
      }
    }
  }

  .nav-right {
    min-width: 200px;
    display: flex;
    justify-content: flex-end;
  }
}

.main-content {
  padding: 24px;
  display: flex;
  gap: 24px;
}

.left-panel {
  width: 300px;

  .warehouse-info {
    background: white;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 16px;

    h2 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
    }

    .sub-title {
      margin: 0 0 16px;
      color: #606266;
      font-size: 14px;
    }

    .address {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      color: #606266;
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .appointment-summary {
    background: white;
    padding: 24px;
    border-radius: 8px;

    h3 {
      margin: 0 0 16px;
      font-size: 16px;
      font-weight: 600;
    }

    .summary-item {
      margin-bottom: 12px;

      label {
        display: block;
        color: #909399;
        font-size: 13px;
        margin-bottom: 4px;
      }

      span {
        color: #303133;
        font-size: 14px;
      }
    }
  }
}

.right-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 24px;

  .search-box {
    margin-bottom: 24px;
  }

  .load-type-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .load-type-item {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: #409eff;
      }

      &.active {
        border-color: #409eff;
        background: #ecf5ff;
      }

      .type-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;

        .type-icon {
          width: 40px;
          height: 40px;
        }

        h4 {
          flex: 1;
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .type-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;

        .info-item {
          label {
            display: block;
            color: #909399;
            font-size: 12px;
            margin-bottom: 4px;
          }

          span {
            color: #303133;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>