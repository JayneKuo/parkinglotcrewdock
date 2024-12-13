<template>
  <div class="warehouse-card">
    <div class="warehouse-image">
      <img :src="warehouse.imageUrl" :alt="warehouse.name">
      <div class="availability-badge" :class="availabilityClass">
        {{ warehouse.availableDocks }}/{{ warehouse.totalDocks }} 可用
      </div>
    </div>
    <div class="warehouse-info">
      <h3>{{ warehouse.name }}</h3>
      <p class="address" @click.stop="openGoogleMaps">
        <el-icon><Location /></el-icon>
        {{ fullAddress }}
        <span class="distance">{{ warehouse.distance }}公里</span>
      </p>
      <div class="pricing">
        <el-tag :type="getPricingTagType">
          {{ getPricingText }}
        </el-tag>
        <span class="price">${{ warehouse.priceRate }}/{{ getPricingUnit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Location } from '@element-plus/icons-vue';
import type { Warehouse } from '@/types/warehouse';

const props = defineProps<{
  warehouse: Warehouse;
}>();

const fullAddress = computed(() => {
  return `${props.warehouse.address}, ${props.warehouse.city}, ${props.warehouse.state} ${props.warehouse.zipCode}`;
});

const availabilityClass = computed(() => {
  const ratio = props.warehouse.availableDocks / props.warehouse.totalDocks;
  return {
    'high': ratio > 0.5,
    'medium': ratio <= 0.5 && ratio > 0.2,
    'low': ratio <= 0.2
  };
});

const getPricingTagType = computed(() => {
  const types: Record<Warehouse['pricingType'], string> = {
    'hourly': 'success',
    'daily': 'warning',
    'monthly': 'info'
  };
  return types[props.warehouse.pricingType];
});

const getPricingText = computed(() => {
  const texts: Record<Warehouse['pricingType'], string> = {
    'hourly': '按小时',
    'daily': '按天',
    'monthly': '按月'
  };
  return texts[props.warehouse.pricingType];
});

const getPricingUnit = computed(() => {
  const units: Record<Warehouse['pricingType'], string> = {
    'hourly': '小时',
    'daily': '天',
    'monthly': '月'
  };
  return units[props.warehouse.pricingType];
});

const openGoogleMaps = () => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${props.warehouse.latitude},${props.warehouse.longitude}`;
  window.open(url, '_blank');
};
</script>

<style scoped lang="scss">
.warehouse-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }

  .warehouse-image {
    position: relative;
    height: 200px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .availability-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 8px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      
      &.high { background: #67C23A; }
      &.medium { background: #E6A23C; }
      &.low { background: #F56C6C; }
    }
  }

  .warehouse-info {
    padding: 16px;

    h3 {
      margin: 0 0 8px;
      font-size: 18px;
      color: #1A1A1A;
    }

    .address {
      display: flex;
      align-items: center;
      color: #666;
      margin-bottom: 12px;
      cursor: pointer;

      &:hover {
        color: #409EFF;
      }

      .distance {
        margin-left: auto;
        color: #909399;
      }
    }

    .pricing {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style> 