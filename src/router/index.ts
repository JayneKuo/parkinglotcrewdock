import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/Index.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/layouts/AuthLayout.vue'),
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
  },
  {
    path: '/warehouses',
    name: 'WarehouseList',
    component: () => import('@/views/warehouse/List.vue')
  },
  {
    path: '/warehouse/:id',
    name: 'WarehouseDetail',
    component: () => import('@/views/warehouse/Detail.vue')
  },
  {
    path: '/booking',
    children: [
      {
        path: 'load-type',
        name: 'LoadType',
        component: () => import('@/views/booking/LoadType.vue')
      },
      {
        path: 'details',
        name: 'BookingDetails',
        component: () => import('@/views/booking/Details.vue')
      }
    ]
  },
  {
    path: '/appointments',
    name: 'AppointmentList',
    component: () => import('@/views/appointment/List.vue')
  },
  {
    path: '/appointment/:id',
    name: 'AppointmentDetail',
    component: () => import('@/views/appointment/Detail.vue')
  },
  {
    path: '/find-dock',
    name: 'FindDock',
    component: () => import('@/views/find-dock/Index.vue'),
    redirect: '/find-dock/list',
    children: [
      {
        path: 'search',
        name: 'DockSearch',
        component: () => import('@/views/find-dock/Search.vue')
      },
      {
        path: 'list',
        name: 'DockList',
        component: () => import('@/views/find-dock/List.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
const publicPages = [
  '/auth/login', 
  '/auth/register', 
  '/',
  '/find-dock',
  '/find-dock/search',
  '/find-dock/list',
  '/warehouse/:id',
  '/warehouses'
]

router.beforeEach((
  to: RouteLocationNormalized, 
  from: RouteLocationNormalized, 
  next: NavigationGuardNext
) => {
  // Simplified navigation guard logic
  if (publicPages.includes(to.path) || 
      to.path.startsWith('/find-dock/') || 
      to.path.startsWith('/warehouse/')) {
    next()
    return
  }
  
  const isAuthenticated = localStorage.getItem('token')
  isAuthenticated ? next() : next('/auth/login')
})

export default router 