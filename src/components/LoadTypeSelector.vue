<template>
  <div class="load-type-selector">
    <h2 class="selector-title">选择装卸类型</h2>
    <div class="type-options">
      <!-- 入库选项 -->
      <div 
        class="type-card" 
        :class="{ active: modelValue === 'inbound' }"
        @click="$emit('update:modelValue', 'inbound')"
      >
        <div class="icon-wrapper">
          <el-icon :size="32"><ArrowDown /></el-icon>
        </div>
        <h3>入库 Inbound</h3>
        <p>货物进入仓库的操作</p>
      </div>

      <!-- 出库选项 -->
      <div 
        class="type-card" 
        :class="{ active: modelValue === 'outbound' }"
        @click="$emit('update:modelValue', 'outbound')"
      >
        <div class="icon-wrapper">
          <el-icon :size="32"><ArrowUp /></el-icon>
        </div>
        <h3>出库 Outbound</h3>
        <p>货物离开仓库的操作</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped lang="scss">
.load-type-selector {
  padding: 24px;

  .selector-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #1a1a1a;
  }

  .type-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .type-card {
    padding: 32px;
    background: #fff;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;

    &:hover {
      transform: translateY(-4px);
      border-color: var(--el-color-primary-light-5);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    }

    &.active {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);

      .icon-wrapper {
        background: var(--el-color-primary);
        color: white;
      }

      h3 {
        color: var(--el-color-primary);
      }
    }

    .icon-wrapper {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      background: #f3f4f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px;
      color: #1a1a1a;
    }

    p {
      font-size: 14px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
  }
}
</style> 