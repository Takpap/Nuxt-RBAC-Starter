import { defineEventHandler, createError } from 'h3';
import prisma from '../../utils/prisma';

// 获取角色总数
export default defineEventHandler(async (event) => {
  try {
    const count = await prisma.role.count();
    return { count };
  } catch (error) {
    console.error('获取角色数量失败:', error);
    throw createError({
      statusCode: 500,
      message: '服务器错误'
    });
  }
}); 