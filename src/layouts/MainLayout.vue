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
        <template v-if="isLoggedIn">
          <el-dropdown trigger="click">
            <div class="user-menu">
              <el-avatar 
                :size="32" 
                :src="userAvatar" 
                class="user-avatar"
              >
                {{ userInitials }}
              </el-avatar>
              <span class="user-name">{{ userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleProfile">
                  <el-icon><User /></el-icon>
                  Profile
                </el-dropdown-item>
                <el-dropdown-item @click="handleChangePassword">
                  <el-icon><Lock /></el-icon>
                  Change Password
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  Sign Out
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <router-link v-else to="/auth/login">
          <el-button class="sign-in">Sign In</el-button>
        </router-link>
      </el-col>
    </el-row>

    <!-- 路由视图 -->
    <router-view></router-view>

    <!-- 添加修改密码对话框 -->
    <el-dialog
      v-model="changePasswordVisible"
      title="Change Password"
      width="480px"
      class="change-password-dialog"
      :show-close="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-position="top"
      >
        <el-form-item label="Current Password" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            placeholder="Enter your current password"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="New Password" prop="password">
          <el-input
            v-model="passwordForm.password"
            type="password"
            placeholder="Enter new password"
            prefix-icon="Lock"
            show-password
          />
          <div class="password-hint">
            <el-icon><InfoFilled /></el-icon>
            <span>Password must be at least 8 characters with uppercase, lowercase, number and special character</span>
          </div>
        </el-form-item>
        
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="changePasswordVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            @click="submitChangePassword"
            :loading="changingPassword"
          >
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, SwitchButton, User, Lock, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const router = useRouter()
const currentRoute = computed(() => route.path)

// 用户登录状态
const isLoggedIn = computed(() => {
  return localStorage.getItem('token') !== null
})

// 获取用户信息
const userInfo = computed(() => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
})

// 用户名
const userName = computed(() => {
  return userInfo.value?.name || '用户'
})

// 用户头像显示的首字母
const userInitials = computed(() => {
  return userName.value.charAt(0).toUpperCase()
})

// 用户头像
const userAvatar = computed(() => {
  return userInfo.value?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userInfo.value?.email
})

// 修改密码相关
const changePasswordVisible = ref(false)
const changingPassword = ref(false)
const passwordFormRef = ref<FormInstance>()

const passwordForm = reactive({
  currentPassword: '',
  password: '',
  confirmPassword: ''
})

const passwordRules = {
  currentPassword: [
    { required: true, message: 'Please enter current password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter new password', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm new password', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.password) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理查看个人资料
const handleProfile = () => {
  router.push('/profile')
}

// 处理修改密码
const handleChangePassword = () => {
  changePasswordVisible.value = true
  passwordForm.currentPassword = ''
  passwordForm.password = ''
  passwordForm.confirmPassword = ''
}

// 提交修改密码
const submitChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    changingPassword.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('Password changed successfully')
    changePasswordVisible.value = false
  } catch (error) {
    ElMessage.error('Please check your input')
  } finally {
    changingPassword.value = false
  }
}

// 修改退出登录提示为英文
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  ElMessage.success('Signed out successfully')
  // 先跳转到首页,再清除路由历史
  router.push('/').then(() => {
    window.location.reload() // 刷新页面以清除所有状态
  })
}
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

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.user-avatar {
  background: #5E3BEE;
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  
  .el-icon {
    margin: 0;
  }

  &.el-dropdown-menu__item--divided {
    border-top: 1px solid #EBEEF5;
    margin-top: 4px;
    padding-top: 12px;
  }
}

.change-password-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #EBEEF5;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #1A1A1A;
    }
  }
  
  :deep(.el-dialog__body) {
    padding: 24px;
  }
  
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #1A1A1A;
    padding-bottom: 8px;
  }
  
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 0 0 1px rgba(94, 59, 238, 0.3);
    }
    
    &.is-focus {
      box-shadow: 0 0 0 2px rgba(94, 59, 238, 0.2);
    }
  }
  
  .password-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 8px 12px;
    background: rgba(94, 59, 238, 0.05);
    border-radius: 6px;
    
    .el-icon {
      color: var(--el-color-primary);
      font-size: 14px;
    }
    
    span {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
  }
  
  .dialog-footer {
    padding: 16px 24px;
    border-top: 1px solid #EBEEF5;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .el-button--primary {
      background: linear-gradient(135deg, #5E3BEE, #7B5AFF);
      border: none;
      padding: 10px 24px;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(94, 59, 238, 0.2);
      }
    }
  }
}
</style> 