import type { FormRules } from 'element-plus'

// 密码验证规则
export const passwordValidator = (rule: any, value: string, callback: Function) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  
  if (!value) {
    callback(new Error('Password is required'))
  } else if (value.length < 8) {
    callback(new Error('Password must be at least 8 characters'))
  } else if (!passwordRegex.test(value)) {
    callback(new Error('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'))
  } else {
    callback()
  }
}

// 确认密码验证规则
export const confirmPasswordValidator = (password: string) => {
  return (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('Please confirm your password'))
    } else if (value !== password) {
      callback(new Error('Passwords do not match'))
    } else {
      callback()
    }
  }
}

// 密码表单规则
export const getPasswordRules = (password = ''): FormRules => ({
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { validator: passwordValidator, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    { validator: confirmPasswordValidator(password), trigger: 'blur' }
  ]
}) 