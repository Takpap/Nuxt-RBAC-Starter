import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  // Get role data from request body
  const { name, description, permissionIds } = await readBody(event);
  
  // Validate input
  if (!name) {
    throw createError({
      statusCode: 400,
      message: 'Role name is required',
    });
  }
  
  try {
    // Check if role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });
    
    if (existingRole) {
      throw createError({
        statusCode: 409,
        message: 'Role with this name already exists',
      });
    }
    
    // Create role
    const role = await prisma.role.create({
      data: {
        name,
        description,
      },
    });
    
    // If permission IDs were provided, assign them to the role
    if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
      // Check if all permissions exist
      const permissions = await prisma.permission.findMany({
        where: {
          id: {
            in: permissionIds,
          },
        },
      });
      
      if (permissions.length !== permissionIds.length) {
        throw createError({
          statusCode: 400,
          message: 'One or more permissions do not exist',
        });
      }
      
      // Create role-permission relationships
      const rolePermissions = permissionIds.map(permissionId => ({
        roleId: role.id,
        permissionId,
      }));
      
      await prisma.rolePermission.createMany({
        data: rolePermissions,
      });
    }
    
    // Fetch the created role with permissions
    const createdRole = await prisma.role.findUnique({
      where: { id: role.id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    
    if (!createdRole) {
      throw createError({
        statusCode: 500,
        message: 'Failed to retrieve the created role',
      });
    }
    
    // Format the response
    return {
      id: createdRole.id,
      name: createdRole.name,
      description: createdRole.description,
      permissions: createdRole.permissions.map(rp => ({
        id: rp.permission.id,
        name: rp.permission.name,
        resource: rp.permission.resource,
        action: rp.permission.action,
      })),
    };
  } catch (error: any) {
    // If error is already a HTTP error, rethrow it
    if (error.statusCode) {
      throw error;
    }
    
    // Otherwise, throw a generic server error
    console.error('Error creating role:', error);
    
    throw createError({
      statusCode: 500,
      message: 'An error occurred while creating the role',
    });
  }
}); 