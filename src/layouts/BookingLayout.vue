<template>
  <div class="booking-layout">
    <!-- 顶部导航栏 -->
    <div class="booking-header">
      <div class="header-content">
        <div class="back-button" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>Book Appointment</span>
        </div>
        <div class="steps-progress">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <div class="step-icon">
              <el-icon v-if="currentStep > 1"><Check /></el-icon>
              <span v-else>1</span>
            </div>
            <span class="step-text">Warehouse</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <div class="step-icon">
              <el-icon v-if="currentStep > 2"><Check /></el-icon>
              <span v-else>2</span>
            </div>
            <span class="step-text">Loadtype</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
            <div class="step-icon">
              <el-icon v-if="currentStep > 3"><Check /></el-icon>
              <span v-else>3</span>
            </div>
            <span class="step-text">Date & Time</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep >= 4, completed: currentStep > 4 }">
            <div class="step-icon">
              <el-icon v-if="currentStep > 4"><Check /></el-icon>
              <span v-else>4</span>
            </div>
            <span class="step-text">Details</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="booking-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Check } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 计算当前步骤
const currentStep = computed(() => {
  const pathMap: Record<string, number> = {
    'BookingLoadType': 2,
    'BookingDateTime': 3,
    'BookingDetails': 4
  }
  return pathMap[route.name as string] || 1
})

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.booking-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.booking-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: white;
  box-shadow: 0 1px 0 0 rgba(0,0,0,0.05);
  z-index: 100;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    color: #1a1a1a;
    font-size: 16px;
    font-weight: 500;

    &:hover {
      color: var(--el-color-primary);
    }

    .el-icon {
      font-size: 20px;
    }
  }
}

.steps-progress {
  display: flex;
  align-items: center;
  gap: 8px;

  .step {
    display: flex;
    align-items: center;
    gap: 8px;

    &.active {
      .step-icon {
        background-color: var(--el-color-primary);
        color: white;
        border-color: var(--el-color-primary);
      }

      .step-text {
        color: var(--el-color-primary);
      }
    }

    &.completed {
      .step-icon {
        background-color: var(--el-color-success);
        color: white;
        border-color: var(--el-color-success);
      }

      .step-text {
        color: var(--el-color-success);
      }
    }

    .step-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: #666;
      background: white;
      transition: all 0.3s ease;
    }

    .step-text {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  }

  .step-line {
    width: 60px;
    height: 2px;
    background-color: #e5e7eb;
  }
}

.booking-content {
  padding-top: 72px;
  min-height: calc(100vh - 72px);
}
</style>