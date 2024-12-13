<template>
  <div class="reset-page">
    <!-- 背景效果 -->
    <div class="page-background">
      <div class="gradient-layer"></div>
      <div class="pattern-grid"></div>
      <div class="glow-effect"></div>
    </div>

    <div class="reset-container">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <BrandLogo />
          <h2>Reset Your Password</h2>
          <p>Follow the steps to reset your password securely</p>
        </div>
      </div>

      <!-- 右侧重置表单 -->
      <div class="form-section">
        <div class="form-container">
          <h1>Password Reset</h1>
          <p class="subtitle">{{ stepDescriptions[currentStep] }}</p>

          <!-- 步骤指示器 -->
          <el-steps :active="currentStep" finish-status="success" class="steps">
            <el-step title="Email" />
            <el-step title="Verify" />
            <el-step title="Reset" />
          </el-steps>

          <!-- 步骤1: 输入邮箱 -->
          <el-form 
            v-if="currentStep === 0" 
            ref="emailFormRef"
            :model="emailForm"
            :rules="emailRules"
            class="reset-form"
          >
            <el-form-item prop="email">
              <el-input
                v-model="emailForm.email"
                placeholder="Enter your email"
                prefix-icon="Message"
              />
            </el-form-item>
            <el-button 
              type="primary" 
              class="submit-btn"
              :loading="loading"
              @click="handleEmailSubmit"
            >
              Send Code
            </el-button>
          </el-form>

          <!-- 步骤2: 验证码验证 -->
          <el-form 
            v-if="currentStep === 1"
            ref="verifyFormRef"
            :model="verifyForm"
            :rules="verifyRules"
            class="reset-form"
          >
            <div class="verification-hint">
              Verification code has been sent to {{ emailForm.email }}
            </div>
            <el-form-item prop="code">
              <div class="verification-code">
                <el-input
                  v-for="(digit, index) in 6"
                  :key="index"
                  v-model="verifyForm.code[index]"
                  maxlength="1"
                  @input="handleCodeInput($event, index)"
                  @keydown.delete="handleCodeDelete($event, index)"
                  ref="codeInputs"
                />
              </div>
            </el-form-item>
            <div class="resend-code">
              <span v-if="countdown > 0">Resend code in {{ countdown }}s</span>
              <el-button 
                v-else 
                type="text"
                @click="resendCode"
              >
                Resend Code
              </el-button>
            </div>
            <el-button 
              type="primary" 
              class="submit-btn"
              :loading="loading"
              @click="handleVerifySubmit"
            >
              Verify Code
            </el-button>
          </el-form>

          <!-- 步骤3: 重置密码 -->
          <el-form 
            v-if="currentStep === 2"
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            class="reset-form"
          >
            <el-form-item prop="password">
              <el-input
                v-model="passwordForm.password"
                type="password"
                placeholder="New Password"
                prefix-icon="Lock"
                show-password
              />
              <div class="password-hint">
                <el-icon><InfoFilled /></el-icon>
                <span>Password must be at least 8 characters with uppercase, lowercase, number and special character</span>
              </div>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <el-button 
              type="primary" 
              class="submit-btn"
              :loading="loading"
              @click="handlePasswordSubmit"
            >
              Reset Password
            </el-button>
          </el-form>

          <div class="back-to-login">
            <router-link to="/auth/login">
              <el-icon><ArrowLeft /></el-icon>
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Message, Lock, InfoFilled } from '@element-plus/icons-vue'
import { getPasswordRules } from '@/utils/validationRules'

const router = useRouter()
const loading = ref(false)
const currentStep = ref(0)
const countdown = ref(0)
let countdownTimer: NodeJS.Timer | null = null

// 步骤描述
const stepDescriptions = {
  0: 'Enter your email to receive verification code',
  1: 'Enter the verification code sent to your email',
  2: 'Create your new password'
}

