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

    // Activity permissions
    { name: 'view-activities', description: 'View activities', resource: 'activities', action: 'read' },
    { name: 'count-activities', description: 'Count activities', resource: 'activities', action: 'count' },
    { name: 'recent-activities', description: 'Recent activities', resource: 'activities', action: 'recent' },

    // System permissions
    { name: 'stats-system', description: 'Stats system', resource: 'system', action: 'read' },
    { name: 'info-system', description: 'Info system', resource: 'system', action: 'read' },
    { name: 'history-system', description: 'History system', resource: 'system', action: 'read' },
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

  // 添加菜单权限
  const menuPermissionsData = [
    { name: 'view-menus', description: '查看菜单', resource: 'menus', action: 'read' },
    { name: 'create-menu', description: '创建菜单', resource: 'menus', action: 'create' },
    { name: 'update-menu', description: '更新菜单', resource: 'menus', action: 'update' },
    { name: 'delete-menu', description: '删除菜单', resource: 'menus', action: 'delete' },
    { name: 'count-menus', description: '统计菜单', resource: 'menus', action: 'count' },
  ];

  console.log('Creating menu permissions...');
  const menuPermissions = [];
  
  for (const permData of menuPermissionsData) {
    const permission = await prisma.permission.upsert({
      where: { name: permData.name },
      update: {},
      create: permData,
    });
    menuPermissions.push(permission);
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

  // 添加活动日志数据
  const now = new Date()
  const activityLogs = [
    {
      action: 'create',
      resourceType: 'user',
      resourceId: '1',
      description: '创建管理员用户 admin',
      userId: 1,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 一周前
    },
    {
      action: 'create',
      resourceType: 'role',
      resourceId: '1',
      description: '创建角色 管理员',
      userId: 1,
      roleId: 1,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 一周前
    },
    {
      action: 'create',
      resourceType: 'user',
      resourceId: '2',
      description: '创建编辑者用户 editor',
      userId: 1,
      targetUserId: 2,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5天前
    },
    {
      action: 'login',
      resourceType: 'user',
      resourceId: '1',
      description: '用户 admin 登录成功',
      userId: 1,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3天前
    },
    {
      action: 'assign_role',
      resourceType: 'user',
      resourceId: '2',
      description: '用户 editor 的角色从 "普通用户" 变更为 "编辑者"',
      userId: 1,
      targetUserId: 2,
      roleId: 2,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2天前
    },
    {
      action: 'create',
      resourceType: 'permission',
      resourceId: '10',
      description: '创建权限 roles.create',
      userId: 1,
      permissionId: 10,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1天前
    },
    {
      action: 'login',
      resourceType: 'user',
      resourceId: '2',
      description: '用户 editor 登录成功',
      userId: 2,
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12小时前
    },
    {
      action: 'update',
      resourceType: 'role',
      resourceId: '2',
      description: '更新角色 编辑者',
      userId: 1,
      roleId: 2,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6小时前
    },
    {
      action: 'logout',
      resourceType: 'user',
      resourceId: '2',
      description: '用户 editor 退出登录',
      userId: 2,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4小时前
    },
    {
      action: 'login',
      resourceType: 'user',
      resourceId: '1',
      description: '用户 admin 登录成功',
      userId: 1,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1小时前
    },
  ]

  for (const log of activityLogs) {
    await prisma.activityLog.create({
      data: log,
    })
  }

  console.log('活动日志数据已创建')

  // 创建默认菜单
  console.log('Creating menus...');
  const menusData = [
    {
      name: '控制台',
      path: '/dashboard',
      component: 'pages/dashboard/index.vue',
      icon: 'i-tabler-dashboard',
      sort: 1
    },
    {
      name: '系统设置',
      path: '/settings',
      icon: 'i-ph-gear-six-duotone',
      sort: 2
    },
    {
      name: '用户管理',
      path: '/users',
      component: 'pages/users/index.vue',
      icon: 'i-ph-users-three-duotone',
      sort: 3,
      parentId: 2
    },
    {
      name: '角色管理',
      path: '/roles',
      component: 'pages/roles/index.vue',
      icon: 'i-tabler-id-badge-2',
      sort: 4,
      parentId: 2
    },
    {
      name: '权限管理',
      path: '/permissions',
      component: 'pages/permissions/index.vue',
      icon: 'i-ph-key-duotone',
      sort: 5,
      parentId: 2
    },
    {
      name: '菜单管理',
      path: '/menus',
      component: 'pages/menus/index.vue',
      icon: 'i-ph-list-bullets-duotone',
      sort: 6,
      parentId: 2
    },
    {
      name: '活动日志',
      path: '/activities',
      component: 'pages/activities/index.vue',
      icon: 'i-ph-activity-duotone',
      sort: 7,
      parentId: 2
    },
    {
      name: '个人设置',
      path: '/settings/profile',
      component: 'pages/settings/profile.vue',
      icon: 'i-ph-user-gear-duotone',
      sort: 8,
      parentId: 2
    },
    {
      name: '图标库',
      path: '/icons',
      component: 'pages/icons/index.vue',
      icon: 'i-ph-palette-duotone',
      sort: 9,
    },
  ];

  // 创建菜单
  const createdMenus = [];
  for (const menuData of menusData) {
    let menu;
    if (menuData.parentId) {
      // 如果有父级菜单，需要等父级菜单创建后再设置
      const parentMenu = createdMenus[menuData.parentId - 1];
      if (parentMenu) {
        menu = await prisma.menu.create({
          data: {
            name: menuData.name,
            path: menuData.path,
            component: menuData.component,
            icon: menuData.icon,
            sort: menuData.sort,
            parent: {
              connect: { id: parentMenu.id }
            }
          }
        });
      }
    } else {
      menu = await prisma.menu.create({
        data: {
          name: menuData.name,
          path: menuData.path,
          component: menuData.component,
          icon: menuData.icon,
          sort: menuData.sort
        }
      });
    }
    
    createdMenus.push(menu);
  }

  // 关联角色和菜单
  console.log('Assigning menus to roles...');
  
  // 管理员角色关联所有菜单
  for (const menu of createdMenus) {
    await prisma.roleMenu.create({
      data: {
        roleId: adminRole.id,
        menuId: menu.id
      }
    });
  }
  
  // 用户角色只关联部分菜单（控制台、个人设置）
  const userMenus = createdMenus.filter(menu => 
    menu.path === '/dashboard' || 
    menu.path === '/settings/profile'
  );
  
  for (const menu of userMenus) {
    await prisma.roleMenu.create({
      data: {
        roleId: userRole.id,
        menuId: menu.id
      }
    });
  }

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