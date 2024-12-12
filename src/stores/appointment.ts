import { defineStore } from 'pinia'
import type { Appointment, LoadType } from '@/types'
import { appointments, loadTypes, generateTimeSlots } from '@/mock'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [] as Appointment[],
    currentAppointment: null as Appointment | null,
    loadTypes: [] as LoadType[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchAppointments() {
      this.loading = true
      try {
        // 使用模拟数据
        this.appointments = appointments
      } catch (err) {
        this.error = '获取预约列表失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchAppointmentById(id: number) {
      this.loading = true
      try {
        // 使用模拟数据
        const appointment = appointments.find(a => a.id === id)
        if (appointment) {
          this.currentAppointment = appointment
        } else {
          throw new Error('预约不存在')
        }
      } catch (err) {
        this.error = '获取预约详情失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchLoadTypes() {
      this.loading = true
      try {
        // 使用模拟数据
        this.loadTypes = loadTypes
      } catch (err) {
        this.error = '获取装卸类型失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async getTimeSlots(date: string) {
      // 使用模拟数据生成时间段
      return generateTimeSlots(date)
    },

    async cancelAppointment(id: number) {
      this.loading = true
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 更新本地数据
        const index = this.appointments.findIndex(a => a.id === id)
        if (index !== -1) {
          this.appointments[index].status = 'cancelled'
        }
        if (this.currentAppointment?.id === id) {
          this.currentAppointment.status = 'cancelled'
        }
        
        return true
      } catch (err) {
        this.error = '取消预约失败'
        console.error(err)
        return false
      } finally {
        this.loading = false
      }
    }
  }
}) 