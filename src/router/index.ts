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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 