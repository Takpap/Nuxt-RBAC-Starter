import { defineEventHandler } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  // Fetch all permissions
  const permissions = await prisma.permission.findMany();
  
  // Return permissions
  return permissions;
}); 