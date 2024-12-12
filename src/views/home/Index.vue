<template>
  <div class="home">
    <!-- 导航栏 -->
    <el-row class="nav-header" justify="space-between" align="middle">
      <el-col :span="4" class="logo">
        <router-link to="/">
          <div class="logo-container">
            <div class="logo-icon">
              <div class="dock-door"></div>
              <div class="truck">
                <div class="truck-body"></div>
                <div class="truck-cabin"></div>
              </div>
              <div class="flow-line"></div>
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

    <!-- 主要内容 -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="light-effect"></div>
        <div class="grid-pattern"></div>
        <div class="particles"></div>
        <div class="glow-orbs"></div>
      </div>
      
      <el-row justify="center" align="middle" class="hero-container">
        <el-col :span="12" class="hero-content">
          <div class="hero-badge">
            <div class="badge-content">
              <div class="badge-icon">
                <el-icon><Star /></el-icon>
              </div>
              <div class="badge-text">
                <span class="highlight">1000+</span>
                <span class="divider">•</span>
                <span>Trusted by drivers across the US</span>
              </div>
            </div>
          </div>
          <h1>Quick and Easy Dock Booking for Drivers</h1>
          <p class="subtitle">Find and book available loading docks across the US in minutes. No more waiting in lines or phone calls.</p>
          <div class="cta-buttons">
            <el-button type="primary" size="large" @click="$router.push('/warehouses')">
              Find Available Docks
              <el-icon class="el-icon-right"><ArrowRight /></el-icon>
            </el-button>
            <el-button size="large" @click="$router.push('/auth/register')">
              Create Free Account
            </el-button>
          </div>
        </el-col>
        <el-col :span="12" class="hero-image">
          <div class="flow-cards-wrapper">
            <div class="flow-cards">
              <div class="flow-step" 
                   :class="{ active: activeStep === index }" 
                   v-for="(step, index) in steps" 
                   :key="index"
                   @mouseenter="handleStepHover(index)" 
                   @mouseleave="handleStepLeave">
                <div class="step-icon">
                  <div class="icon-bg">
                    <el-icon>
                      <component :is="step.icon" />
                    </el-icon>
                  </div>
                </div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <div class="time">{{ step.time }}</div>
                  <p>{{ step.description }}</p>
                </div>
                <div class="step-tips" v-if="activeStep === index">
                  <div v-for="(tip, tipIndex) in step.keyPoints" 
                       :key="tipIndex"
                       class="tip-item"
                       :class="{ 'show': showTipIndex >= tipIndex }">
                    <div class="tip-dot"></div>
                    <p>{{ tip }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="decoration-circle"></div>
            <div class="decoration-dots"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 特性部分 -->
    <div class="features-section">
      <div class="features-background">
        <div class="gradient-mesh"></div>
        <div class="floating-shapes"></div>
      </div>
      <el-row justify="center">
        <el-col :span="20">
          <h2 class="section-title">
            Why Drivers Choose DockFlow
            <div class="title-decoration"></div>
          </h2>
          <div class="features-grid">
            <div class="feature-card" 
                 v-for="(feature, index) in features" 
                 :key="index"
                 @mouseenter="activeFeature = index"
                 @mouseleave="activeFeature = null">
              <div class="feature-inner">
                <div class="feature-icon-wrapper">
                  <div class="icon-background"></div>
                  <div class="icon-container">
                    <component :is="feature.icon" />
                  </div>
                </div>
                <div class="feature-content">
                  <h3>{{ feature.title }}</h3>
                  <p>{{ feature.description }}</p>
                </div>
                <div class="hover-indicator"></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Van, 
  Calendar, 
  Box, 
  CircleCheck, 
  TrendCharts, 
  ArrowRight,
  Timer,
  DataAnalysis,
  Bell,
  Star,
} from '@element-plus/icons-vue'

const route = useRoute()
const currentRoute = computed(() => route.path)
const activeStep = ref<number | null>(null)
const activeFeature = ref<number | null>(null)
const showTipIndex = ref(-1)
let tipTimer = null

const handleStepHover = (index) => {
  activeStep.value = index
  showTipIndex.value = -1
  
  // 清除之前的定时器
  if (tipTimer) {
    clearInterval(tipTimer)
  }
  
  // 逐个显示提示
  let currentTip = 0
  tipTimer = setInterval(() => {
    if (currentTip < steps[index].keyPoints.length) {
      showTipIndex.value = currentTip
      currentTip++
    } else {
      clearInterval(tipTimer)
    }
  }, 300)
}

