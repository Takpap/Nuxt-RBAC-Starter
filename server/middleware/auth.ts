import { defineEventHandler, createError, getHeader, H3Event } from 'h3';
import { validateSession } from '../utils/auth';
import prisma from '../utils/prisma';

// Type for user with role and permissions
interface AuthUser {
  id: number;
  roleId: number;
  role?: {
    name: string;
    permissions?: {
      permission: {
        resource: string;
        action: string;
      }
    }[];
  };
}

// Type for RolePermission
interface RolePermissionWithPermission {
  permission: {
    resource: string;
    action: string;
  }
}

// Check if user has required permission
async function hasPermission(
  userId: number,
  resource: string,
  action: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });

  if (!user || !user.role || !user.role.permissions) {
    return false;
  }

  return user.role.permissions.some(
    (rp: RolePermissionWithPermission) => rp.permission.resource === resource && rp.permission.action === action
  );
}

// Authentication middleware
export default defineEventHandler(async (event: H3Event) => {
  // Skip auth for some public routes
  const url = event.path || '';

  if (!url.startsWith('/api') || url.includes('_nuxt_icon')) {
    return;
  }
  
  // List of paths that don't require authentication
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
  ];
  
  // Skip auth check for public paths
  if (publicPaths.some(path => url.startsWith(path))) {
    return;
  }

  // Get auth token from headers
  const authHeader = getHeader(event, 'authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    });
  }
  
  // Validate the token
  const session = await validateSession(token);
  
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    });
  }
  
  // Store user ID in event context for route handlers
  event.context.auth = { userId: session.userId, roleId: session.roleId };
  
  // Check for resource-specific permissions if this is an API request
  if (url.startsWith('/api/') && !url.startsWith('/api/auth/')) {
    // Extract resource and action from URL
    // Format: /api/{resource}/{action} or /api/{resource}
    const parts = url.split('/').filter(Boolean);
    
    if (parts.length >= 2) {
      console.log('parts', parts);
      const resource = parts[1].split('?')[0];
      const action = getActionFromMethod(event.method);
      
      // Check if user has permission
      console.log('session',session, 'resource', resource, 'action', action);
      const hasAccess = await hasPermission(session.userId, resource, action);
      
      if (!hasAccess) {
        throw createError({
          statusCode: 403,
          message: 'Access denied: Insufficient permissions',
        });
      }
    }
  }
});

// Helper to convert HTTP method to permission action
function getActionFromMethod(method: string | undefined): string {
  if (!method) return 'read';
  
  switch (method.toUpperCase()) {
    case 'GET': return 'read';
    case 'POST': return 'create';
    case 'PUT': 
    case 'PATCH': return 'update';
    case 'DELETE': return 'delete';
    default: return 'read';
  }
} 