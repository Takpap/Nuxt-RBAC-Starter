<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow">
      <div class="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 class="text-xl font-bold text-gray-800">RBAC 管理系统</h1>
        <div v-if="isLoggedIn">
          <el-dropdown>
            <span class="el-dropdown-link cursor-pointer flex items-center">
              <el-avatar :size="32" class="mr-2" />
              {{ user?.name || user?.username }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigateTo('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <main class="flex-grow flex">
      <aside v-if="isLoggedIn" class="w-64 bg-gray-50 border-r">
        <el-menu
          class="h-full"
          :default-active="activeMenuItem"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><icon name="i-ep-menu" /></el-icon>
            <span>控制台</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('users', 'read')" index="/users">
            <el-icon><icon name="i-ep-user" /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('roles', 'read')" index="/roles">
            <el-icon><icon name="i-ep-user-filled" /></el-icon>
            <span>角色管理</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('permissions', 'read')" index="/permissions">
            <el-icon><icon name="i-ep-key" /></el-icon>
            <span>权限管理</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <div class="flex-grow p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenuItem = computed(() => route.path)
const { isLoggedIn, user, hasPermission, logout } = useAuth()
</script> 