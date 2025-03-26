import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '~/server/utils/prisma';
import { comparePasswords, createSession } from '~/server/utils/auth';

// Interface for role permission with permission object
interface RolePermissionWithPermission {
  permission: {
    resource: string;
    action: string;
  }
}

export default defineEventHandler(async (event) => {
  // Get login credentials from request body
  const { username, password } = await readBody(event);
  
  // Validate input
  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: 'Username and password are required',
    });
  }
  
  // Find user by username
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });
  
  // Check if user exists and is active
  if (!user || !user.isActive) {
    throw createError({
      statusCode: 401,
      message: 'Invalid username or password',
    });
  }
  
  // Verify password
  const isPasswordValid = await comparePasswords(password, user.password);
  
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid username or password',
    });
  }
  
  // Create a new session
  const token = await createSession(user.id);
  
  // Extract permissions for client-side use
  const permissions = user.role.permissions.map((rp: RolePermissionWithPermission) => ({
    resource: rp.permission.resource,
    action: rp.permission.action,
  }));
  
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
      permissions,
    },
    token,
  };
}); 