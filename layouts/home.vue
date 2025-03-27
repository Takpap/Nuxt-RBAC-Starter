<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-10 w-full">
      <div class="container mx-auto flex justify-between items-center py-3 px-6">
        <h1 class="text-xl font-bold text-gray-800 flex items-center">
          <Icon name="i-carbon-security" class="mr-2 text-blue-600" />
          RBAC 管理系统
        </h1>
        <div class="flex items-center space-x-4">
          <div class="hidden md:flex items-center space-x-6">
            <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 flex items-center">
              <Icon name="i-ph-house-duotone" class="mr-1" />
              首页
            </NuxtLink>
            <NuxtLink to="/features" class="text-gray-600 hover:text-blue-600 flex items-center">
              <Icon name="i-ph-star-duotone" class="mr-1" />
              功能特性
            </NuxtLink>
            <NuxtLink to="/docs" class="text-gray-600 hover:text-blue-600 flex items-center">
              <Icon name="i-ph-book-open-duotone" class="mr-1" />
              文档
            </NuxtLink>
          </div>
          <div v-if="isLoggedIn" class="flex items-center space-x-3">
            <el-button type="primary" size="small" @click="navigateTo('/dashboard')">
              <Icon name="i-tabler-dashboard" class="mr-1" />
              控制台
            </el-button>
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
      </div>
    </header>
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <footer class="bg-white border-t py-6">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">关于我们</h3>
            <p class="text-gray-500">RBAC系统是一个基于角色的访问控制系统，提供完善的权限管理和用户认证功能。</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">功能</h3>
            <ul class="space-y-2 text-gray-500">
              <li>
                <NuxtLink to="/features" class="hover:text-blue-600">用户管理</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/features" class="hover:text-blue-600">角色管理</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/features" class="hover:text-blue-600">权限控制</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/features" class="hover:text-blue-600">活动日志</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">资源</h3>
            <ul class="space-y-2 text-gray-500">
              <li>
                <NuxtLink to="/docs" class="hover:text-blue-600">文档</NuxtLink>
              </li>
              <li>
                <a href="https://github.com" target="_blank" class="hover:text-blue-600">GitHub</a>
              </li>
              <li>
                <NuxtLink to="/examples" class="hover:text-blue-600">示例</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">联系我们</h3>
            <ul class="space-y-2 text-gray-500">
              <li class="flex items-center">
                <Icon name="i-ph-envelope-duotone" class="mr-2" />
                <a href="mailto:contact@example.com" class="hover:text-blue-600">contact@example.com</a>
              </li>
              <li class="flex items-center">
                <Icon name="i-ph-globe-duotone" class="mr-2" />
                <a href="https://example.com" target="_blank" class="hover:text-blue-600">example.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t mt-8 pt-6 text-center text-gray-500 text-sm">
          <p class="flex items-center justify-center">
            <Icon name="i-ph-copyright-duotone" class="mr-1" />
            RBAC 管理系统 &copy; {{ new Date().getFullYear() }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn } = useAuth()
</script> 