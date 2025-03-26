import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log('Seeding database...');

  // Create default permissions
  const permissionsData = [
    // User permissions
    { name: 'view-users', description: 'View users', resource: 'users', action: 'read' },
    { name: 'create-user', description: 'Create user', resource: 'users', action: 'create' },
    { name: 'update-user', description: 'Update user', resource: 'users', action: 'update' },
    { name: 'delete-user', description: 'Delete user', resource: 'users', action: 'delete' },
    { name: 'count-user', description: 'Count user', resource: 'users', action: 'count' },
    { name: 'me', description: 'Me', resource: 'users', action: 'me' },
    
    // Role permissions
    { name: 'view-roles', description: 'View roles', resource: 'roles', action: 'read' },
    { name: 'create-role', description: 'Create role', resource: 'roles', action: 'create' },
    { name: 'update-role', description: 'Update role', resource: 'roles', action: 'update' },
    { name: 'delete-role', description: 'Delete role', resource: 'roles', action: 'delete' },
    { name: 'count-role', description: 'Count role', resource: 'roles', action: 'count' },

    // Session permissions
    { name: 'view-sessions', description: 'View sessions', resource: 'sessions', action: 'read' },
    { name: 'create-session', description: 'Create session', resource: 'sessions', action: 'create' },
    { name: 'update-session', description: 'Update session', resource: 'sessions', action: 'update' },
    { name: 'delete-session', description: 'Delete session', resource: 'sessions', action: 'delete' },
    { name: 'count-session', description: 'Count session', resource: 'sessions', action: 'count' },

    // Permission permissions
    { name: 'view-permissions', description: 'View permissions', resource: 'permissions', action: 'read' },
    { name: 'create-permission', description: 'Create permission', resource: 'permissions', action: 'create' },
    { name: 'update-permission', description: 'Update permission', resource: 'permissions', action: 'update' },
    { name: 'delete-permission', description: 'Delete permission', resource: 'permissions', action: 'delete' },
    { name: 'count-permission', description: 'Count permission', resource: 'permissions', action: 'count' },
  ];

  console.log('Creating permissions...');
  const permissions = [];
  
  for (const permData of permissionsData) {
    const permission = await prisma.permission.upsert({
      where: { name: permData.name },
      update: {},
      create: permData,
    });
    permissions.push(permission);
  }

  // Create roles
  console.log('Creating roles...');
  
  // Admin role with all permissions
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      description: 'Administrator with full access',
    },
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  // User role with limited permissions
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {
      description: 'Regular user with limited access',
    },
    create: {
      name: 'user',
      description: 'Regular user with limited access',
    },
  });

  // Assign all permissions to admin
  console.log('Assigning permissions to admin role...');
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign view permissions to user role
  console.log('Assigning permissions to user role...');
  const userPermissions = permissions.filter(p => p.action === 'read');
  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = await hashPassword('admin123');
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: adminPassword,
    },
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Administrator',
      roleId: adminRole.id,
    },
  });

  // Create a regular user
  console.log('Creating regular user...');
  const userPassword = await hashPassword('user123');
  
  await prisma.user.upsert({
    where: { username: 'user' },
    update: {
      password: userPassword,
    },
    create: {
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      roleId: userRole.id,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 