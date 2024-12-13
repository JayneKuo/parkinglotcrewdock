import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/Index.vue')
      },
      {
        path: 'warehouses',
        name: 'Warehouses',
        component: () => import('@/views/warehouses/Index.vue')
      },
      {
        path: 'appointments',
        name: 'Appointments',
        beforeEnter: (to, from, next) => {
          const isAuthenticated = localStorage.getItem('token')
          if (!isAuthenticated) {
            next('/auth/login')
          } else {
            next()
          }
        },
        component: () => import('@/views/appointments/Index.vue')
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue')
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('@/views/auth/ResetPassword.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加全局导航守卫
router.beforeEach((to, from, next) => {
  // 存储尝试访问的页面路径
  if (to.path !== '/auth/login' && to.path !== '/auth/register') {
    localStorage.setItem('redirectPath', to.fullPath)
  }
  next()
})

export default router 