import { H3Event } from 'h3'
import prisma from './prisma'
import { getClientIP } from './helpers'

/**
 * 记录系统活动日志
 */
export async function logActivity({
  event,
  action,
  resourceType,
  resourceId = null,
  description,
  userId = null,
  targetUserId = null,
  roleId = null,
  permissionId = null,
}: {
  event?: H3Event
  action: string
  resourceType: string
  resourceId?: string | null
  description: string
  userId?: number | null
  targetUserId?: number | null
  roleId?: number | null
  permissionId?: number | null
}) {
  try {
    // 如果提供了event对象，则从中获取用户ID和IP地址
    const userIdFromEvent = event?.context?.auth?.userId
    const ipAddress = event ? getClientIP(event) : null
    const userAgent = event ? event.headers.get('user-agent') : null
    
    // 优先使用传入的userId，如果没有则使用event中的userId
    const actualUserId = userId || userIdFromEvent || null
    
    // 创建活动日志记录
    const activityLog = await prisma.activityLog.create({
      data: {
        action,
        resourceType,
        resourceId,
        description,
        ipAddress,
        userAgent,
        userId: actualUserId,
        targetUserId,
        roleId,
        permissionId,
      },
    })
    
    return activityLog
  } catch (error) {
    console.error('记录活动日志失败:', error)
    return null
  }
} 