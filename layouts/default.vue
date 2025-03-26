<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center py-3 px-6">
        <h1 class="text-xl font-bold text-gray-800 flex items-center">
          <Icon name="i-carbon-security" class="mr-2 text-blue-600" />
          RBAC 管理系统
        </h1>
        <div v-if="isLoggedIn" class="flex items-center">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link cursor-pointer flex items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 py-1 px-3 rounded-md">
              <el-avatar :size="32" class="mr-2 border-2 border-blue-100" />
              <span class="text-gray-700 mr-1">{{ user?.name || user?.username }}</span>
              <Icon name="i-heroicons-chevron-down" class="text-gray-500" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigateTo('/profile')">
                  <div class="flex items-center text-gray-700">
                    <Icon name="i-ph-user-circle-duotone" class="mr-2" />
                    个人中心
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  <div class="flex items-center text-red-500">
                    <Icon name="i-ph-sign-out-duotone" class="mr-2" />
                    退出登录
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <main class="flex-grow flex">
      <aside v-if="isLoggedIn" class="w-64 bg-white border-r shadow-sm">
        <div class="p-4 border-b bg-blue-50">
          <h2 class="text-sm font-semibold text-gray-500 uppercase flex items-center">
            <Icon name="i-ph-list-duotone" class="mr-1" />
            导航菜单
          </h2>
        </div>
        <el-menu
          class="h-full border-0"
          :default-active="activeMenuItem"
          router
        >
          <el-menu-item index="/dashboard" class="hover:bg-blue-50">
            <Icon name="i-tabler-dashboard" class="mr-1" />
            <span>控制台</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('users', 'read')" index="/users" class="hover:bg-blue-50">
            <Icon name="i-ph-users-three-duotone" class="mr-1" />
            <span>用户管理</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('roles', 'read')" index="/roles" class="hover:bg-blue-50">
            <Icon name="i-tabler-id-badge-2" class="mr-1" />
            <span>角色管理</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('permissions', 'read')" index="/permissions" class="hover:bg-blue-50">
            <Icon name="i-ph-key-duotone" class="mr-1" />
            <span>权限管理</span>
          </el-menu-item>
          
          <el-menu-item index="/icons" class="hover:bg-blue-50">
            <Icon name="i-ph-palette-duotone" class="mr-1" />
            <span>图标库</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <div class="flex-grow p-6 overflow-auto">
        <slot />
      </div>
    </main>
    
    <footer class="bg-white border-t py-3 text-center text-gray-500 text-sm">
      <p class="flex items-center justify-center">
        <Icon name="i-ph-copyright-duotone" class="mr-1" />
        RBAC 管理系统 &copy; {{ new Date().getFullYear() }}
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const activeMenuItem = computed(() => route.path)
const { isLoggedIn, user, hasPermission, logout } = useAuth()
</script>

<style>
.el-menu-item.is-active {
  background-color: rgba(219, 234, 254, 0.5) !important;
  border-left: 3px solid #3b82f6 !important;
  color: #3b82f6 !important;
  font-weight: 500;
}
</style> 