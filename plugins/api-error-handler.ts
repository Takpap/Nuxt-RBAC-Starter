// API错误处理插件
import type { ApiError, ApiErrorResult } from '~/types/api-error'

// 错误消息类型
interface ErrorMessages {
  [key: number]: string;
}

export default defineNuxtPlugin((nuxtApp) => {
  // 全局错误处理器
  nuxtApp.hook('app:error', (error: ApiError) => {
    console.error('应用错误:', error)
    
    // 处理API错误
    if (error?.statusCode === 401) {
      // 未授权错误已在auth-interceptor.client.ts中处理
      console.warn('未授权错误，请重新登录')
    }
  })
  
  // 提供全局错误处理方法
  return {
    provide: {
      handleApiError: (error: ApiError, defaultMessage = '操作失败'): ApiErrorResult => {
        console.error('API错误:', error)
        
        // 根据错误状态码提供不同的错误消息
        const errorMessages: ErrorMessages = {
          400: '请求参数有误',
          401: '未授权，请重新登录',
          403: '无权限执行此操作',
          404: '未找到请求的资源',
          500: '服务器内部错误',
          502: '网关错误',
          503: '服务不可用',
          504: '网关超时'
        }
        
        const statusCode = error?.statusCode || error?.status
        const message = error?.message || (statusCode && errorMessages[statusCode]) || defaultMessage
        
        // 返回格式化的错误信息，便于在组件中使用
        return {
          statusCode,
          message,
          error
        }
      }
    }
  }
}) 