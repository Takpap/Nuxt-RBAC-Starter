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

    // 检查是否有更新菜单的权限
    const hasPermission = user.role.permissions.some(
      p => p.permission.resource === 'menus' && p.permission.action === 'update'
    )

    if (!hasPermission && user.role.name !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权限更新菜单'
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
      where: { id }
    })

    if (!existingMenu) {
      throw createError({
        statusCode: 404,
        message: '菜单不存在'
      })
    }

    // 获取请求体
    const body = await readBody(event)
    const { 
      name, 
      path, 
      component, 
      redirect, 
      icon, 
      sort, 
      parentId,
      hidden,
      alwaysShow,
      roles
    } = body

    // 构建更新数据
    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (path !== undefined) updateData.path = path
    if (component !== undefined) updateData.component = component
    if (redirect !== undefined) updateData.redirect = redirect
    if (icon !== undefined) updateData.icon = icon
    if (sort !== undefined) updateData.sort = sort
    if (hidden !== undefined) updateData.hidden = hidden
    if (alwaysShow !== undefined) updateData.alwaysShow = alwaysShow

    // 处理父菜单关联
    if (parentId !== undefined) {
      // 不能将自己设为自己的父菜单
      if (parentId === id) {
        throw createError({
          statusCode: 400,
          message: '不能将菜单设为自己的父菜单'
        })
      }

      // 如果parentId为null，则断开父菜单关联
      if (parentId === null) {
        updateData.parentId = null
      } else {
        // 验证父菜单是否存在
        const parentMenu = await prisma.menu.findUnique({
          where: { id: parentId }
        })

        if (!parentMenu) {
          throw createError({
            statusCode: 404,
            message: '父菜单不存在'
          })
        }

        updateData.parentId = parentId
      }
    }

    // 更新菜单
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: updateData
    })

    // 处理角色关联
    if (roles !== undefined) {
      // 先删除现有关联
      await prisma.roleMenu.deleteMany({
        where: { menuId: id }
      })

      // 创建新关联
      if (roles.length > 0) {
        const roleMenuData = roles.map((roleId: number) => ({
          roleId,
          menuId: id
        }))

        await prisma.$transaction(
          roleMenuData.map((data: any) => 
            prisma.roleMenu.create({ data })
          )
        )
      }
    }

    // 记录活动日志
    await prisma.activityLog.create({
      data: {
        action: 'update',
        resourceType: 'menu',
        resourceId: String(id),
        description: `更新菜单 "${updatedMenu.name}"`,
        userId: user.id,
        menuId: id,
        ipAddress: getRequestIP(event),
        userAgent: getRequestHeader(event, 'user-agent')
      }
    })

    return updatedMenu
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '更新菜单失败'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 