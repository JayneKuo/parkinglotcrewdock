<template>
  <div class="login-page">
    <!-- 背景效果 -->
    <div class="page-background">
      <div class="gradient-layer"></div>
      <div class="pattern-grid"></div>
      <div class="glow-effect"></div>
    </div>

    <div class="login-container">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <BrandLogo />
          <h2>Dock Appointment Management</h2>
          <p>Schedule your dock appointments efficiently</p>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-section">
        <div class="form-container">
          <h1>Welcome Back</h1>
          <p class="subtitle">Sign in to continue booking</p>

          <el-form ref="formRef" :model="form" :rules="rules" class="login-form">
            <el-form-item prop="email">
              <el-input
                v-model="form.email"
                placeholder="Email"
                prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="Password"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <div class="form-actions">
              <el-checkbox v-model="form.remember">Remember me</el-checkbox>
              <el-button 
                type="text" 
                @click="$router.push('/auth/reset-password')"
                class="forgot-link"
              >
                Forgot password?
              </el-button>
            </div>

            <el-button 
              type="primary" 
              class="submit-btn" 
              :loading="loading"
              @click="handleLogin"
            >
              Sign in
            </el-button>

            <div class="register-hint">
              Don't have an account?
              <router-link to="/auth/register" class="register-link">
                Register here
              </router-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 忘记密码对话框 -->
    <el-dialog
      v-model="forgotPasswordDialog"
      title="Reset Password"
      width="400px"
      center
    >
      <el-form :model="resetForm" :rules="resetRules" ref="resetFormRef">
        <el-form-item prop="email">
          <el-input
            v-model="resetForm.email"
            placeholder="Enter your email"
            prefix-icon="Message"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="forgotPasswordDialog = false">Cancel</el-button>
          <el-button 
            type="primary" 
            @click="handleResetPassword"
            :loading="resetLoading"
          >
            Send Reset Link
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const resetFormRef = ref<FormInstance>()
const loading = ref(false)
const resetLoading = ref(false)
const forgotPasswordDialog = ref(false)

// 登录表单数据
const form = reactive({
  email: 'test@example.com',
  password: '123456',
  remember: true
})

// 重置密码表单数据
const resetForm = reactive({
  email: ''
})

// 登录表单验证规则
const rules: FormRules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
}

// 重置密码表单验证规则
const resetRules: FormRules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ]
}

// 内置测试账号
const TEST_ACCOUNT = {
  email: 'test@example.com',
  password: '123456'
}

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟API调用，验证测试账号
    if (form.email === TEST_ACCOUNT.email && form.password === TEST_ACCOUNT.password) {
      // 存储登录状态
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify({ 
        email: form.email,
        name: 'Test User'
      }))
      
      ElMessage.success('Login successful!')
      
      // 获取重定向路径
      let redirectPath = route.query.redirect as string
      
      if (!redirectPath) {
        // 如果URL中没有redirect参数，则使用localStorage中的路径
        redirectPath = localStorage.getItem('redirectPath') || '/'
      }
      
      // 清除重定向路径
      localStorage.removeItem('redirectPath')
      
      // 如果重定向路径是认证相关页面，则重定向到首页
      const authPaths = ['/auth/login', '/auth/register', '/auth/reset-password']
      if (authPaths.some(path => redirectPath.includes(path))) {
        router.push('/')
      } else {
        console.log('Redirecting to:', redirectPath) // 调试日志
        router.push(redirectPath)
      }
    } else {
      ElMessage.error('Invalid email or password')
    }
  } catch (error) {
    ElMessage.error('Please check your input')
  } finally {
    loading.value = false
  }
}

// 处理忘记密码
const handleForgotPassword = () => {
  forgotPasswordDialog.value = true
  resetForm.email = form.email // 预填充邮箱
}

// 处理重置密码
const handleResetPassword = async () => {
  if (!resetFormRef.value) return
  
  try {
    await resetFormRef.value.validate()
    resetLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('Password reset link has been sent to your email')
    forgotPasswordDialog.value = false
  } catch (error) {
    ElMessage.error('Please check your input')
  } finally {
    resetLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
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

.login-container {
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

.brand-title {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
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

.login-form :deep(.el-input) {
  --el-input-height: 48px;
  margin-bottom: 1rem;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(94, 59, 238, 0.3);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(94, 59, 238, 0.2);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}

.forgot-link {
  color: var(--el-color-primary);
  font-size: 0.875rem;
  padding: 0;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #5E3BEE, #7B5AFF);
  border: none;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(94, 59, 238, 0.2);
}

.register-hint {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
}

.register-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
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
  .login-container {
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
}
</style> 