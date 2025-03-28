import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const period = String(query.period || 'today')
    
    // 根据时间段计算日期范围
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0))
    }

    // 生成模拟数据 (在实际应用中应从数据库获取)
    // 此处只是示例，应该使用类似如下的查询：
    /*
    const activeUsers = await prisma.user.groupBy({
      by: ['roleId'],
      where: {
        lastLoginAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    })

    // 获取角色名称
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true
      }
    })

    // 合并数据
    const result = roles.map(role => {
      const userCount = activeUsers.find(u => u.roleId === role.id)
      return {
        role: role.name,
        count: userCount ? userCount._count.id : 0
      }
    }).filter(item => item.count > 0)
    */

    // 模拟数据
    let result: Array<{ role: string, count: number }> = []

    if (period === 'today') {
      result = [
        { role: '管理员', count: 3 },
        { role: '普通用户', count: 24 },
        { role: '编辑', count: 8 },
        { role: '访客', count: 15 },
      ]
    } else if (period === 'week') {
      result = [
        { role: '管理员', count: 5 },
        { role: '普通用户', count: 42 },
        { role: '编辑', count: 18 },
        { role: '访客', count: 30 },
      ]
    } else {
      result = [
        { role: '管理员', count: 8 },
        { role: '普通用户', count: 76 },
        { role: '编辑', count: 29 },
        { role: '访客', count: 54 },
      ]
    }

    return {
      period,
      data: result,
      total: result.reduce((sum, item) => sum + item.count, 0),
      timestamp: new Date()
    }
  } catch (error) {
    console.error('获取活跃用户统计失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取活跃用户统计失败'
    })
  }
}) 