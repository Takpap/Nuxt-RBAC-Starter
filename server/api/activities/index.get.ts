import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 10
    const page = Number(query.page) || 1
    const skip = (page - 1) * limit
    
    // 构建查询条件
    const where: any = {}
    
    // 根据查询参数过滤
    if (query.userId) {
      where.userId = Number(query.userId)
    }
    
    if (query.action) {
      where.action = query.action
    }
    
    if (query.resourceType) {
      where.resourceType = query.resourceType
    }
    
    // 获取总数
    const total = await prisma.activityLog.count({ where })
    
    // 获取活动日志记录
    const activities = await prisma.activityLog.findMany({
      where,
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
            resource: true,
            action: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })
    
    return {
      activities,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('获取活动日志失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取活动日志失败',
    })
  }
}) 