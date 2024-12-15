import { mockDockDetail } from './mock/dockDetail'

export function getDockDetail(id: string) {
  // 在实际环境中，这里会调用真实的API
  // 现在返回模拟数据
  return Promise.resolve({
    data: mockDockDetail
  })
}