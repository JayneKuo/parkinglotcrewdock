<template>
  <router-link to="/" class="brand-logo">
    <div class="logo-wrapper">
      <div class="logo-main">
        <h1 class="logo-text">DockFlow</h1>
        <span class="tagline">Dock Appointment System</span>
      </div>
      <div class="back-hint">
        <el-icon><ArrowLeft /></el-icon>
        <span>Back to Home</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
</script>

<style scoped>
.brand-logo {
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 12px;
  position: relative;
}

.brand-logo:hover {
  background: rgba(255, 255, 255, 0.1);
}

.brand-logo:hover .back-hint {
  opacity: 1;
  transform: translateY(0);
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.logo-main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.logo-text {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.tagline {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.back-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

.back-hint .el-icon {
  font-size: 1rem;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .brand-logo {
    display: flex;
    justify-content: center;
  }

  .logo-wrapper {
    align-items: center;
  }

  .back-hint {
    opacity: 0.8;
    transform: translateY(0);
  }
}
</style> 