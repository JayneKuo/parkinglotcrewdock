<template>
  <div class="profile-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Profile</h1>
      </div>
    </div>

    <div class="page-content">
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>Basic Information</span>
            <el-button 
              type="primary" 
              link
              @click="startEditing"
              v-if="!isEditing"
            >
              Edit
            </el-button>
          </div>
        </template>

        <el-form 
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          :disabled="!isEditing"
        >
          <!-- Basic Information -->
          <el-form-item label="Name" prop="name">
            <el-input v-model="form.name" placeholder="Enter your name" />
          </el-form-item>

          <el-form-item label="Phone" prop="phone">
            <el-input v-model="form.phone" placeholder="Enter your phone number" />
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" placeholder="Enter your email" />
          </el-form-item>

          <el-form-item label="Company" prop="company">
            <el-input v-model="form.company" placeholder="Enter company name" />
          </el-form-item>

          <el-form-item label="Position" prop="position">
            <el-input v-model="form.position" placeholder="Enter your position" />
          </el-form-item>

          <!-- Buttons in edit mode -->
          <el-form-item v-if="isEditing">
            <el-button @click="cancelEdit">Cancel</el-button>
            <el-button type="primary" @click="saveChanges" :loading="loading">
              Save
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- Security Settings -->
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>Security Settings</span>
          </div>
        </template>

        <div class="security-items">
          <div class="security-item">
            <div class="item-info">
              <div class="item-title">Login Password</div>
              <div class="item-desc">Used to protect your account security</div>
            </div>
            <el-button link type="primary" @click="showChangePasswordDialog">
              Change
            </el-button>
          </div>

          <div class="security-item">
            <div class="item-info">
              <div class="item-title">Phone Verification</div>
              <div class="item-desc">
                Bound phone: {{ maskPhone(form.phone) }}
              </div>
            </div>
            <el-button link type="primary" @click="showChangePhoneDialog">
              Change
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Change Password Dialog -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="Change Password"
      width="500px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="120px"
      >
        <el-form-item label="Current" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            show-password
            placeholder="Enter current password"
          />
        </el-form-item>

        <el-form-item label="New" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="Enter new password"
          />
        </el-form-item>

        <el-form-item label="Confirm" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="Confirm new password"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="changePassword" :loading="passwordLoading">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Change Phone Dialog -->
    <el-dialog
      v-model="phoneDialogVisible"
      title="Change Phone Number"
      width="500px"
    >
      <el-form
        ref="phoneFormRef"
        :model="phoneForm"
        :rules="phoneRules"
        label-width="120px"
      >
        <el-form-item label="Current">
          <div class="current-phone">{{ maskPhone(form.phone) }}</div>
        </el-form-item>

        <el-form-item label="New Phone" prop="newPhone">
          <el-input
            v-model="phoneForm.newPhone"
            placeholder="Enter new phone number"
          />
        </el-form-item>

        <el-form-item label="Code" prop="verificationCode">
          <div class="verification-code">
            <el-input
              v-model="phoneForm.verificationCode"
              placeholder="Enter verification code"
            />
            <el-button 
              type="primary" 
              :disabled="isCountingDown"
              @click="sendVerificationCode"
            >
              {{ countdownText }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="phoneDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="changePhone" :loading="phoneLoading">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
  position: ''
})

// Form validation rules
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please enter your name', trigger: 'blur' },
    { min: 2, max: 20, message: 'Length should be 2 to 20 characters', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter your phone number', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  company: [
    { required: true, message: 'Please enter company name', trigger: 'blur' }
  ],
  position: [
    { required: true, message: 'Please enter your position', trigger: 'blur' }
  ]
})

// Edit state
const isEditing = ref(false)
const loading = ref(false)

// Start editing
const startEditing = () => {
  isEditing.value = true
}

// Cancel editing
const cancelEdit = () => {
  isEditing.value = false
  // Reset form data to original data
  Object.assign(form, userStore.profile)
}

// Save changes
const saveChanges = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    await userStore.updateProfile(form)
    isEditing.value = false
  } catch (error) {
    ElMessage.error('Form validation failed')
  } finally {
    loading.value = false
  }
}

// Password related
const passwordDialogVisible = ref(false)
const passwordLoading = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password validation rules
const passwordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: 'Please enter current password', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: 'Please enter new password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm new password', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// Show change password dialog
const showChangePasswordDialog = () => {
  passwordDialogVisible.value = true
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// Change password
const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true
    await userStore.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    passwordDialogVisible.value = false
  } catch (error) {
    // Error is handled in the store
  } finally {
    passwordLoading.value = false
  }
}

// Phone related
const phoneDialogVisible = ref(false)
const phoneLoading = ref(false)
const phoneFormRef = ref<FormInstance>()
const phoneForm = reactive({
  newPhone: '',
  verificationCode: ''
})

// Phone validation rules
const phoneRules = reactive<FormRules>({
  newPhone: [
    { required: true, message: 'Please enter new phone number', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: 'Please enter verification code', trigger: 'blur' },
    { len: 6, message: 'Code must be 6 digits', trigger: 'blur' }
  ]
})

// Show change phone dialog
const showChangePhoneDialog = () => {
  phoneDialogVisible.value = true
  phoneForm.newPhone = ''
  phoneForm.verificationCode = ''
}

// Change phone
const changePhone = async () => {
  if (!phoneFormRef.value) return
  
  try {
    await phoneFormRef.value.validate()
    phoneLoading.value = true
    await userStore.changePhone(phoneForm.newPhone, phoneForm.verificationCode)
    phoneDialogVisible.value = false
    // Update phone number in form
    form.phone = phoneForm.newPhone
  } catch (error) {
    // Error is handled in the store
  } finally {
    phoneLoading.value = false
  }
}

// Countdown related
const isCountingDown = ref(false)
const countdown = ref(60)
const countdownText = ref('Get Code')

// Send verification code
const sendVerificationCode = async () => {
  if (!phoneForm.newPhone) {
    ElMessage.warning('Please enter new phone number first')
    return
  }
  
  try {
    await userStore.sendVerificationCode(phoneForm.newPhone)
    startCountdown()
  } catch (error) {
    // Error is handled in the store
  }
}

// Start countdown
const startCountdown = () => {
  isCountingDown.value = true
  countdown.value = 60
  countdownText.value = `${countdown.value}s`
  
  const timer = setInterval(() => {
    countdown.value--
    countdownText.value = `${countdown.value}s`
    
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCountingDown.value = false
      countdownText.value = 'Get Code'
    }
  }, 1000)
}

// Phone mask processing
const maskPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// Fetch user information on page load
onMounted(async () => {
  try {
    const userInfo = await userStore.fetchUserProfile()
    Object.assign(form, userInfo)
  } catch (error) {
    // Error is handled in the store
  }
})
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 40px;
}

.page-header {
  background: white;
  padding: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
    }
  }
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  gap: 24px;
}

.profile-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: 16px;
      font-weight: 500;
      color: #1e293b;
    }
  }
}

.security-items {
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #e2e8f0;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:first-child {
      padding-top: 0;
    }

    .item-info {
      .item-title {
        font-size: 14px;
        font-weight: 500;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .item-desc {
        font-size: 13px;
        color: #64748b;
      }
    }
  }
}

.verification-code {
  display: flex;
  gap: 12px;

  .el-input {
    flex: 1;
  }

  .el-button {
    width: 120px;
  }
}

.current-phone {
  height: 32px;
  line-height: 32px;
  color: #64748b;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style> 