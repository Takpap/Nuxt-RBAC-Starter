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

    // 检查是否有更新角色的权限
    const hasPermission = user.role.permissions.some(
      p => (p.permission.resource === 'roles' && p.permission.action === 'update') ||
           (p.permission.resource === 'menus' && p.permission.action === 'update')
    )

    if (!hasPermission && user.role.name !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权限更新角色菜单'
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

    // 查找角色是否存在
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    })

    if (!role) {
      throw createError({
        statusCode: 404,
        message: '角色不存在'
      })
    }

    // 获取要分配的菜单ID列表
    const { menuIds } = await readBody(event)
    
    if (!Array.isArray(menuIds)) {
      throw createError({
        statusCode: 400,
        message: '无效的菜单ID列表'
      })
    }

    // 删除现有的角色菜单关联
    await prisma.roleMenu.deleteMany({
      where: { roleId }
    })

    // 创建新的角色菜单关联
    if (menuIds.length > 0) {
      const roleMenuData = menuIds.map((menuId: number) => ({
        roleId,
        menuId
      }))

      await prisma.$transaction(
        roleMenuData.map((data: any) => 
          prisma.roleMenu.create({ data })
        )
      )
    }

    // 记录活动日志
    await prisma.activityLog.create({
      data: {
        action: 'update',
        resourceType: 'role',
        resourceId: String(roleId),
        description: `更新角色 "${role.name}" 的菜单权限`,
        userId: user.id,
        roleId,
        ipAddress: getRequestIP(event),
        userAgent: getRequestHeader(event, 'user-agent')
      }
    })

    return { success: true, message: '角色菜单权限已更新' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '更新角色菜单权限失败'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 