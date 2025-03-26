<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto flex justify-between items-center py-3 px-6">
        <h1 class="text-xl font-bold text-gray-800 flex items-center">
          <Icon name="i-carbon-security" class="mr-2 text-blue-600" />
          RBAC 管理系统
        </h1>
        <div v-if="isLoggedIn" class="flex items-center">
          <el-button type="primary" size="small" @click="navigateTo('/dashboard')">
            <Icon name="i-tabler-dashboard" class="mr-1" />
            控制台
          </el-button>
          <el-dropdown trigger="click" class="ml-3">
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
        <div v-else class="flex items-center space-x-3">
          <el-button type="primary" size="small" @click="navigateTo('/login')">
            <Icon name="i-ph-sign-in-duotone" class="mr-1" />
            登录
          </el-button>
          <el-button type="success" size="small" @click="navigateTo('/register')">
            <Icon name="i-ph-user-plus-duotone" class="mr-1" />
            注册
          </el-button>
        </div>
      </div>
    </header>
    
    <div class="flex-grow p-6">
      <slot />
    </div>
    
    <footer class="bg-white border-t py-3 text-center text-gray-500 text-sm">
      <p class="flex items-center justify-center">
        <Icon name="i-ph-copyright-duotone" class="mr-1" />
        RBAC 管理系统 &copy; {{ new Date().getFullYear() }}
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn, user, logout } = useAuth()
</script> 