import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  // Get permission data from request body
  const { name, description, resource, action } = await readBody(event);
  
  // Validate input
  if (!name || !resource || !action) {
    throw createError({
      statusCode: 400,
      message: 'Name, resource, and action are required',
    });
  }
  
  try {
    // Check if permission already exists
    const existingPermission = await prisma.permission.findUnique({
      where: { name },
    });
    
    if (existingPermission) {
      throw createError({
        statusCode: 409,
        message: 'Permission with this name already exists',
      });
    }
    
    // Create permission
    const permission = await prisma.permission.create({
      data: {
        name,
        description,
        resource,
        action,
      },
    });
    
    // Return the created permission
    return permission;
  } catch (error: any) {
    // If error is already a HTTP error, rethrow it
    if (error.statusCode) {
      throw error;
    }
    
    // Otherwise, throw a generic server error
    console.error('Error creating permission:', error);
    
    throw createError({
      statusCode: 500,
      message: 'An error occurred while creating the permission',
    });
  }
}); 