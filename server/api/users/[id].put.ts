import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '~/server/utils/prisma';
import { hashPassword } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Get user ID from the route parameter
  const userId = Number(event.context.params?.id);
  
  // Get update data from request body
  const { email, name, password, roleId, isActive } = await readBody(event);
  
  // Validate user ID
  if (!userId || isNaN(userId)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID',
    });
  }
  
  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!existingUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      });
    }
    
    // Check if email is already used by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      
      if (emailExists) {
        throw createError({
          statusCode: 409,
          message: 'Email is already in use by another user',
        });
      }
    }
    
    // Check if role exists if provided
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
      });
      
      if (!role) {
        throw createError({
          statusCode: 400,
          message: 'Invalid role ID',
        });
      }
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (email) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (roleId) updateData.roleId = roleId;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Hash password if provided
    if (password) {
      updateData.password = await hashPassword(password);
    }
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        role: true,
      },
    });
    
    // Return the updated user without the password
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      role: {
        id: updatedUser.role.id,
        name: updatedUser.role.name,
      },
    };
  } catch (error: any) {
    // If error is already a HTTP error, rethrow it
    if (error.statusCode) {
      throw error;
    }
    
    // Otherwise, throw a generic server error
    console.error('Error updating user:', error);
    
    throw createError({
      statusCode: 500,
      message: 'An error occurred while updating the user',
    });
  }
}); 