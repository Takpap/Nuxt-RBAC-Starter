<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="w-full flex justify-between items-center py-3 px-6">
        <div class="flex items-center">
          <button 
            class="mr-3 p-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-500 hover:text-blue-500 transition-colors"
            @click="toggleCollapse"
            title="折叠菜单"
          >
            <Icon :name="isCollapse ? 'i-ph-list-duotone' : 'i-ph-sidebar-duotone'" class="text-xl" />
          </button>
          <h1 class="text-xl font-bold text-gray-800 flex items-center">
            <Icon name="i-carbon-security" class="mr-2 text-blue-600" />
            RBAC 管理系统
          </h1>
        </div>
        <div class="flex items-center">
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
    
    <main class="flex-grow flex flex-row h-[calc(100vh-112px)]">
      <aside :class="[isCollapse ? 'w-16' : 'w-64', 'bg-white border-r shadow-sm transition-all duration-300 h-full sticky left-0']">
        <div class="p-4 border-b bg-blue-50 flex justify-between items-center">
          <h2 v-if="!isCollapse" class="text-sm font-semibold text-gray-500 uppercase flex items-center">
            <Icon name="i-ph-list-duotone" class="mr-1" />
            管理菜单
          </h2>
          <div class="cursor-pointer text-gray-500 hover:text-blue-500" @click="toggleCollapse">
            <Icon :name="isCollapse ? 'i-ph-arrows-right-duotone' : 'i-ph-arrows-left-duotone'" class="text-xl" />
          </div>
        </div>
        <el-menu
          class="h-full border-0"
          :default-active="activeMenuItem"
          router
          :collapse="isCollapse"
          :collapse-transition="true"
        >
          <el-menu-item index="/dashboard" class="hover:bg-blue-50">
            <el-icon><Icon name="i-tabler-dashboard" /></el-icon>
            <template #title>控制台</template>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('users', 'read')" index="/users" class="hover:bg-blue-50">
            <el-icon><Icon name="i-ph-users-three-duotone" /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('roles', 'read')" index="/roles" class="hover:bg-blue-50">
            <el-icon><Icon name="i-tabler-id-badge-2" /></el-icon>
            <template #title>角色管理</template>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('permissions', 'read')" index="/permissions" class="hover:bg-blue-50">
            <el-icon><Icon name="i-ph-key-duotone" /></el-icon>
            <template #title>权限管理</template>
          </el-menu-item>
          
          <el-menu-item index="/icons" class="hover:bg-blue-50">
            <el-icon><Icon name="i-ph-palette-duotone" /></el-icon>
            <template #title>图标库</template>
          </el-menu-item>
          
          <el-menu-item index="/activities" class="hover:bg-blue-50">
            <el-icon><Icon name="i-ph-activity-duotone" /></el-icon>
            <template #title>活动日志</template>
          </el-menu-item>

          <el-sub-menu index="settings">
            <template #title>
              <el-icon><Icon name="i-ph-gear-six-duotone" /></el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/settings/profile" class="hover:bg-blue-50">
              <el-icon><Icon name="i-ph-user-gear-duotone" /></el-icon>
              <span>个人设置</span>
            </el-menu-item>
            <el-menu-item index="/settings/system" class="hover:bg-blue-50">
              <el-icon><Icon name="i-ph-sliders-horizontal-duotone" /></el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </aside>
      
      <div class="flex-grow p-6 overflow-y-auto max-h-full">
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
definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const activeMenuItem = computed(() => route.path)
const { user, hasPermission, logout } = useAuth()

// 侧边栏折叠状态
const isCollapse = ref(false)

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 保存折叠状态到 localStorage
watch(isCollapse, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sidebarCollapsed', String(val))
  }
})

// 初始化时从 localStorage 读取折叠状态
onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      isCollapse.value = savedState === 'true'
    }
  }
})
</script>

<style>
.el-menu-item.is-active {
  background-color: rgba(219, 234, 254, 0.5) !important;
  border-left: 3px solid #3b82f6 !important;
  color: #3b82f6 !important;
  font-weight: 500;
}

.el-menu:not(.el-menu--collapse) {
  width: 100%;
}
</style> 