const handleStepLeave = () => {
  activeStep.value = null
  showTipIndex.value = -1
  if (tipTimer) {
    clearInterval(tipTimer)
  }
}

// 临时使用 Base64 编码的 SVG
const heroImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHN0eWxlPgogICAgLmxpbmVzIHsKICAgICAgc3Ryb2tlOiAjNUUzQkVFOwogICAgICBzdHJva2Utd2lkdGg6IDI7CiAgICAgIHN0cm9rZS1saW5lY2FwOiByb3VuZDsKICAgICAgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsKICAgIH0KICAgIC5maWxsIHsKICAgICAgZmlsbDogcmdiYSg5NCwgNTksIDIzOCwgMC4xKTsKICAgIH0KICA8L3N0eWxlPgogIDxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgY2xhc3M9ImZpbGwiIC8+CiAgPHBhdGggZD0iTTEwMCAzMDAgaDYwMCIgY2xhc3M9ImxpbmVzIiAvPgogIDxwYXRoIGQ9Ik0zMDAgMTAwIHYzMDAiIGNsYXNzPSJsaW5lcyIgLz4KICA8cGF0aCBkPSJNNTAwIDEwMCB2MzAwIiBjbGFzcz0ibGluZXMiIC8+CiAgPHBhdGggZD0iTTEwMCA0MDAgaDYwMCIgY2xhc3M9ImxpbmVzIiAvPgogIDxyZWN0IHg9IjE1MCIgeT0iMzIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiBjbGFzcz0ibGluZXMiIC8+CiAgPHJlY3QgeD0iMzUwIiB5PSIzMjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIGNsYXNzPSJsaW5lcyIgLz4KICA8cmVjdCB4PSI1NTAiIHk9IjMyMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI2MCIgY2xhc3M9ImxpbmVzIiAvPgo8L3N2Zz4='

// 图片 URL 配置
const warehouseImage = {
  local: new URL('@/assets/images/warehouse-dock.jpg', import.meta.url).href,
  fallback: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
}

const features = [
  {
    icon: Timer,
    title: 'Quick Booking',
    description: 'Book your preferred dock time slot in less than 2 minutes. No phone calls needed.'
  },
  {
    icon: DataAnalysis,
    title: 'Real-time Availability',
    description: 'See live dock availability and get instant confirmation for your bookings.'
  },
  {
    icon: Bell,
    title: 'SMS Updates',
    description: 'Get automatic notifications about your booking status and wait times.'
  }
]

// 更新步骤数据
const steps = [
  {
    icon: Calendar,
    title: 'Book',
    time: '09:00 AM',
    description: 'Fill loading/unloading details',
    keyPoints: [
      'Enter cargo type & volume',
      'Specify equipment needed',
      'Add special handling requirements',
      'Set preferred time window'
    ]
  },
  {
    icon: Van,
    title: 'Arrive',
    time: '09:15 AM',
    description: 'Check-in at security gate',
    keyPoints: [
      'Show digital confirmation',
      'Verify truck & cargo details',
      'Get dock assignment',
      'Receive safety instructions'
    ]
  },
  {
    icon: Box,
    title: 'Load/Unload',
    time: '09:30 AM',
    description: 'Dock operations in progress',
    keyPoints: [
      'Follow dock guide signals',
      'Monitor loading progress',
      'Verify cargo condition',
      'Sign digital documents'
    ]
  },
  {
    icon: CircleCheck,
    title: 'Complete',
    time: '10:00 AM',
    description: 'Departure confirmed',
    keyPoints: [
      'Get completion signature',
      'Collect final documents',
      'Rate dock experience',
      'Schedule next booking'
    ]
  }
]
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #ffffff;
}

.nav-header {
  padding: 1rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.logo {
  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #000000;
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.nav-links {
  display: flex;
  justify-content: center;
  gap: 2rem;

  a {
    text-decoration: none;
    color: #000000;
    font-weight: 500;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    transition: color 0.2s;

    &:hover {
      color: #5E3BEE;
    }

    &.active {
      color: #5E3BEE;
    }
  }
}

.nav-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  .el-button {
    border-radius: 4px;
    font-size: 0.9rem;
    padding: 8px 16px;
  }

  .sign-in {
    color: #000000;
    border: none;

    &:hover {
      color: #5E3BEE;
    }
  }

  .el-button--primary {
    background: #5E3BEE;
    border-color: #5E3BEE;

    &:hover {
      background: #4E31C8;
      border-color: #4E31C8;
    }
  }
}

.hero-section {
  position: relative;
  padding: 120px 0 80px;
  background: linear-gradient(125deg, 
    #2A1163 0%, 
    #3B1D8A 25%, 
    #4A25E1 60%, 
    #6D4AFF 100%
  );
  overflow: hidden;
  isolation: isolate;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: -1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(123, 90, 255, 0.2) 0%, transparent 50%);
    mix-blend-mode: overlay;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
}

