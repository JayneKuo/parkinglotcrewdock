<template>
  <div class="register-page">
    <!-- 背景效果 -->
    <div class="page-background">
      <div class="gradient-layer"></div>
      <div class="pattern-grid"></div>
      <div class="glow-effect"></div>
    </div>

    <div class="register-container">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <router-link to="/" class="logo-link">
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
          <div class="feature-list">
            <div class="feature-item">
              <el-icon><Grid /></el-icon>
              <div class="feature-text">
                <h3>One-stop-shop</h3>
                <p>No more keeping a list of URLs, user names, and passwords for every shipper.</p>
              </div>
            </div>
            <div class="feature-item">
              <el-icon><Timer /></el-icon>
              <div class="feature-text">
                <h3>Quick & Convenient</h3>
                <p>Schedule appointments online without making a phone call or waiting for email responses.</p>
              </div>
            </div>
            <div class="feature-item">
              <el-icon><Van /></el-icon>
              <div class="feature-text">
                <h3>Easy for drivers</h3>
                <p>Confirmation emails with appointment date, time, address, check-in instructions, and contact information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧注册表单 -->
      <div class="form-section">
        <div class="form-container">
          <h1>Register for free now</h1>
          <p class="subtitle">Already have an account? <router-link to="/auth/login" class="login-link">Sign in</router-link></p>

          <el-form ref="formRef" :model="form" :rules="rules" class="register-form">
            <div class="name-group">
              <el-form-item prop="firstName">
                <el-input 
                  v-model="form.firstName" 
                  placeholder="First name"
                  :prefix-icon="User"
                />
              </el-form-item>
              <el-form-item prop="lastName">
                <el-input 
                  v-model="form.lastName" 
                  placeholder="Last name"
                  :prefix-icon="User"
                />
              </el-form-item>
            </div>

            <el-form-item prop="email">
              <el-input 
                v-model="form.email" 
                placeholder="Email"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="password" class="password-item">
              <el-input 
                v-model="form.password" 
                type="password" 
                placeholder="Create a password following the requirements below"
                :prefix-icon="Lock"
                :suffix-icon="View"
                @click:suffix="togglePasswordVisibility"
              />
              <div class="password-requirements">
                <div class="requirement" :class="{ met: passwordMeets.length }">
                  Must have at least 8 characters
                </div>
                <div class="requirement" :class="{ met: passwordMeets.uppercase }">
                  Must contain upper-case and lower-case
                </div>
                <div class="requirement" :class="{ met: passwordMeets.special }">
                  Must contain at least one special character
                </div>
                <div class="requirement" :class="{ met: passwordMeets.number }">
                  Must contain at least one number
                </div>
              </div>
            </el-form-item>

            <el-button type="primary" class="submit-btn" @click="handleSubmit" :loading="loading">
              Register <el-icon class="el-icon-right"><ArrowRight /></el-icon>
            </el-button>

            <div class="terms">
              By clicking Register, you agree to our 
              <a href="#" class="link">Terms and Conditions</a> and 
              <a href="#" class="link">Privacy Policy</a>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Message, Lock, View, User, Grid, Timer, Van, ArrowRight } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const passwordMeets = computed(() => ({
  length: form.password.length >= 8,
  uppercase: /(?=.*[A-Z])(?=.*[a-z])/.test(form.password),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
  number: /\d/.test(form.password)
}))

const rules: FormRules = {
  firstName: [
    { required: true, message: 'First name is required', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Last name is required', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!passwordMeets.value.uppercase) {
          callback(new Error('Password must contain both upper and lower case letters'))
        } else if (!passwordMeets.value.special) {
          callback(new Error('Password must contain at least one special character'))
        } else if (!passwordMeets.value.number) {
          callback(new Error('Password must contain at least one number'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 处理注册逻辑
      setTimeout(() => {
        loading.value = false
      }, 2000)
    }
  })
}

const togglePasswordVisibility = () => {
  const input = document.querySelector('input[type="password"]') as HTMLInputElement
  input.type = input.type === 'password' ? 'text' : 'password'
}
</script>

<style scoped>
/* 复用登录页面的基础样式 */
.register-page {
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  background: linear-gradient(125deg, #2A1163 0%, #3B1D8A 25%, #4A25E1 60%, #6D4AFF 100%);
}

/* 左侧特性列表样式 */
.feature-list {
  margin-top: 3rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(8px);
    background: rgba(255, 255, 255, 0.15);
  }

  .el-icon {
    font-size: 1.5rem;
    color: #FFD700;
    background: rgba(255, 215, 0, 0.2);
    padding: 0.75rem;
    border-radius: 12px;
  }

  .feature-text {
    h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.875rem;
      opacity: 0.9;
      line-height: 1.5;
    }
  }
}

/* 表单样式优化 */
.name-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.password-requirements {
  margin-top: 0.5rem;
  padding: 1rem;
  background: rgba(94, 59, 238, 0.05);
  border-radius: 8px;
}

.requirement {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #666;
    margin-right: 0.5rem;
    transition: all 0.3s ease;
  }

  &.met {
    color: #5E3BEE;
    
    &::before {
      background: #5E3BEE;
      transform: scale(1.2);
    }
  }
}

.terms {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;

  .link {
    color: #5E3BEE;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

/* 继承登录页面的其他样式... */
</style> 