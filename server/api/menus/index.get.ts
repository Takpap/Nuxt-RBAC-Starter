import prisma from '~/server/utils/prisma'
import { verifyToken } from '~/server/utils/auth'
import { H3Event } from 'h3'


// 递归构建菜单树结构
function buildMenuTree(menus: any[], parentId: number | null = null) {
  const result = []
  
  for (const menu of menus) {
    if (menu.parentId === parentId) {
      const children = buildMenuTree(menus, menu.id)
      if (children.length) {
        menu.children = children
      }
      result.push(menu)
    }
  }
  
  return result.sort((a, b) => a.sort - b.sort)
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { userId, roleId } = event.context.auth;

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

    // 按角色ID获取菜单
    const roleWithMenus = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        menus: {
          include: {
            menu: true
          }
        }
      }
    })
    
    if (!roleWithMenus) {
      throw createError({
        statusCode: 404,
        message: '角色不存在'
      })
    }
    // 提取所有菜单
    const menuList = roleWithMenus.menus.map(rm => rm.menu)
    const menus = buildMenuTree(menuList)

    return { menus }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取菜单失败'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 