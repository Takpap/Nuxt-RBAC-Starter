import prisma from '~/server/utils/prisma'
import { verifyToken } from '~/server/utils/auth'
import { H3Event } from 'h3'


export default defineEventHandler(async (event: H3Event) => {
  try {
    // 验证权限
    const token = getRequestHeader(event, 'authorization')?.split(' ')[1]
    if (!token) {
      throw createError({
        statusCode: 401,
        message: '未授权访问'
      })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      throw createError({
        statusCode: 401,
        message: '无效的认证token'
      })
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '用户不存在'
      })
    }

    // 检查是否有查看菜单的权限
    const hasPermission = user.role.permissions.some(
      p => p.permission.resource === 'menus' && p.permission.action === 'read'
    )

    if (!hasPermission && user.role.name !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权限查看菜单'
      })
    }

    // 获取ID
    const id = parseInt(event.context.params?.id as string)
    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: '无效的菜单ID'
      })
    }

    // 获取菜单
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true
      }
    })

    if (!menu) {
      throw createError({
        statusCode: 404,
        message: '菜单不存在'
      })
    }

    return menu
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取菜单失败'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 