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

    // 检查是否有创建菜单的权限
    const hasPermission = user.role.permissions.some(
      p => p.permission.resource === 'menus' && p.permission.action === 'create'
    )

    if (!hasPermission && user.role.name !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权限创建菜单'
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
      sort = 0, 
      parentId = null,
      hidden = false,
      alwaysShow = false,
      roles = []
    } = body

    // 验证必要字段
    if (!name) {
      throw createError({
        statusCode: 400,
        message: '菜单名称不能为空'
      })
    }

    // 创建数据
    const menuData: any = {
      name,
      path,
      component,
      redirect,
      icon,
      sort,
      hidden,
      alwaysShow
    }

    // 如果有父菜单ID，添加关联
    if (parentId) {
      const parentMenu = await prisma.menu.findUnique({
        where: { id: parentId }
      })

      if (!parentMenu) {
        throw createError({
          statusCode: 404,
          message: '父菜单不存在'
        })
      }

      menuData.parent = {
        connect: { id: parentId }
      }
    }

    // 创建菜单
    const menu = await prisma.menu.create({
      data: menuData
    })

    // 如果提供了角色，为角色分配菜单
    if (roles.length > 0) {
      const roleMenuData = roles.map((roleId: number) => ({
        roleId,
        menuId: menu.id
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
        action: 'create',
        resourceType: 'menu',
        resourceId: String(menu.id),
        description: `创建菜单 "${menu.name}"`,
        userId: user.id,
        menuId: menu.id,
        ipAddress: getRequestIP(event),
        userAgent: getRequestHeader(event, 'user-agent')
      }
    })

    return menu
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '创建菜单失败'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 