import { defineEventHandler, createError } from 'h3';
import prisma from '../../utils/prisma';

// 获取当前认证用户的信息
export default defineEventHandler(async (event) => {
  // 从事件上下文中获取认证用户ID
  const userId = event.context.auth?.userId;

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: '未认证或会话已过期'
    });
  }

  try {
    // 查询用户信息（包括角色和权限）
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
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '用户不存在'
      });
    }

    // 不返回密码
    const { password, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw createError({
      statusCode: 500,
      message: '服务器错误'
    });
  }
});
