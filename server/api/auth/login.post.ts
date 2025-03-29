import { defineEventHandler, readBody, createError } from 'h3';
import prisma from '~/server/utils/prisma';
import { comparePasswords, createSession } from '~/server/utils/auth';
import { logActivity } from '~/server/utils/logger';

// Interface for role permission with permission object
interface RolePermissionWithPermission {
  permission: {
    resource: string;
    action: string;
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Get login credentials from request body
    const { username, password } = await readBody(event);
    
    // Validate input
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        message: '用户名和密码不能为空',
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
        message: '用户名或密码错误',
      });
    }
    
    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: '用户名或密码错误',
      });
    }
    
    // Create a new session
    const token = await createSession(user.id, user.roleId);
    
    // Extract permissions for client-side use
    const permissions = user.role.permissions.map((rp: RolePermissionWithPermission) => ({
      resource: rp.permission.resource,
      action: rp.permission.action,
    }));
    
    // Record login activity
    await logActivity({
      event,
      action: 'login',
      resourceType: 'user',
      resourceId: user.id.toString(),
      description: `用户 ${user.username} 登录成功`,
      userId: user.id,
    });
    
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
          permissions,
        },
      },
      token,
    };
  } catch (error) {
    throw error;
  }
}); 