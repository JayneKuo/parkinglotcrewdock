<template>
  <div class="dock-detail">
    <!-- Navigation Bar -->
    <div class="detail-nav">
      <div class="nav-container">
        <div class="nav-left">
          <div class="back-button" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            <span>Back</span>
          </div>
          <div class="page-title">
            <div class="title-with-status">
              <h1>{{ dockDetail?.name }}</h1>
              <el-tag 
                :type="dockDetail?.status === 1 ? 'success' : 'danger'"
                class="status-tag"
              >
                {{ dockDetail?.status === 1 ? 'Operating' : 'Closed' }}
              </el-tag>
            </div>
          </div>
        </div>
        <div class="nav-right">
          <el-button 
            plain
            class="my-bookings-btn" 
            @click="goToMyBookings"
          >
            <el-icon><Calendar /></el-icon>
            My Bookings
          </el-button>
          <el-button 
            type="primary" 
            size="large"
            class="book-btn"
            @click="handleBooking"
          >
            Book Appointment
          </el-button>
          <template v-if="isLoggedIn">
            <el-dropdown trigger="click">
              <div class="user-info">
                <el-avatar :size="32" :src="userInfo.avatar">
                  {{ userInfo.name.charAt(0) }}
                </el-avatar>
                <span class="username">{{ userInfo.name }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToProfile">Profile</el-dropdown-item>
                  <el-dropdown-item @click="goToSettings">Settings</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <button 
              class="login-btn"
              @click="goToLogin"
            >
              Sign In
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="detail-container" v-loading="loading">
      <!-- Left Column: Basic Info -->
      <div class="detail-left">
        <div class="basic-info">
          <div class="info-section">
            <h2>Warehouse Information</h2>
            <div class="info-item">
              <label>Warehouse Name</label>
              <span>{{ dockDetail?.name }}</span>
            </div>
            <div class="info-item">
              <label>Available Services</label>
              <div class="services-list">
                <el-tag v-for="service in dockDetail?.services" :key="service">
                  {{ service }}
                </el-tag>
              </div>
            </div>
            <div class="info-item">
              <label>Available Vehicles</label>
              <div class="vehicles-info">
                <span>{{ dockDetail?.availableVehicles }} / {{ dockDetail?.totalVehicles }}</span>
                <el-progress 
                  :percentage="vehicleAvailabilityPercentage" 
                  :status="vehicleAvailabilityStatus"
                />
              </div>
            </div>
          </div>

          <div class="info-section">
            <h2>Location</h2>
            <div class="address-info">
              <p>{{ dockDetail?.address }}</p>
              <p>{{ dockDetail?.city }}, {{ dockDetail?.state }} {{ dockDetail?.zipCode }}</p>
              <el-button type="primary" link @click="openGoogleMaps">
                <el-icon><Location /></el-icon>
                Navigate with Google Maps
              </el-button>
            </div>
          </div>

          <div class="info-section">
            <h2>Pricing</h2>
            <div class="pricing-info">
              <div class="rate-item">
                <label>Rate Type</label>
                <el-tag :type="getPricingTagType">{{ getPricingText }}</el-tag>
              </div>
              <div class="rate-item">
                <label>Rate</label>
                <span class="price">${{ dockDetail?.priceRate }}/{{ getPricingUnit }}</span>
              </div>
              <div class="rate-item">
                <label>Minimum Charge</label>
                <span>${{ dockDetail?.minimumCharge }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h2>Contact Information</h2>
            <div class="contact-info">
              <div class="info-item">
                <label>Contact Person</label>
                <span>{{ dockDetail?.contactPerson }}</span>
              </div>
              <div class="info-item">
                <label>Phone</label>
                <span>{{ dockDetail?.contactPhone }}</span>
              </div>
              <div class="info-item">
                <label>Email</label>
                <span>{{ dockDetail?.email }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h2>Rules & Penalties</h2>
            <div class="rules-info">
              <div class="info-item">
                <label>Cancellation Policy</label>
                <p>{{ dockDetail?.cancellationPolicy }}</p>
              </div>
              <div class="info-item">
                <label>Late Fee</label>
                <p>${{ dockDetail?.lateFee }} per hour</p>
              </div>
              <div class="info-item">
                <label>No-Show Penalty</label>
                <p>${{ dockDetail?.noShowPenalty }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Detailed Info -->
      <div class="detail-right">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="Overview" name="overview">
            <div class="overview-section" ref="overviewSection">
              <!-- Facility Photos Section -->
              <div class="section" ref="photosSection">
                <h2>Facility Photos</h2>
                <div class="photos-preview" v-if="!loading">
                  <img 
                    :src="DEMO_IMAGES.main"
                    :alt="dockDetail?.name"
                    @click="() => handleImagePreview(DEMO_IMAGES.main)"
                    @error="handleImageError"
                  >
                  <div class="photos-grid">
                    <img 
                      v-for="(photo, index) in DEMO_IMAGES.facility" 
                      :key="index"
                      :src="photo"
                      :alt="`Facility photo ${index + 1}`"
                      @click="() => handleImagePreview(photo)"
                      @error="handleImageError"
                    >
                  </div>
                </div>
                <div v-else class="loading-placeholder">
                  <el-skeleton animated :rows="3" />
                </div>
              </div>

              <!-- Description Section -->
              <div class="section" ref="descriptionSection">
                <h2>About the Facility</h2>
                <div class="description-preview" v-html="dockDetail?.description.slice(0, 200) + '...'"></div>
              </div>

              <!-- Building Info Section -->
              <div class="section" ref="buildingSection">
                <h2>Building Information</h2>
                <div class="specs-preview">
                  <div class="spec-item">
                    <label>Building Type</label>
                    <span>{{ dockDetail?.buildingType }}</span>
                  </div>
                  <div class="spec-item">
                    <label>Total Area</label>
                    <span>{{ dockDetail?.totalArea }} sq ft</span>
                  </div>
                </div>
              </div>

              <!-- Facilities Section -->
              <div class="section" ref="facilitiesSection">
                <h2>Available Facilities</h2>
                <div class="facilities-preview">
                  <div v-for="facility in dockDetail?.facilities.slice(0, 3)" 
                       :key="facility.name" 
                       class="facility-item"
                  >
                    <el-icon><component :is="facility.icon" /></el-icon>
                    <span>{{ facility.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Disclaimer Preview -->
              <div class="section" ref="disclaimerSection">
                <h2>Terms & Insurance</h2>
                <div class="disclaimer-preview">
                  <p>View our complete terms, conditions, and insurance requirements.</p>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Facility Photos" name="photos">
            <div class="photos-section" ref="photosSection">
              <div class="main-photo">
                <img 
                  :src="DEMO_IMAGES.main"
                  :alt="dockDetail?.name"
                  @click="() => handleImagePreview(DEMO_IMAGES.main)"
                  @error="handleImageError"
                >
              </div>
              <div class="photo-grid">
                <img 
                  v-for="(photo, index) in DEMO_IMAGES.facility" 
                  :key="index"
                  :src="photo"
                  :alt="`Facility photo ${index + 1}`"
                  @click="() => handleImagePreview(photo)"
                  @error="handleImageError"
                >
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Detailed Description" name="description">
            <div class="description-section" ref="descriptionSection">
              <h3>About the Facility</h3>
              <div class="description-content" v-html="dockDetail?.description"></div>
              
              <h3>Operating Hours</h3>
              <div class="hours-grid">
                <div v-for="(hours, day) in dockDetail?.operatingHours" 
                     :key="day" 
                     class="hours-item"
                >
                  <span class="day">{{ day }}</span>
                  <span class="hours">{{ hours }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Building Information" name="building">
            <div class="building-section" ref="buildingSection">
              <h3>Building Specifications</h3>
              <div class="specs-grid">
                <div class="spec-item">
                  <label>Building Type</label>
                  <span>{{ dockDetail?.buildingType }}</span>
                </div>
                <div class="spec-item">
                  <label>Total Area</label>
                  <span>{{ dockDetail?.totalArea }} sq ft</span>
                </div>
                <div class="spec-item">
                  <label>Ceiling Height</label>
                  <span>{{ dockDetail?.ceilingHeight }} ft</span>
                </div>
                <div class="spec-item">
                  <label>Loading Capacity</label>
                  <span>{{ dockDetail?.loadingCapacity }} lbs</span>
                </div>
              </div>

              <h3>Building Photos</h3>
              <div class="building-photos" v-if="!loading">
                <img 
                  v-for="(photo, index) in DEMO_IMAGES.building" 
                  :key="index"
                  :src="photo"
                  :alt="`Building photo ${index + 1}`"
                  @click="() => handleImagePreview(photo)"
                  @error="handleImageError"
                >
              </div>
              <div v-else class="loading-placeholder">
                <el-skeleton animated :rows="2" />
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Facilities" name="facilities">
            <div class="facilities-section" ref="facilitiesSection">
              <h3>Available Facilities</h3>
              <div class="facilities-grid">
                <div v-for="facility in dockDetail?.facilities" 
                     :key="facility.name" 
                     class="facility-item"
                >
                  <el-icon><component :is="facility.icon" /></el-icon>
                  <div class="facility-info">
                    <span class="name">{{ facility.name }}</span>
                    <span class="description">{{ facility.description }}</span>
                  </div>
                </div>
              </div>

              <h3>Equipment</h3>
              <div class="equipment-list">
                <div v-for="equipment in dockDetail?.equipment" 
                     :key="equipment.name"
                     class="equipment-item"
                >
                  <span class="name">{{ equipment.name }}</span>
                  <span class="quantity">{{ equipment.quantity }} available</span>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Disclaimer" name="disclaimer">
            <div class="disclaimer-section" ref="disclaimerSection">
              <h3>Terms & Conditions</h3>
              <div class="terms-content" v-html="dockDetail?.terms"></div>
              
              <h3>Liability Disclaimer</h3>
              <div class="disclaimer-content" v-html="dockDetail?.disclaimer"></div>
              
              <h3>Insurance Requirements</h3>
              <div class="insurance-content" v-html="dockDetail?.insurance"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 图片预览组件 -->
    <el-image-viewer
      v-if="showPreview"
      :url-list="[previewImage]"
      @close="showPreview = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDockDetail } from '@/api/warehouse'
import { 
  Location, Phone, Message, Star, ArrowLeft, 
  Calendar, ArrowDown 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Define interfaces
interface OperatingHours {
  [key: string]: string
}

interface Facility {
  name: string
  icon: string
  description: string
}

interface Equipment {
  name: string
  quantity: number
}

interface DockDetail {
  id: string
  name: string
  status: number
  services: string[]
  availableVehicles: number
  totalVehicles: number
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  priceRate: number
  pricingType: 'hourly' | 'daily' | 'monthly'
  minimumCharge: number
  contactPerson: string
  contactPhone: string
  email: string
  cancellationPolicy: string
  lateFee: number
  noShowPenalty: number
  mainImage: string
  photos: string[]
  description: string
  operatingHours: OperatingHours
  buildingType: string
  totalArea: number
  ceilingHeight: number
  loadingCapacity: number
  buildingPhotos: string[]
  facilities: Facility[]
  equipment: Equipment[]
  terms: string
  disclaimer: string
  insurance: string
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const dockDetail = ref<DockDetail | null>(null)

// 用户状态
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token')
})

// 用户信息
const userInfo = computed(() => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return { name: '', avatar: '', email: '' }
  try {
    return JSON.parse(userStr)
  } catch (e) {
    return { name: '', avatar: '', email: '' }
  }
})

// 标签页状态
const activeTab = ref('overview')
const overviewSection = ref<HTMLElement | null>(null)
const photosSection = ref<HTMLElement | null>(null)
const descriptionSection = ref<HTMLElement | null>(null)
const buildingSection = ref<HTMLElement | null>(null)
const facilitiesSection = ref<HTMLElement | null>(null)
const disclaimerSection = ref<HTMLElement | null>(null)

// 图片预览相关
const showPreview = ref(false)
const previewImage = ref('')

// 默认图片（base64编码的简单占位图）
const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='

// 添加示例图片URL（全部使用仓库相关的真实图片）
const DEMO_IMAGES = {
  // 主图：现代化仓库内部
  main: 'https://plus.unsplash.com/premium_photo-1682092618341-9897d5b02442?w=800',
  // 设施图片：展示仓库内部各个区域和设施
  facility: [
    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',   // 现代化仓储区
    'https://images.unsplash.com/photo-1600783486189-553f6a73f6f2?w=800', // 自动化分拣系统
    'https://images.unsplash.com/photo-1601585099780-d8c1403dc4c4?w=800', // 高架货架区
    'https://images.unsplash.com/photo-1605899639694-808e19c6f6b6?w=800', // 装卸区域
    'https://images.unsplash.com/photo-1586528116493-d683c97629f8?w=800', // 物流中心内部
    'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800', // 现代仓储设备
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800', // 叉车作业区
    'https://images.unsplash.com/photo-1573599852326-2aa8bf1dcc24?w=800'  // 包装区域
  ],
  // 建筑外观图片：展示仓库建筑外观
  building: [
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', // 物流中心外观
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', // 仓库外部
    'https://images.unsplash.com/photo-1642544546266-981359f8dc93?w=800', // 装卸码头
    'https://images.unsplash.com/photo-1638272181967-7d3772a91265?w=800'  // 仓储基地
  ]
}

// 修改获取码头详情的逻辑
const fetchDockDetail = async () => {
  loading.value = true
  try {
    const { data } = await getDockDetail(route.params.id as string)
    // 添加示例图片
    dockDetail.value = {
      ...data,
      mainImage: DEMO_IMAGES.main,
      photos: DEMO_IMAGES.facility,
      buildingPhotos: DEMO_IMAGES.building
    }
  } catch (error) {
    ElMessage.error('Failed to fetch warehouse details')
  } finally {
    loading.value = false
  }
}

// 处理图片URL
const getImageUrl = (url: string | undefined | null) => {
  if (!url) return defaultImage
  if (url.startsWith('data:') || url.startsWith('http')) return url
  return defaultImage
}

// 处理图片错误
const handleImageError = (e: Event) => {
  if (e.target instanceof HTMLImageElement) {
    e.target.src = defaultImage
  }
}

// 处理图片预览
const handleImagePreview = (imageUrl?: string) => {
  previewImage.value = imageUrl ? getImageUrl(imageUrl) : defaultImage
  showPreview.value = true
}

// Computed properties
const vehicleAvailabilityPercentage = computed(() => {
  if (!dockDetail.value) return 0
  return Math.round((dockDetail.value.availableVehicles / dockDetail.value.totalVehicles) * 100)
})

const vehicleAvailabilityStatus = computed(() => {
  const percentage = vehicleAvailabilityPercentage.value
  if (percentage > 70) return 'success'
  if (percentage > 30) return 'warning'
  return 'exception'
})

const getPricingTagType = computed(() => {
  if (!dockDetail.value) return 'info'
  const types: Record<string, string> = {
    'hourly': 'success',
    'daily': 'warning',
    'monthly': 'info'
  }
  return types[dockDetail.value.pricingType] || 'info'
})

const getPricingText = computed(() => {
  if (!dockDetail.value) return ''
  const texts: Record<string, string> = {
    'hourly': 'Per Hour',
    'daily': 'Per Day',
    'monthly': 'Per Month'
  }
  return texts[dockDetail.value.pricingType] || ''
})

const getPricingUnit = computed(() => {
  if (!dockDetail.value) return ''
  const units: Record<string, string> = {
    'hourly': 'hour',
    'daily': 'day',
    'monthly': 'month'
  }
  return units[dockDetail.value.pricingType] || ''
})

// Methods
const goBack = () => {
  router.back()
}

const openGoogleMaps = () => {
  if (!dockDetail.value) return
  const { latitude, longitude } = dockDetail.value
  window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank')
}

// 处理登录跳转
const handleLoginRedirect = (redirectPath: string) => {
  router.push({
    path: '/auth/login',
    query: { redirect: redirectPath }
  })
}

// 处理预定按钮点击
const handleBooking = () => {
  if (!isLoggedIn.value) {
    const currentPath = `/booking/${route.params.id}`
    localStorage.setItem('redirectPath', currentPath)
    router.push({
      path: '/auth/login',
      query: { redirect: currentPath }
    })
    return
  }
  router.push(`/booking/${route.params.id}`)
}

const showPhotoPreview = (photoUrl: string) => {
  // Implement photo preview logic
}

// 处理我的预定按钮点击
const goToMyBookings = () => {
  if (!isLoggedIn.value) {
    router.push({
      path: '/auth/login',
      query: { redirect: '/appointments' }
    })
    return
  }
  // 已登录，跳转到我的预定页面
  router.push('/appointments')
}

// 处理登录按钮点击
const goToLogin = () => {
  const currentPath = route.fullPath
  localStorage.setItem('redirectPath', currentPath)
  router.push({
    path: '/auth/login',
    query: { redirect: currentPath }
  })
}

const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/settings')
}

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth/login')
}

// 处理标签页点击
const handleTabClick = (tab: any) => {
  if (tab.props.name === 'overview') return

  const sectionRefs: Record<string, any> = {
    photos: photosSection,
    description: descriptionSection,
    building: buildingSection,
    facilities: facilitiesSection,
    disclaimer: disclaimerSection
  }

  const targetSection = sectionRefs[tab.props.name]?.value
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 监听滚动位置
const handleScroll = () => {
  if (!overviewSection.value) return

  const sections = [
    { ref: photosSection, tab: 'photos' },
    { ref: descriptionSection, tab: 'description' },
    { ref: buildingSection, tab: 'building' },
    { ref: facilitiesSection, tab: 'facilities' },
    { ref: disclaimerSection, tab: 'disclaimer' }
  ]

  for (const section of sections) {
    if (!section.ref.value) continue
    const rect = section.ref.value.getBoundingClientRect()
    if (rect.top <= 100 && rect.bottom >= 100) {
      activeTab.value = section.tab
      break
    }
  }
}

onMounted(() => {
  fetchDockDetail()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.dock-detail {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.detail-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: white;
  box-shadow: 0 1px 0 0 rgba(0,0,0,0.05);
  z-index: 100;

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 32px;

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #666;
      transition: all 0.3s;
      font-size: 15px;

      &:hover {
        color: var(--el-color-primary);
        transform: translateX(-4px);
      }

      .el-icon {
        font-size: 20px;
      }
    }

    .page-title {
      h1 {
        font-size: 22px;
        font-weight: 600;
        margin: 0 0 4px;
        color: #1a1a1a;
      }

      .status-tag {
        font-size: 13px;
        padding: 0 12px;
        height: 24px;
        line-height: 24px;
      }
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .my-bookings-btn {
      height: 40px;
      padding: 0 20px;
      font-size: 14px;
      border-radius: 20px;
      
      .el-icon {
        margin-right: 6px;
      }
    }

    .book-btn {
      height: 40px;
      padding: 0 24px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 20px;
    }

    .login-btn {
      height: 40px;
      padding: 0 24px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 20px;
      background-color: #6366f1;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #4f46e5;
      }

      &:active {
        background-color: #4338ca;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      .username {
        font-size: 14px;
        color: #1a1a1a;
      }

      .el-icon {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.detail-container {
  padding: 96px 24px 24px;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
}

.detail-left {
  position: sticky;
  top: 96px;
  height: calc(100vh - 96px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }

  .basic-info {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
  }

  .info-section {
    padding: 24px;
    border-bottom: 1px solid #f0f2f5;

    &:last-child {
      border-bottom: none;
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #1a1a1a;
    }
  }

  .info-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    label {
      display: block;
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
    }

    span {
      font-size: 15px;
      color: #1a1a1a;
      line-height: 1.5;
    }
  }

  .services-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .el-tag {
      font-size: 13px;
      padding: 0 12px;
      height: 28px;
      line-height: 28px;
      border-radius: 4px;
    }
  }

  .vehicles-info {
    .el-progress {
      margin-top: 12px;
    }
  }

  .address-info {
    p {
      margin: 0 0 8px;
      line-height: 1.5;
      color: #1a1a1a;
    }

    .el-button {
      margin-top: 12px;
      padding-left: 0;
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }

  .pricing-info {
    .rate-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .price {
        font-size: 24px;
        font-weight: 600;
        color: var(--el-color-primary);
      }
    }
  }
}

.detail-right {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);

  :deep(.el-tabs__header) {
    margin: 0;
    padding: 0 24px;
    border-bottom: 1px solid #f0f2f5;

    .el-tabs__nav-wrap::after {
      display: none;
    }

    .el-tabs__item {
      font-size: 15px;
      padding: 16px 24px;
      height: auto;
      transition: all 0.3s;

      &.is-active {
        font-weight: 600;
      }
    }
  }

  :deep(.el-tabs__content) {
    padding: 24px;
  }
}

.overview-section {
  .section {
    margin-bottom: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid #f0f2f5;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 24px;
      color: #1a1a1a;
    }
  }

  .photos-preview {
    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 16px;
      transition: transform 0.3s;
      cursor: pointer;

      &:hover {
        transform: scale(1.02);
      }
    }

    .photos-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      img {
        height: 180px;
        margin-bottom: 0;
      }
    }
  }

  .description-preview {
    font-size: 15px;
    line-height: 1.6;
    color: #666;
  }

  .specs-preview {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    .spec-item {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;

      label {
        display: block;
        font-size: 13px;
        color: #666;
        margin-bottom: 4px;
      }

      span {
        font-size: 15px;
        color: #1a1a1a;
        font-weight: 500;
      }
    }
  }

  .facilities-preview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .facility-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background: var(--el-color-primary-light-9);
        transform: translateY(-2px);
      }

      .el-icon {
        font-size: 24px;
        color: var(--el-color-primary);
      }

      span {
        font-size: 14px;
        color: #1a1a1a;
      }
    }
  }

  .disclaimer-preview {
    background: #f8f9fa;
    padding: 32px;
    border-radius: 8px;
    text-align: center;
    color: #666;

    p {
      font-size: 15px;
      line-height: 1.6;
      margin: 0;
    }
  }
}

