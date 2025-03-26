<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">RBAC 管理系统</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        一个基于角色的访问控制系统示例，提供用户、角色和权限的完整管理功能。
      </p>
    </div>
    
    <div class="flex gap-4 mt-6">
      <el-button type="primary" size="large" @click="navigateTo('/login')">
        <el-icon class="mr-2"><icon name="i-ep-key" /></el-icon>
        登录系统
      </el-button>
      <el-button type="info" size="large" @click="navigateTo('/register')">
        <el-icon class="mr-2"><icon name="i-ep-user-filled" /></el-icon>
        注册账号
      </el-button>
    </div>
    
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <el-icon class="text-blue-500 text-2xl mr-3"><icon name="i-ep-user" /></el-icon>
          <h3 class="text-lg font-medium">用户管理</h3>
        </div>
        <p class="text-gray-600">
          创建和管理系统用户，分配角色和权限，控制用户访问权限。
        </p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <el-icon class="text-green-500 text-2xl mr-3"><icon name="i-ep-user-filled" /></el-icon>
          <h3 class="text-lg font-medium">角色管理</h3>
        </div>
        <p class="text-gray-600">
          创建和管理角色，为角色分配不同的权限集，实现细粒度的访问控制。
        </p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <el-icon class="text-purple-500 text-2xl mr-3"><icon name="i-ep-key" /></el-icon>
          <h3 class="text-lg font-medium">权限管理</h3>
        </div>
        <p class="text-gray-600">
          定义和管理系统权限，控制对不同资源的访问和操作权限。
        </p>
      </div>
    </div>
    
    <footer class="mt-16 text-center text-gray-500">
      <p>RBAC 管理系统 &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

// 如果已经登录，直接跳转到仪表盘
onMounted(async () => {
  const { checkAuth } = useAuth()
  const isAuthenticated = await checkAuth()
  if (isAuthenticated) {
    navigateTo('/dashboard')
  }
})
</script> 