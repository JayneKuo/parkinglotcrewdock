import { defineStore } from 'pinia'
import type { Warehouse } from '@/types'
import { warehouses } from '@/mock'

export const useWarehouseStore = defineStore('warehouse', {
  state: () => ({
    warehouses: [] as Warehouse[],
    currentWarehouse: null as Warehouse | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchWarehouses() {
      this.loading = true
      try {
        // 使用模拟数据
        this.warehouses = warehouses
      } catch (err) {
        this.error = '获取仓库列表失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchWarehouseById(id: number) {
      this.loading = true
      try {
        // 使用模拟数据
        const warehouse = warehouses.find(w => w.id === id)
        if (warehouse) {
          this.currentWarehouse = warehouse
        } else {
          throw new Error('仓库不存在')
        }
      } catch (err) {
        this.error = '获取仓库详情失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}) 