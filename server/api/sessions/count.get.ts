import { defineEventHandler } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  // Only count non-expired sessions
  const count = await prisma.session.count({
    where: {
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  
  return { count };
}); 