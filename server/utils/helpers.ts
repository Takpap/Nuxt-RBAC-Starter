import { H3Event, getRequestIP } from 'h3'

/**
 * 获取客户端IP地址
 */
export function getClientIP(event: H3Event): string | null {
  try {
    return getRequestIP(event, { xForwardedFor: true }) || null
  } catch (error) {
    console.error('获取客户端IP地址失败:', error)
    return null
  }
} 