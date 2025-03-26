import { defineEventHandler, getHeader, createError } from 'h3';
import { revokeSession } from '~/server/utils/auth';
import prisma from '~/server/utils/prisma';
import { logActivity } from '~/server/utils/logger';

export default defineEventHandler(async (event) => {
  // Get auth token from headers
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    throw createError({
      statusCode: 400,
      message: 'No authentication token provided',
    });
  }
  
  // Revoke the session
  const success = await revokeSession(token);
  
  if (!success) {
    throw createError({
      statusCode: 500,
      message: 'Failed to revoke session',
    });
  }
  
  // 查找会话
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  
  if (session) {
    // 删除会话
    await prisma.session.delete({
      where: { id: session.id },
    });
    
    // 记录登出活动
    if (session.user) {
      await logActivity({
        event,
        action: 'logout',
        resourceType: 'user',
        resourceId: session.user.id.toString(),
        description: `用户 ${session.user.username} 退出登录`,
        userId: session.user.id,
      });
    }
  }
  
  return {
    success: true,
    message: 'Logged out successfully',
  };
}); 