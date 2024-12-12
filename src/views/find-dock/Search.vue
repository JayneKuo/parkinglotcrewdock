<template>
  <div class="search-container">
    <div class="search-header">
      <h1>查找可用码头</h1>
    </div>
    
    <div class="search-form">
      <el-form :model="searchForm" label-width="100px">
        <el-form-item label="关键词搜索">
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="输入仓库名称或关键词"
            prefix-icon="el-icon-search"
          />
        </el-form-item>
        
        <el-form-item label="州">
          <el-select 
            v-model="searchForm.state" 
            placeholder="选择州"
            clearable
          >
            <el-option 
              v-for="state in states" 
              :key="state.value" 
              :label="state.label" 
              :value="state.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="城市">
          <el-select 
            v-model="searchForm.city" 
            placeholder="选择城市"
            clearable
          >
            <el-option 
              v-for="city in cities" 
              :key="city.value" 
              :label="city.label" 
              :value="city.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchForm = reactive({
  keyword: '',
  state: '',
  city: ''
})

// 模拟数据，实际应该从API获取
const states = [
  { value: 'CA', label: '加利福尼亚州' },
  { value: 'NY', label: '纽约州' },
  { value: 'WA', label: '华盛顿州' },
  { value: 'FL', label: '佛罗里达州' },
  { value: 'TX', label: '德克萨斯州' },
  { value: 'IL', label: '伊利诺伊州' }
]

const cities = [
  { value: 'LA', label: '洛杉矶' },
  { value: 'SF', label: '旧金山' },
  { value: 'NYC', label: '纽约' },
  { value: 'SEA', label: '西雅图' },
  { value: 'MIA', label: '迈阿密' },
  { value: 'HOU', label: '休斯顿' },
  { value: 'CHI', label: '芝加哥' }
]

const handleSearch = () => {
  router.push({
    name: 'DockList',
    query: searchForm
  })
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.state = ''
  searchForm.city = ''
}
</script>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 30px;
  text-align: center;
}

.search-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
</style> 