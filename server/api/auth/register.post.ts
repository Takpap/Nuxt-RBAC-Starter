import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '~/server/utils/prisma';
import { hashPassword, createSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Get registration data from request body
  const { username, email, password, name } = await readBody(event);
  
  // Validate input
  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Username, email and password are required',
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
    
    // Get default user role (usually 'user' role)
    // You should create at least one role for normal users
    const defaultRole = await prisma.role.findFirst({
      where: { name: 'user' },
    });
    
    if (!defaultRole) {
      throw createError({
        statusCode: 500,
        message: 'Default role not found',
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
        roleId: defaultRole.id,
      },
      include: {
        role: true,
      },
    });
    
    // Create a session (log in the user)
    const token = await createSession(user.id, user.roleId);
    
    // Return user info and token
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
      },
      token,
    };
    
  } catch (error: any) {
    // If error is already a HTTP error, rethrow it
    if (error.statusCode) {
      throw error;
    }
    
    // Otherwise, throw a generic server error
    console.error('Registration error:', error);
    
    throw createError({
      statusCode: 500,
      message: 'An error occurred during registration',
    });
  }
}); 