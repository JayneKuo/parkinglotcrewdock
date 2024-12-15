<template>
  <div class="warehouse-search">
    <el-form :model="searchForm" class="search-form">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item>
            <el-input
              v-model="searchForm.keyword"
              placeholder="Search by name, address or zip code"
              prefix-icon="Search"
              clearable
              @input="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-select
              v-model="searchForm.state"
              placeholder="Select State"
              clearable
              @change="handleStateChange"
            >
              <el-option
                v-for="state in states"
                :key="state"
                :label="state"
                :value="state"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-select
              v-model="searchForm.city"
              placeholder="Select City"
              clearable
              :disabled="!searchForm.state"
            >
              <el-option
                v-for="city in availableCities"
                :key="city"
                :label="city"
                :value="city"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usLocations } from '@/data/mockData';
import type { USLocation } from '@/types/warehouse';

const searchForm = ref({
  keyword: '',
  state: '',
  city: ''
});

const states = computed(() => usLocations.map((location: USLocation) => location.state));
const availableCities = computed(() => {
  if (!searchForm.value.state) return [];
  return usLocations.find((location: USLocation) => location.state === searchForm.value.state)?.cities || [];
});

const emit = defineEmits(['search']);

const handleSearch = () => {
  emit('search', searchForm.value);
};

const handleStateChange = () => {
  searchForm.value.city = '';
  handleSearch();
};
</script>

<style scoped lang="scss">
.warehouse-search {
  margin-bottom: 24px;
  
  .search-form {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }
}
</style> 