.photos-section {
  .main-photo {
    margin-bottom: 24px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);

    img {
      width: 100%;
      height: 500px;
      object-fit: cover;
    }
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.description-section {
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px;
    color: #1a1a1a;

    &:not(:first-child) {
      margin-top: 40px;
    }
  }

  .description-content {
    font-size: 15px;
    line-height: 1.6;
    color: #666;
    white-space: pre-line;
  }

  .hours-grid {
    display: grid;
    gap: 12px;

    .hours-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 8px;

      .day {
        font-weight: 500;
        color: #1a1a1a;
      }

      .hours {
        color: #666;
      }
    }
  }
}

.building-section {
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px;
    color: #1a1a1a;

    &:not(:first-child) {
      margin-top: 40px;
    }
  }

  .specs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 40px;

    .spec-item {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;

      label {
        display: block;
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }

      span {
        font-size: 16px;
        font-weight: 500;
        color: #1a1a1a;
      }
    }
  }

  .building-photos {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.facilities-section {
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px;
    color: #1a1a1a;

    &:not(:first-child) {
      margin-top: 40px;
    }
  }

  .facilities-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  .facility-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      background: var(--el-color-primary-light-9);
      transform: translateY(-2px);
    }

    .el-icon {
      font-size: 24px;
      color: var(--el-color-primary);
    }

    .facility-info {
      .name {
        display: block;
        font-size: 16px;
        font-weight: 500;
        color: #1a1a1a;
        margin-bottom: 4px;
      }

      .description {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
    }
  }

  .equipment-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .equipment-item {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      .name {
        display: block;
        font-size: 15px;
        font-weight: 500;
        color: #1a1a1a;
        margin-bottom: 4px;
      }

      .quantity {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

.disclaimer-section {
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px;
    color: #1a1a1a;

    &:not(:first-child) {
      margin-top: 40px;
    }
  }

  .terms-content,
  .disclaimer-content,
  .insurance-content {
    font-size: 15px;
    line-height: 1.6;
    color: #666;
    white-space: pre-line;
  }
}

.title-with-status {
  display: flex;
  align-items: center;
  gap: 12px;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .status-tag {
    margin-left: 8px;
  }
}

// 添加图片预览相关样式
img {
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
}

.loading-placeholder {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.photos-grid img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photos-grid img:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.main-photo img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.main-photo img:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

:deep(.el-image-viewer__wrapper) {
  background-color: rgba(0, 0, 0, 0.9);
}

:deep(.el-image-viewer__close) {
  color: #fff;
  font-size: 24px;
  width: 40px;
  height: 40px;
  line-height: 40px;
}

.building-photos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 24px;
}

.building-photos img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.building-photos img:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
</style> 