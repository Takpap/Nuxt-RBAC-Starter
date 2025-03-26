import { defineEventHandler, getHeader, createError } from 'h3';
import { revokeSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Get auth token from headers
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    throw createError({
      statusCode: 400,
      message: 'No authentication token provided',
    });
  }
  
  // Revoke the session
  const success = await revokeSession(token);
  
  if (!success) {
    throw createError({
      statusCode: 500,
      message: 'Failed to revoke session',
    });
  }
  
  return {
    success: true,
    message: 'Logged out successfully',
  };
}); 