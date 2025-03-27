
import { verifyToken } from '~/server/utils/auth'
import { H3Event } from 'h3'
import prisma from '~/server/utils/prisma'

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

    // 检查是否有查看角色的权限
    const hasPermission = user.role.permissions.some(
      p => (p.permission.resource === 'roles' && p.permission.action === 'read') ||
           (p.permission.resource === 'menus' && p.permission.action === 'read')
    )

    if (!hasPermission && user.role.name !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权限查看角色菜单'
      })
    }

    // 获取角色ID
    const roleId = parseInt(event.context.params?.id as string)
    if (isNaN(roleId)) {
      throw createError({
        statusCode: 400,
        message: '无效的角色ID'
      })
    }

    // 获取角色信息及其菜单
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        menus: {
          include: {
            menu: true
          }
        }
      }
    })

    if (!role) {
      throw createError({
        statusCode: 404,
        message: '角色不存在'
      })
    }

    // 提取菜单ID
    const menuIds = role.menus.map(rm => rm.menu.id)

    return { 
      role: {
        id: role.id,
        name: role.name,
        description: role.description
      },
      menuIds 
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取角色菜单失败'
    })
  } finally {
    await prisma.$disconnect()
  }
})