import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import DockDetail from '@/views/warehouses/DockDetail.vue'

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
        beforeEnter: (
          to: RouteLocationNormalized,
          from: RouteLocationNormalized,
          next: NavigationGuardNext
        ) => {
          const isAuthenticated = localStorage.getItem('token')
          if (!isAuthenticated) {
            next('/auth/login')
          } else {
            next()
          }
        },
        component: () => import('@/views/appointments/Index.vue')
      },
      {
        path: 'warehouses/dock/:id',
        name: 'DockDetail',
        component: () => import('../views/warehouses/DockDetail.vue'),
        meta: {
          title: '码头详情'
        }
      },
      {
        path: 'booking',
        component: () => import('@/layouts/BookingLayout.vue'),
        children: [
          {
            path: 'loadtype/:id',
            name: 'BookingLoadType',
            component: () => import('@/views/booking/LoadTypeSelection.vue'),
            meta: {
              title: '选择装卸类型',
              requiresAuth: true
            }
          }
        ]
      },
      {
        path: 'booking/:id',
        name: 'Booking',
        component: () => import('@/views/booking/BookAppointment.vue'),
        meta: {
          title: '预定车位',
          requiresAuth: true
        }
      },
      {
        path: '/booking/edit/:orderNumber',
        name: 'EditBooking',
        component: () => import('../views/booking/EditBooking.vue'),
        meta: {
          requiresAuth: true,
          title: 'Edit Booking'
        }
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
  },
  {
    path: '/appointment/:id',
    name: 'AppointmentDetail',
    component: () => import('../views/booking/AppointmentDetail.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加全局导航守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查用户是否已登录
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      // 存储尝试访问的页面路径
      localStorage.setItem('redirectPath', to.fullPath)
      // 跳转到登录页面
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    // 如果路由不需要认证，直接放行
    next()
  }
})

export default router 