/* 添加动态光效 */
.light-effect {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.08) 15%, 
      rgba(255, 255, 255, 0.08) 85%, 
      transparent 100%
    );
  transform: skewY(-12deg) translateY(-50%);
  animation: lightMove 8s ease-in-out infinite;
}

/* 添加网格效果 */
.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: perspective(1000px) rotateX(60deg) translateY(-100px);
  opacity: 0.3;
}

/* 添加粒子效果 */
.particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 1px
  );
  background-size: 40px 40px;
  animation: particleFloat 20s linear infinite;
}

/* 添加光晕效果 */
.glow-orbs {
  position: absolute;
  inset: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    top: -200px;
    right: -100px;
    background: radial-gradient(
      circle at center,
      rgba(123, 90, 255, 0.2) 0%,
      rgba(123, 90, 255, 0.1) 30%,
      transparent 70%
    );
    filter: blur(40px);
    animation: orbFloat 15s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    bottom: -100px;
    left: -100px;
    background: radial-gradient(
      circle at center,
      rgba(94, 59, 238, 0.2) 0%,
      rgba(94, 59, 238, 0.1) 30%,
      transparent 70%
    );
    filter: blur(30px);
    animation: orbFloat 12s ease-in-out infinite alternate;
  }
}

@keyframes lightMove {
  0%, 100% {
    transform: skewY(-12deg) translateY(-50%);
  }
  50% {
    transform: skewY(-12deg) translateY(0);
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-40px);
  }
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-30px, 30px);
  }
}

/* 更新内容样式 */
.hero-content {
  position: relative;
  z-index: 2;

  h1 {
    background: linear-gradient(to right, #FFFFFF, rgba(255, 255, 255, 0.9));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 3.5rem;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 600px;
}

.hero-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.flow-cards-wrapper {
  position: relative;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.flow-cards {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.flow-step {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  margin-bottom: 1.25rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);

  &:hover, &.active {
    transform: translateX(12px);
    background: white;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.3);
  }
}

.step-icon {
  flex-shrink: 0;
  margin-right: 1.25rem;
}

.icon-bg {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  box-shadow: 
    0 4px 12px rgba(94, 59, 238, 0.1),
    inset 0 0 0 1px rgba(94, 59, 238, 0.1);

  .el-icon {
    font-size: 1.5rem;
    color: #5E3BEE;
    transition: all 0.4s ease;
  }
}

.step-content {
  flex: 1;

  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1A1A1A;
    margin: 0 0 0.25rem;
  }

  .time {
    color: #5E3BEE;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.375rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      background: currentColor;
      border-radius: 50%;
      opacity: 0.5;
    }
  }

  p {
    color: #666;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
  }
}

.step-tips {
  position: absolute;
  left: calc(100% + 1.5rem);
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;

  &.show {
    opacity: 1;
    transform: translateX(0);
  }

  .tip-dot {
    width: 8px;
    height: 8px;
    background: #5E3BEE;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: rgba(94, 59, 238, 0.2);
      animation: pulse 2s ease-in-out infinite;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.95);
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
    background: rgba(94, 59, 238, 0.1);
    backdrop-filter: blur(10px);
    padding: 0.625rem 0.875rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

/* 添加连接线动画 */
.flow-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 24px;
  top: 100%;
  width: 2px;
  height: 1.25rem;
  background: linear-gradient(to bottom, 
    rgba(94, 59, 238, 0.3),
    rgba(94, 59, 238, 0.1)
  );
}