// 邮箱表单
const emailFormRef = ref<FormInstance>()
const emailForm = reactive({
  email: 'test@example.com'
})
const emailRules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ]
}

// 验证码表单
const verifyFormRef = ref<FormInstance>()
const verifyForm = reactive({
  code: ['', '', '', '', '', '']
})
const verifyRules = {
  code: [
    { 
      validator: (rule: any, value: string[], callback: Function) => {
        if (value.join('').length !== 6) {
          callback(new Error('Please enter complete verification code'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 密码表单
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})
const passwordRules = computed(() => getPasswordRules(passwordForm.password))

// 验证码输入框引用
const codeInputs = ref<any[]>([])

// 处理验证码输入
const handleCodeInput = (value: string, index: number) => {
  if (emailForm.email === 'test@example.com' && index === 0) {
    const testCode = '123456'
    testCode.split('').forEach((digit, i) => {
      verifyForm.code[i] = digit
    })
    setTimeout(() => {
      handleVerifySubmit()
    }, 300)
    return
  }
  
  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
}

// 处理验证码删除
const handleCodeDelete = (e: KeyboardEvent, index: number) => {
  if (!verifyForm.code[index] && index > 0) {
    verifyForm.code[index - 1] = ''
    codeInputs.value[index - 1]?.focus()
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (countdownTimer) {
        clearInterval(countdownTimer)
      }
    }
  }, 1000)
}

// 重发验证码
const resendCode = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Verification code has been resent')
    startCountdown()
  } finally {
    loading.value = false
  }
}

// 处理邮箱提交
const handleEmailSubmit = async () => {
  if (!emailFormRef.value) return
  
  try {
    await emailFormRef.value.validate()
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 内置测试邮箱
    if (emailForm.email === 'test@example.com') {
      ElMessage.success('Verification code has been sent')
      startCountdown()
      currentStep.value = 1
      setTimeout(() => {
        verifyForm.code[0] = '1'
      }, 300)
    } else {
      ElMessage.error('Email not found')
    }
  } finally {
    loading.value = false
  }
}

// 处理验证码提交
const handleVerifySubmit = async () => {
  if (!verifyFormRef.value) return
  
  try {
    await verifyFormRef.value.validate()
    loading.value = true
    
    // 模拟API调用，验证码为123456
    const submittedCode = verifyForm.code.join('')
    if (submittedCode === '123456') {
      ElMessage.success('Code verified successfully')
      currentStep.value = 2
    } else {
      ElMessage.error('Invalid verification code')
    }
  } finally {
    loading.value = false
  }
}

// 处理密码重置
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 清除登录状态,要求重新登录
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    ElMessage.success('Password reset successfully. Please login with your new password.')
    router.push('/auth/login')
  } catch (error) {
    ElMessage.error('Please check your input')
  } finally {
    loading.value = false
  }
}

// 组件销毁前清理定时器
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped lang="scss">
.reset-page {
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

.reset-container {
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

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.steps {
  margin-bottom: 2rem;
}

.reset-form :deep(.el-input) {
  --el-input-height: 48px;
  margin-bottom: 1rem;
}

.verification-code {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin: 1rem 0;

  :deep(.el-input) {
    margin: 0;
  }

  :deep(.el-input__wrapper) {
    padding: 0;
  }

  :deep(.el-input__inner) {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
    padding: 0;
  }
}

.verification-hint {
  text-align: center;
  color: #666;
  margin-bottom: 1rem;
}

.resend-code {
  text-align: center;
  margin: 1rem 0;
  color: #666;

  .el-button {
    padding: 0;
    font-weight: 500;
  }
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  margin: 1rem 0;
  background: linear-gradient(135deg, #5E3BEE, #7B5AFF);
  border: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(94, 59, 238, 0.2);
  }
}

.back-to-login {
  text-align: center;
  margin-top: 1.5rem;

  a {
    color: #666;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      color: var(--el-color-primary);
    }
  }
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
  .reset-container {
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

.reset-form {
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
}
</style> 