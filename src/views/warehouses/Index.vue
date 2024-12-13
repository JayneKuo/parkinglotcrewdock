<template>
  <div class="warehouses-page">
    <div class="page-container">
      <h1>可用车位</h1>
      <warehouse-search @search="handleSearch" />
      
      <div class="warehouses-grid">
        <warehouse-card
          v-for="warehouse in sortedWarehouses"
          :key="warehouse.id"
          :warehouse="warehouse"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import WarehouseSearch from '@/components/warehouse/WarehouseSearch.vue';
import WarehouseCard from '@/components/warehouse/WarehouseCard.vue';
import { mockWarehouses } from '@/data/mockData';
import type { Warehouse } from '@/types/warehouse';

const warehouses = ref<Warehouse[]>(mockWarehouses);
const searchParams = ref({
  keyword: '',
  state: '',
  city: ''
});

const sortedWarehouses = computed(() => {
  let filtered = [...warehouses.value];
  
  // 搜索过滤
  if (searchParams.value.keyword) {
    const keyword = searchParams.value.keyword.toLowerCase();
    filtered = filtered.filter(w => 
      w.name.toLowerCase().includes(keyword) ||
      w.address.toLowerCase().includes(keyword) ||
      w.zipCode.includes(keyword)
    );
  }

  // 州和城市过滤
  if (searchParams.value.state) {
    filtered = filtered.filter(w => w.state === searchParams.value.state);
  }
  if (searchParams.value.city) {
    filtered = filtered.filter(w => w.city === searchParams.value.city);
  }

  // 按距离和可用数量排序
  return filtered.sort((a, b) => {
    // 首先按距离排序
    const distanceDiff = a.distance - b.distance;
    if (Math.abs(distanceDiff) > 5) { // 如果距离差超过5公里
      return distanceDiff;
    }
    // 距离相近时按可用数量排序
    return b.availableDocks - a.availableDocks;
  });
});

const handleSearch = (params: any) => {
  searchParams.value = params;
};
</script>

<style scoped lang="scss">
.warehouses-page {
  padding-top: 80px;
  min-height: 100vh;
  background: #F8F9FA;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 24px;
  }
}

.warehouses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}
</style> 