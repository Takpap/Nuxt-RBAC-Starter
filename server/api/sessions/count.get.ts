import { defineEventHandler, createError } from 'h3';
import prisma from '../../utils/prisma';

// 获取活跃会话总数
export default defineEventHandler(async (event) => {
  try {
    // 只计算未过期的会话
    const count = await prisma.session.count({
      where: {
        expiresAt: {
          gt: new Date() // 过期时间大于当前时间
        }
      }
    });
    return { count };
  } catch (error) {
    console.error('获取会话数量失败:', error);
    throw createError({
      statusCode: 500,
      message: '服务器错误'
    });
  }
}); 