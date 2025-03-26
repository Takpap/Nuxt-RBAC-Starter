import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '~/server/utils/prisma';
import { hashPassword } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Get user data from request body
  const { username, email, password, name, roleId, isActive } = await readBody(event);

  // Validate input
  if (!username || !email || !password || !roleId) {
    throw createError({
      statusCode: 400,
      message: 'Username, email, password, and role are required',
    });
  }
  
  try {
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Username or email already exists',
      });
    }
    
    // Check if the role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });
    
    if (!role) {
      throw createError({
        statusCode: 400,
        message: 'Invalid role ID',
      });
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        roleId,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        role: true,
      },
    });
    
    // Return the created user without the password
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
    };
  } catch (error: any) {
    // If error is already a HTTP error, rethrow it
    if (error.statusCode) {
      throw error;
    }
    
    // Otherwise, throw a generic server error
    console.error('Error creating user:', error);
    
    throw createError({
      statusCode: 500,
      message: 'An error occurred while creating the user',
    });
  }
}); 