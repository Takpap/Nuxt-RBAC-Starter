import prisma from '~/server/utils/prisma'
import { verifyToken } from '~/server/utils/auth'
import { H3Event } from 'h3'


export default defineEventHandler(async (event: H3Event) => {
  try {
    const { userId } = event.context.auth
    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    // 检查是否有删除菜单的权限
    const hasPermission = user.role.permissions.some(
      p => p.permission.resource === 'menus' && p.permission.action === 'delete'
    )

    if (!hasPermission && user.role.name !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权限删除菜单'
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

    // 查找菜单是否存在
    const existingMenu = await prisma.menu.findUnique({
      where: { id },
      include: {
        children: true
      }
    })

    if (!existingMenu) {
      throw createError({
        statusCode: 404,
        message: '菜单不存在'
      })
    }

    // 检查是否有子菜单
    if (existingMenu.children && existingMenu.children.length > 0) {
      throw createError({
        statusCode: 400,
        message: '该菜单有子菜单，无法删除'
      })
    }

    // 记录菜单名称，用于记录日志
    const menuName = existingMenu.name

    // 删除菜单与角色的关联
    await prisma.roleMenu.deleteMany({
      where: { menuId: id }
    })

    // 删除菜单
    await prisma.menu.delete({
      where: { id }
    })

    // 记录活动日志
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        resourceType: 'menu',
        resourceId: String(id),
        description: `删除菜单 "${menuName}"`,
        userId: user.id,
        ipAddress: getRequestIP(event),
        userAgent: getRequestHeader(event, 'user-agent')
      }
    })

    return { success: true, message: '菜单删除成功' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '删除菜单失败'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 