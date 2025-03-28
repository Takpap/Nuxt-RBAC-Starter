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

        <el-menu
          class="border-0"
          :default-active="activeMenuItem"
          router
          :collapse="isCollapse"
          :collapse-transition="true"
        >
          <!-- 动态生成菜单 -->
          <template v-for="item in userMenus" :key="item.path">
            <!-- 有子菜单的情况 -->
            <el-sub-menu v-if="item.children && item.children.length > 0 && !item.hidden" :index="item.path">
              <template #title>
                <el-icon v-if="item.icon"><Icon :name="item.icon" /></el-icon>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.path"
                :index="child.path"
                class="hover:bg-blue-50"
                v-show="!child.hidden"
              >
                <el-icon v-if="child.icon"><Icon :name="child.icon" /></el-icon>
                <template #title>{{ child.name }}</template>
              </el-menu-item>
            </el-sub-menu>
            
            <!-- 没有子菜单的情况 -->
            <el-menu-item
              v-else-if="!item.hidden"
              :index="item.path"
              class="hover:bg-blue-50"
            >
              <el-icon v-if="item.icon"><Icon :name="item.icon" /></el-icon>
              <template #title>{{ item.name }}</template>
            </el-menu-item>
          </template>
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
const { user, logout, getAuthHeaders } = useAuth()

// 用户菜单数据
const userMenus = ref<any[]>([])

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

// 获取用户菜单
const fetchUserMenus = async () => {
  try {
    const { data } = await useFetch('/api/menus', {
      params: {
        role: user.value?.roleId
      },
      headers: getAuthHeaders()
    })
    
    if (data.value && data.value.menus) {
      userMenus.value = data.value.menus
    }
  } catch (error) {
    console.error('获取用户菜单失败:', error)
  }
}

// 初始化时从 localStorage 读取折叠状态
onMounted(async () => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      isCollapse.value = savedState === 'true'
    }
  }

  await nextTick()
  // 获取用户菜单
  await fetchUserMenus()
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