@media (max-width: 1200px) {
  .step-tips {
    display: none;
  }
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  position: relative;
  width: 32px;
  height: 32px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.dock-door {
  position: absolute;
  left: 4px;
  top: 8px;
  width: 12px;
  height: 16px;
  background: #5E3BEE;
  border-radius: 2px;
}

.truck {
  position: absolute;
  right: 2px;
  bottom: 6px;
  width: 16px;
  height: 10px;
}

.truck-body {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 8px;
  background: #5E3BEE;
  border-radius: 1px;
}

.truck-cabin {
  position: absolute;
  right: 12px;
  bottom: 0;
  width: 4px;
  height: 6px;
  background: #5E3BEE;
  border-radius: 1px;
}

.flow-line {
  position: absolute;
  left: 16px;
  top: 16px;
  width: 12px;
  height: 2px;
  background: #5E3BEE;
  transform: rotate(-45deg);
  opacity: 0.6;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 2px;
    background: #5E3BEE;
    opacity: 0.4;
  }

  &::before {
    left: -4px;
    top: -3px;
    transform: rotate(-30deg);
  }

  &::after {
    right: -4px;
    bottom: -3px;
    transform: rotate(-30deg);
  }
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  letter-spacing: -0.02em;
}

/* Logo 动画效果 */
.logo-container {
  &:hover {
    .truck {
      animation: moveTruck 1s ease-in-out;
    }
    
    .flow-line {
      animation: flowEffect 1s ease-in-out;
    }
  }
}

@keyframes moveTruck {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-8px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes flowEffect {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.features-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #F8F9FF 0%, #FFFFFF 100%);
  position: relative;
  overflow: hidden;
}

.features-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gradient-mesh {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(94, 59, 238, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(94, 59, 238, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
}

.floating-shapes {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: linear-gradient(135deg, rgba(94, 59, 238, 0.1), rgba(123, 90, 255, 0.1));
    border-radius: 50%;
  }
  
  &::before {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -100px;
    animation: float 15s ease-in-out infinite;
  }
  
  &::after {
    width: 300px;
    height: 300px;
    bottom: -50px;
    left: -50px;
    animation: float 12s ease-in-out infinite reverse;
  }
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4rem;
  position: relative;
}

.title-decoration {
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #5E3BEE, #7B5AFF);
  border-radius: 2px;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #5E3BEE;
  }
  
  &::before {
    left: -4px;
  }
  
  &::after {
    right: -4px;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  position: relative;
  height: 320px;
  perspective: 1000px;
}

.feature-inner {
  position: relative;
  height: 100%;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(94, 59, 238, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  
  &:hover {
    transform: translateY(-8px) rotateX(2deg) rotateY(-2deg);
    box-shadow: 
      0 20px 40px rgba(94, 59, 238, 0.1),
      0 0 0 1px rgba(94, 59, 238, 0.05);
      
    .icon-background {
      transform: scale(1.2);
      opacity: 0.2;
    }
    
    .icon-container {
      transform: translateY(-4px);
      background: linear-gradient(135deg, #5E3BEE, #7B5AFF);
      
      .el-icon {
        color: white;
      }
    }
    
    .hover-indicator {
      opacity: 1;
      transform: scaleX(1);
    }
  }
}

.feature-icon-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.icon-background {
  position: absolute;
  width: 80px;
  height: 80px;
  background: #5E3BEE;
  filter: blur(24px);
  opacity: 0.1;
  border-radius: 20px;
  transition: all 0.5s ease;
}

.icon-container {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  
  .el-icon {
    font-size: 2rem;
    color: #5E3BEE;
    transition: all 0.4s ease;
    filter: drop-shadow(0 2px 4px rgba(94, 59, 238, 0.2));
  }
}

.feature-content {
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }
  
  p {
    color: #666666;
    line-height: 1.7;
    font-size: 1rem;
  }
}

.hover-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #5E3BEE, #7B5AFF);
  border-radius: 0 0 24px 24px;
  opacity: 0;
  transform: scaleX(0.8);
  transform-origin: center;
  transition: all 0.5s ease;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, 20px);
  }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    height: auto;
  }
  
  .feature-inner {
    padding: 2rem;
  }
}

.hero-badge {
  display: inline-flex;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.badge-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 3s infinite;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(255, 255, 255, 0.1);
  }
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);

  .el-icon {
    font-size: 1.25rem;
    color: white;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    animation: starPulse 2s infinite;
  }
}

.badge-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;

  .highlight {
    color: #FFD700;
    font-weight: 700;
    font-size: 1.1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .divider {
    color: rgba(255, 255, 255, 0.5);
  }
}

.feature-inner:hover {
  .icon-container {
    transform: translateY(-4px);
    
    .el-icon {
      color: #5E3BEE;
      transform: scale(1.1);
      filter: drop-shadow(0 4px 8px rgba(94, 59, 238, 0.3));
    }
  }
}

@keyframes starPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  50%, 100% {
    transform: translateX(100%);
  }
}
</style> 