<template>
  <div class="load-type-step">
    <h2>Select Load Type & Price</h2>
    
    <!-- 装货类型选择 -->
    <div class="section">
      <h3>Load Type</h3>
      <div class="load-type-options">
        <el-radio-group v-model="selectedLoadType" @change="handleLoadTypeChange">
          <el-radio-button label="FCL">FCL</el-radio-button>
          <el-radio-button label="LCL">LCL</el-radio-button>
          <el-radio-button label="Bulk">Bulk</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 价格类型选择 -->
    <div class="section">
      <h3>Price Type</h3>
      <div class="price-type-options">
        <el-radio-group v-model="selectedPriceType" @change="handlePriceTypeChange">
          <el-radio-button label="Standard">Standard ($50/h)</el-radio-button>
          <el-radio-button label="Express">Express ($80/h)</el-radio-button>
          <el-radio-button label="Premium">Premium ($100/h)</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="step-actions">
      <el-button @click="handleBack">Back</el-button>
      <el-button type="primary" @click="handleNext" :disabled="!isValid">Next</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['next', 'prev', 'update:loadType', 'update:priceType'])

const selectedLoadType = ref('')
const selectedPriceType = ref('')

const isValid = computed(() => {
  return selectedLoadType.value && selectedPriceType.value
})

const handleLoadTypeChange = (value: string) => {
  emit('update:loadType', value)
}

const handlePriceTypeChange = (value: string) => {
  emit('update:priceType', value)
}

const handleNext = () => {
  if (isValid.value) {
    emit('next')
  }
}

const handleBack = () => {
  emit('prev')
}
</script>

<style scoped lang="scss">
.load-type-step {
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 32px;
    color: #1a1a1a;
  }

  .section {
    margin-bottom: 32px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #1a1a1a;
    }
  }

  .load-type-options,
  .price-type-options {
    .el-radio-group {
      display: flex;
      gap: 16px;
    }

    .el-radio-button {
      :deep(.el-radio-button__inner) {
        padding: 12px 24px;
        border-radius: 8px;
        border: 1px solid #dcdfe6;
        height: auto;
        line-height: 1.5;
        font-size: 14px;
      }
    }
  }

  .step-actions {
    margin-top: 48px;
    display: flex;
    justify-content: space-between;

    .el-button {
      min-width: 120px;
    }
  }
}
</style> 