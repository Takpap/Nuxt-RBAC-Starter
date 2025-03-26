import { defineEventHandler } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  // Fetch all roles with their permissions
  const roles = await prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
  
  // Format the response
  return roles.map(role => ({
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions.map(rp => ({
      id: rp.permission.id,
      name: rp.permission.name,
      resource: rp.permission.resource,
      action: rp.permission.action,
    })),
  }));
}); 