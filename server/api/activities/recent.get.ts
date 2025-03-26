import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 5
    
    // 获取最近的活动日志
    const activities = await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        permission: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })
    
    return activities
  } catch (error) {
    console.error('获取最近活动日志失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取最近活动日志失败',
    })
  }
}) 