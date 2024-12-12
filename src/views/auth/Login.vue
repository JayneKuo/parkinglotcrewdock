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
          <h2>The industry's leading dock management and scheduling tool</h2>
          <p>Streamline your dock operations with our intuitive platform</p>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-section">
        <div class="form-container">
          <h1>Welcome to OpenDock</h1>
          <p class="subtitle">Sign in here to use our Warehouse portal or Scheduling Portal</p>

          <el-form ref="formRef" :model="form" :rules="rules" class="login-form">
            <el-form-item prop="email">
              <el-input 
                v-model="form.email" 
                placeholder="Email"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input 
                v-model="form.password" 
                type="password" 
                placeholder="Password"
                :prefix-icon="Lock"
                :suffix-icon="View"
                @click:suffix="togglePasswordVisibility"
              />
            </el-form-item>

            <div class="form-actions">
              <el-checkbox v-model="form.remember">Remember me</el-checkbox>
              <router-link to="/auth/forgot-password" class="forgot-link">
                Forgot your password?
              </router-link>
            </div>

            <el-button type="primary" class="submit-btn" @click="handleSubmit">
              Sign in
            </el-button>

            <div class="register-hint">
              Looking to sign up for our Scheduling Portal?
              <router-link to="/auth/register" class="register-link">
                Register here
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
import { Message, Lock, View } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const form = reactive({
  email: '',
  password: '',
  remember: false
})

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

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // 处理登录逻辑
    }
  })
}

const togglePasswordVisibility = () => {
  const input = document.querySelector('input[type="password"]') as HTMLInputElement
  input.type = input.type === 'password' ? 'text' : 'password'
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

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 2rem 0 1rem;
    line-height: 1.2;
  }

  p {
    font-size: 1.125rem;
    opacity: 0.9;
    line-height: 1.6;
  }
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

  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 0.75rem;
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;
  }
}

.login-form {
  :deep(.el-input) {
    --el-input-height: 48px;
    margin-bottom: 1rem;

    .el-input__wrapper {
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
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}

.forgot-link {
  color: #5E3BEE;
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #5E3BEE, #7B5AFF);
  border: none;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(94, 59, 238, 0.2);
  }
}

.register-hint {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
}

.register-link {
  color: #5E3BEE;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

    .brand-content {
      margin: auto;
    }
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