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
          <BrandLogo />
          <h2>Join DockFlow Today</h2>
          <p>Start managing your dock appointments efficiently</p>
        </div>
      </div>

      <!-- 右侧注册表单 -->
      <div class="form-section">
        <div class="form-container">
          <h1>Create Account</h1>
          <p class="subtitle">Schedule your dock appointments efficiently</p>

          <el-form ref="formRef" :model="form" :rules="rules" class="register-form">
            <!-- 姓名输入框组 -->
            <div class="name-group">
              <el-form-item prop="firstName">
                <el-input
                  v-model="form.firstName"
                  placeholder="First name"
                  prefix-icon="User"
                />
              </el-form-item>
              
              <el-form-item prop="lastName">
                <el-input
                  v-model="form.lastName"
                  placeholder="Last name"
                  prefix-icon="User"
                />
              </el-form-item>
            </div>

            <!-- 邮箱输入框 -->
            <el-form-item prop="email">
              <el-input
                v-model="form.email"
                placeholder="Email address"
                prefix-icon="Message"
              />
            </el-form-item>

            <!-- 密码输入框 -->
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="Create password"
                prefix-icon="Lock"
                show-password
              >
                <template #suffix>
                  <el-tooltip
                    content="Password must have at least 8 characters, contain upper-case and lower-case letters, at least one number and one special character"
                    placement="top"
                  >
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>

            <!-- 密码要求提示 -->
            <div class="password-requirements">
              <div 
                v-for="(req, index) in passwordRequirements" 
                :key="index"
                :class="['requirement', { met: checkRequirement(req.check) }]"
              >
                <el-icon><Check /></el-icon>
                {{ req.text }}
              </div>
            </div>

            <!-- 注册按钮 -->
            <el-button 
              type="primary" 
              class="submit-btn"
              :loading="loading"
              @click="handleRegister"
            >
              Create Account
            </el-button>

            <!-- 服务条款 -->
            <p class="terms">
              By clicking Register, you agree to our 
              <el-link type="primary">Terms and Conditions</el-link> and 
              <el-link type="primary">Privacy Policy</el-link>
            </p>

            <!-- 登录链接 -->
            <div class="register-hint">
              Already have an account? 
              <router-link to="/auth/login" class="login-link">
                Sign in
              </router-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

// 密码要求列表
const passwordRequirements = [
  { text: 'At least 8 characters', check: (pwd: string) => pwd.length >= 8 },
  { text: 'Contains upper and lower case', check: (pwd: string) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) },
  { text: 'Contains at least one number', check: (pwd: string) => /\d/.test(pwd) },
  { text: 'Contains at least one special character', check: (pwd: string) => /[!@#$%^&*]/.test(pwd) }
]

// 检查密码要求
const checkRequirement = (checkFn: (pwd: string) => boolean) => {
  return checkFn(form.password)
}

// 表单验证规则
const rules = reactive<FormRules>({
  firstName: [
    { required: true, message: 'Please enter your first name', trigger: 'blur' },
    { min: 2, message: 'Length should be at least 2 characters', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Please enter your last name', trigger: 'blur' },
    { min: 2, message: 'Length should be at least 2 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please create a password', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!passwordRequirements.every(req => req.check(value))) {
          callback(new Error('Password does not meet all requirements'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 注册处理
const handleRegister = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // TODO: 调用注册 API
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    ElMessage.success('Registration successful!')
    router.push('/auth/login')
  } catch (error) {
    ElMessage.error('Please check your input and try again')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  background: linear-gradient(125deg, #2A1163 0%, #3B1D8A 25%, #4A25E1 60%, #6D4AFF 100%);
}

.page-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gradient-layer {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(123, 90, 255, 0.15) 0%, transparent 50%);
  mix-blend-mode: overlay;
}

.pattern-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.2;
  transform: perspective(500px) rotateX(30deg);
  transform-origin: top;
}

.glow-effect {
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    rgba(255, 255, 255, 0) 0deg,
    rgba(255, 255, 255, 0.1) 90deg,
    rgba(255, 255, 255, 0) 180deg,
    rgba(255, 255, 255, 0.1) 270deg,
    rgba(255, 255, 255, 0) 360deg
  );
  animation: rotate 20s linear infinite;
}

.register-container {
  display: flex;
  width: 100%;
  max-width: 1400px;
  margin: auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.brand-section {
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.brand-content {
  max-width: 480px;
}

.brand-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  line-height: 1.2;
}

.brand-content p {
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
}

.form-section {
  width: 480px;
  padding: 2rem;
}

.form-container {
  background: rgba(255, 255, 255, 0.98);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.form-container h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 0.75rem;
}

.form-container .subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.register-form :deep(.el-input) {
  --el-input-height: 48px;
  margin-bottom: 1rem;
}

.register-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.register-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(94, 59, 238, 0.3);
}

.register-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(94, 59, 238, 0.2);
}

.name-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.password-requirements {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(94, 59, 238, 0.05);
  border-radius: 12px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  margin-bottom: 8px;
  font-size: 14px;
}

.requirement.met {
  color: #67c23a;
}

.requirement .el-icon {
  font-size: 16px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  margin: 1.5rem 0;
  background: linear-gradient(135deg, #5E3BEE, #7B5AFF);
  border: none;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(94, 59, 238, 0.2);
}

.terms {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.register-hint {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
}

.login-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .brand-section {
    padding: 3rem;
  }
}

@media (max-width: 992px) {
  .register-container {
    flex-direction: column;
  }

  .brand-section {
    padding: 2rem 0;
    text-align: center;
  }

  .brand-content {
    margin: auto;
  }

  .form-section {
    width: 100%;
    max-width: 480px;
    margin: auto;
  }
}

@media (max-width: 576px) {
  .form-container {
    padding: 2rem;
  }
  
  .name-group {
    grid-template-columns: 1fr;
  }
}
</style> 