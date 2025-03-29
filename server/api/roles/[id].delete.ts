import { defineEventHandler, createError } from 'h3';
import prisma from '~/server/utils/prisma';
import { verifyToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    // 验证权限
    const token = getRequestHeader(event, 'authorization')?.split(' ')[1];
    if (!token) {
      throw createError({
        statusCode: 401,
        message: '未授权访问'
      });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      throw createError({
        statusCode: 401,
        message: '无效的认证token'
      });
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
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '用户不存在'
      });
    }

    // 检查是否有删除角色的权限
    const hasPermission = user.role.permissions.some(
      p => p.permission.resource === 'roles' && p.permission.action === 'delete'
    );

    if (!hasPermission && user.role.name !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权限删除角色'
      });
    }

    // 获取角色ID
    const roleId = parseInt(event.context.params?.id as string);
    if (isNaN(roleId)) {
      throw createError({
        statusCode: 400,
        message: '无效的角色ID'
      });
    }

    // 查找角色是否存在
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        users: true
      }
    });

    if (!role) {
      throw createError({
        statusCode: 404,
        message: '角色不存在'
      });
    }

    // 检查是否为admin角色
    if (role.name === 'admin') {
      throw createError({
        statusCode: 403,
        message: '不能删除管理员角色'
      });
    }

    // 检查角色是否还有关联用户
    if (role.users.length > 0) {
      throw createError({
        statusCode: 400,
        message: '该角色还有关联用户，无法删除'
      });
    }

    // 开始事务处理
    await prisma.$transaction(async (tx) => {
      // 删除角色的所有权限关联
      await tx.rolePermission.deleteMany({
        where: { roleId }
      });

      // 删除角色的所有菜单关联
      await tx.roleMenu.deleteMany({
        where: { roleId }
      });

      // 删除角色
      await tx.role.delete({
        where: { id: roleId }
      });

      // 记录活动日志
      await tx.activityLog.create({
        data: {
          action: 'delete',
          resourceType: 'role',
          resourceId: String(roleId),
          description: `删除角色 "${role.name}"`,
          userId: user.id,
          ipAddress: getRequestIP(event),
          userAgent: getRequestHeader(event, 'user-agent')
        }
      });
    });

    return { success: true, message: '角色已删除' };
  } catch (error: any) {
    // 如果是已知的HTTP错误，直接抛出
    if (error.statusCode) {
      throw error;
    }

    // 否则抛出通用服务器错误
    console.error('删除角色失败:', error);
    throw createError({
      statusCode: 500,
      message: '服务器错误'
    });
  }
}); 