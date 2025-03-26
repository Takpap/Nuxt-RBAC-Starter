import { defineEventHandler, createError } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  // Get user ID from the route parameter
  const userId = Number(event.context.params?.id);
  
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
    
    // Don't allow deleting the admin user
    if (existingUser.username === 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Cannot delete the admin user',
      });
    }
    
    // Delete all user sessions
    await prisma.session.deleteMany({
      where: { userId },
    });
    
    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });
    
    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error: any) {
    // If error is already a HTTP error, rethrow it
    if (error.statusCode) {
      throw error;
    }
    
    // Otherwise, throw a generic server error
    console.error('Error deleting user:', error);
    
    throw createError({
      statusCode: 500,
      message: 'An error occurred while deleting the user',
    });
  }
}); 