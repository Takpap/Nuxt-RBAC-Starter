import { defineEventHandler, createError } from 'h3';
import prisma from '../../utils/prisma';

// 获取权限总数
export default defineEventHandler(async (event) => {
  try {
    const count = await prisma.permission.count();
    return { count };
  } catch (error) {
    console.error('获取权限数量失败:', error);
    throw createError({
      statusCode: 500,
      message: '服务器错误'
    });
  }
}); 