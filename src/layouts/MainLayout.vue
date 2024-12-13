<template>
  <div class="main-layout">
    <!-- 导航栏 -->
    <el-row class="nav-header" justify="space-between" align="middle">
      <el-col :span="4" class="logo">
        <router-link to="/">
          <div class="logo-container">
            <div class="logo-icon">
              <div class="dock-logo">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- 字母 D 的主体部分 -->
                  <path class="d-body" d="M4 4h4v24H4z" fill="#5E3BEE"/>
                  <path class="d-curve" d="M8 4h12c4.418 0 8 3.582 8 8v8c0 4.418-3.582 8-8 8H8z" fill="#5E3BEE"/>
                  
                  <!-- 移动的卡车 -->
                  <g class="truck">
                    <path class="truck-body" 
                      d="M12 12h10v10h-10a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" 
                      fill="#7B5AFF"
                    />
                    <path class="truck-cabin"
                      d="M22 14h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v-6z"
                      fill="#5E3BEE"
                    />
                    <circle cx="14" cy="21" r="1.5" fill="#5E3BEE"/>
                    <circle cx="23" cy="21" r="1.5" fill="#5E3BEE"/>
                  </g>
                </svg>
              </div>
            </div>
            <span class="logo-text">DockFlow</span>
          </div>
        </router-link>
      </el-col>
      <el-col :span="16">
        <div class="nav-links">
          <router-link to="/" :class="{ active: currentRoute === '/' }">
            Home
          </router-link>
          <router-link to="/warehouses" :class="{ active: currentRoute === '/warehouses' }">
            Find Docks
          </router-link>
          <router-link to="/appointments" :class="{ active: currentRoute.includes('/appointment') }">
            My Bookings
          </router-link>
        </div>
      </el-col>
      <el-col :span="4" class="nav-actions">
        <router-link to="/auth/login">
          <el-button class="sign-in">Sign In</el-button>
        </router-link>
      </el-col>
    </el-row>

    <!-- 路由视图 -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRoute = computed(() => route.path)
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
}

.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 0 40px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
  z-index: 100;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.logo {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;

  a {
    text-decoration: none;
    display: flex;
    align-items: center;
    height: 100%;
  }
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 80px;
  padding: 0;
  align-items: center;

  &:hover {
    transform: translateY(-1px);

    .logo-d::after {
      animation-play-state: paused;
      transform: translateX(0) translateY(-50%);
      opacity: 1;
    }

    .logo-d {
      background: #5E3BEE;
      box-shadow: 0 2px 8px rgba(94, 59, 238, 0.2);
    }

    .logo-text {
      color: #5E3BEE;
    }
  }
}

.logo-icon {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.dock-logo {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  svg {
    width: 100%;
    height: 100%;
  }
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #1A1A1A;
  letter-spacing: -0.02em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1;
  margin: 0;
  padding: 0;
}

.nav-links {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;

  a {
    font-size: 16px;
    font-weight: 500;
    color: #666666;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 8px 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #5E3BEE;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    &:hover {
      color: #5E3BEE;

      &::after {
        transform: scaleX(1);
      }
    }

    &.active {
      color: #5E3BEE;

      &::after {
        transform: scaleX(1);
      }
    }
  }
}

.nav-actions {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.sign-in {
  height: 40px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #5E3BEE, #7B5AFF);
  border: none;
  color: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(94, 59, 238, 0.2);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-header {
    padding: 0 20px;
  }

  .nav-links {
    gap: 24px;
  }

  .logo-text {
    font-size: 20px;
  }
}

.d-body {
  transform-origin: left center;
}

.d-curve {
  transform-origin: left center;
}

.truck {
  animation: driveIn 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes driveIn {
  0% {
    transform: translateX(32px);
    opacity: 0;
  }
  30% {
    transform: translateX(0);
    opacity: 1;
  }
  70% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-32px);
    opacity: 0;
  }
}

.truck-body, .truck-cabin {
  transition: all 0.3s ease;
}

.logo-container {
  &:hover {
    .truck {
      animation-play-state: paused;
      transform: translateX(0);
      opacity: 1;
      .truck-body {
        filter: brightness(1.1);
      }
      .truck-cabin {
        filter: brightness(1.1);
      }
    }
  }
}
</style> 