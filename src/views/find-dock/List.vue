<template>
  <div class="dock-list">
    <div class="dock-grid">
      <div v-for="warehouse in warehouses" :key="warehouse.id" class="warehouse-card">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="warehouse.image" class="warehouse-image">
          <div class="warehouse-info">
            <h3>{{ warehouse.name }}</h3>
            <p class="location">
              <i class="el-icon-location"></i>
              {{ warehouse.location }}
            </p>
            <p class="distance">
              <i class="el-icon-position"></i>
              距离: {{ warehouse.distance }}km
            </p>
            <p class="available-docks">
              <i class="el-icon-truck"></i>
              可用码头: {{ warehouse.availableDocks }}个
            </p>
            <el-button type="primary" size="small" @click="viewDetails(warehouse.id)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface Warehouse {
  id: number
  name: string
  image: string
  location: string
  distance: number
  availableDocks: number
}

// 模拟数据，实际应该从API获取
const warehouses = ref<Warehouse[]>([
  {
    id: 1,
    name: '洛杉矶中央仓库',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    location: '加利福尼亚州洛杉矶',
    distance: 2.5,
    availableDocks: 5
  },
  {
    id: 2,
    name: '旧金山湾区仓库',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    location: '加利福尼亚州旧金山',
    distance: 4.2,
    availableDocks: 3
  },
  {
    id: 3,
    name: '纽约皇后区物流中心',
    image: 'https://images.unsplash.com/photo-1565891741441-64926e441838?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    location: '纽约州皇后区',
    distance: 1.8,
    availableDocks: 8
  },
  {
    id: 4,
    name: '西雅图港口仓库',
    image: 'https://images.unsplash.com/photo-1584773821076-f0a36c8b6b10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    location: '华盛顿州西雅图',
    distance: 3.7,
    availableDocks: 6
  },
  {
    id: 5,
    name: '迈阿密海港仓储',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    location: '佛罗里达州迈阿密',
    distance: 5.1,
    availableDocks: 4
  }
])

const viewDetails = (id: number) => {
  router.push(`/warehouse/${id}`)
}

onMounted(() => {
  // 获取查询参数
  const { keyword, state, city } = route.query
  // 这里应该调用API获取筛选后的仓库列表
  console.log('搜索参数:', { keyword, state, city })
})
</script>

<style scoped>
.dock-list {
  padding: 20px;
}

.dock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.warehouse-card {
  transition: transform 0.3s;
}

.warehouse-card:hover {
  transform: translateY(-5px);
}

.warehouse-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.warehouse-info {
  padding: 15px;
}

.warehouse-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.location, .distance, .available-docks {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.el-icon-location, .el-icon-position, .el-icon-truck {
  margin-right: 5px;
}
</style> 