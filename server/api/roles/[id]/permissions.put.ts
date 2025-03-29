import { defineEventHandler, readBody, createError } from 'h3';
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

    // 检查是否有更新角色的权限
    const hasPermission = user.role.permissions.some(
      p => p.permission.resource === 'roles' && p.permission.action === 'update'
    );

    if (!hasPermission && user.role.name !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权限更新角色权限'
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
      where: { id: roleId }
    });

    if (!role) {
      throw createError({
        statusCode: 404,
        message: '角色不存在'
      });
    }

    // 获取要分配的权限ID列表
    const { permissionIds } = await readBody(event);
    
    if (!Array.isArray(permissionIds)) {
      throw createError({
        statusCode: 400,
        message: '无效的权限ID列表'
      });
    }

    // 验证所有权限ID是否存在
    const permissions = await prisma.permission.findMany({
      where: {
        id: {
          in: permissionIds
        }
      }
    });

    if (permissions.length !== permissionIds.length) {
      throw createError({
        statusCode: 400,
        message: '存在无效的权限ID'
      });
    }

    // 开始事务处理
    await prisma.$transaction(async (tx) => {
      // 删除现有的角色权限关联
      await tx.rolePermission.deleteMany({
        where: { roleId }
      });

      // 创建新的角色权限关联
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map(permissionId => ({
            roleId,
            permissionId
          }))
        });
      }

      // 记录活动日志
      await tx.activityLog.create({
        data: {
          action: 'update',
          resourceType: 'role',
          resourceId: String(roleId),
          description: `更新角色 "${role.name}" 的权限设置`,
          userId: user.id,
          roleId,
          ipAddress: getRequestIP(event),
          userAgent: getRequestHeader(event, 'user-agent')
        }
      });
    });

    // 返回更新后的角色信息
    const updatedRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    return {
      id: updatedRole?.id,
      name: updatedRole?.name,
      description: updatedRole?.description,
      permissions: updatedRole?.permissions.map(rp => ({
        id: rp.permission.id,
        name: rp.permission.name,
        resource: rp.permission.resource,
        action: rp.permission.action
      }))
    };
  } catch (error: any) {
    // 如果是已知的HTTP错误，直接抛出
    if (error.statusCode) {
      throw error;
    }

    // 否则抛出通用服务器错误
    console.error('更新角色权限失败:', error);
    throw createError({
      statusCode: 500,
      message: '服务器错误'
    });
  }
}); 