import { defineEventHandler } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const count = await prisma.user.count();
  return { count };
}); 