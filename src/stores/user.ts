import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface UserProfile {
  name: string
  phone: string
  email: string
  company: string
  position: string
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>({
    name: '',
    phone: '',
    email: '',
    company: '',
    position: ''
  })

  // Get user profile
  const fetchUserProfile = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData = {
        name: 'John Doe',
        phone: '13800138000',
        email: 'john.doe@example.com',
        company: 'Example Corp',
        position: 'Manager'
      }
      
      profile.value = mockData
      return mockData
    } catch (error) {
      ElMessage.error('Failed to fetch user profile')
      throw error
    }
  }

  // Update profile
  const updateProfile = async (data: UserProfile) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      profile.value = data
      ElMessage.success('Profile updated successfully')
    } catch (error) {
      ElMessage.error('Failed to update profile')
      throw error
    }
  }

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success('Password changed successfully')
    } catch (error) {
      ElMessage.error('Failed to change password')
      throw error
    }
  }

  // Change phone number
  const changePhone = async (newPhone: string, verificationCode: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      profile.value.phone = newPhone
      ElMessage.success('Phone number changed successfully')
    } catch (error) {
      ElMessage.error('Failed to change phone number')
      throw error
    }
  }

  // Send verification code
  const sendVerificationCode = async (phone: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success('Verification code sent')
    } catch (error) {
      ElMessage.error('Failed to send verification code')
      throw error
    }
  }

  return {
    profile,
    fetchUserProfile,
    updateProfile,
    changePassword,
    changePhone,
    sendVerificationCode
  }
}) 