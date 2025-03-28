<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10 w-full transition-all duration-300" :class="{ 'py-4': !scrolled, 'py-2 shadow-md': scrolled }">
      <div class="container mx-auto flex justify-between items-center px-6">
        <h1 class="text-xl font-bold text-gray-800 flex items-center">
          <Icon name="i-carbon-security" class="mr-2 text-blue-600 text-2xl" />
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RBAC 管理系统</span>
        </h1>
        
        <!-- 移动端菜单按钮 -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden focus:outline-none">
          <el-icon v-if="!mobileMenuOpen" class="text-2xl"><Icon name="i-ep-menu" /></el-icon>
          <el-icon v-else class="text-2xl"><Icon name="i-ep-close" /></el-icon>
        </button>
        
        <!-- 桌面端导航 -->
        <div class="hidden md:flex items-center">
          <div class="flex items-center space-x-6 mr-6">
            <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 flex items-center transition-colors py-2">
              <Icon name="i-ph-house-duotone" class="mr-1" />
              首页
            </NuxtLink>
            <NuxtLink to="/features" class="text-gray-600 hover:text-blue-600 flex items-center transition-colors py-2">
              <Icon name="i-ph-star-duotone" class="mr-1" />
              功能特性
            </NuxtLink>
            <NuxtLink to="/docs" class="text-gray-600 hover:text-blue-600 flex items-center transition-colors py-2">
              <Icon name="i-ph-book-open-duotone" class="mr-1" />
              文档
            </NuxtLink>
          </div>
          
          <div v-if="isLoggedIn" class="flex items-center space-x-3">
            <el-dropdown trigger="click">
              <div class="flex items-center cursor-pointer">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                  <Icon name="i-ep-user" />
                </div>
                <span class="mr-1">我的账户</span>
                <el-icon><Icon name="i-ep-arrow-down" /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="navigateTo('/dashboard')">
                    <Icon name="i-tabler-dashboard" class="mr-1" />控制台
                  </el-dropdown-item>
                  <el-dropdown-item @click="navigateTo('/settings/profile')">
                    <Icon name="i-ep-user" class="mr-1" />个人资料
                  </el-dropdown-item>
                  <el-dropdown-item @click="logout" divided>
                    <Icon name="i-ep-switch-button" class="mr-1" />退出登录
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
      </div>
      
      <!-- 移动端菜单 -->
      <div 
        v-show="mobileMenuOpen" 
        class="md:hidden bg-white border-t border-gray-100 shadow-lg"
        :class="{ 'animate-slide-in': mobileMenuOpen }"
      >
        <div class="container mx-auto px-6 py-3">
          <div class="space-y-2">
            <NuxtLink to="/" class="block text-gray-600 hover:text-blue-600 py-2 transition-colors" @click="mobileMenuOpen = false">
              <Icon name="i-ph-house-duotone" class="mr-2" />
              首页
            </NuxtLink>
            <NuxtLink to="/features" class="block text-gray-600 hover:text-blue-600 py-2 transition-colors" @click="mobileMenuOpen = false">
              <Icon name="i-ph-star-duotone" class="mr-2" />
              功能特性
            </NuxtLink>
            <NuxtLink to="/docs" class="block text-gray-600 hover:text-blue-600 py-2 transition-colors" @click="mobileMenuOpen = false">
              <Icon name="i-ph-book-open-duotone" class="mr-2" />
              文档
            </NuxtLink>
            
            <div class="border-t border-gray-100 pt-3 mt-3">
              <div v-if="isLoggedIn">
                <div class="flex items-center py-2">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                    <Icon name="i-ep-user" />
                  </div>
                  <span class="text-gray-800">我的账户</span>
                </div>
                <div class="pl-10 space-y-2">
                  <NuxtLink to="/dashboard" class="block text-gray-600 hover:text-blue-600 py-1 transition-colors" @click="mobileMenuOpen = false">
                    <Icon name="i-tabler-dashboard" class="mr-2" />控制台
                  </NuxtLink>
                  <NuxtLink to="/settings/profile" class="block text-gray-600 hover:text-blue-600 py-1 transition-colors" @click="mobileMenuOpen = false">
                    <Icon name="i-ep-user" class="mr-2" />个人资料
                  </NuxtLink>
                  <a @click="logout" class="block text-gray-600 hover:text-blue-600 py-1 transition-colors cursor-pointer">
                    <Icon name="i-ep-switch-button" class="mr-2" />退出登录
                  </a>
                </div>
              </div>
              <div v-else class="flex flex-col space-y-2 pt-2">
                <el-button type="primary" @click="navigateTo('/login'); mobileMenuOpen = false">
                  <Icon name="i-ph-sign-in-duotone" class="mr-1" />
                  登录
                </el-button>
                <el-button type="success" @click="navigateTo('/register'); mobileMenuOpen = false">
                  <Icon name="i-ph-user-plus-duotone" class="mr-1" />
                  注册
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <footer class="bg-white border-t py-12">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between mb-8">
          <div class="flex items-center mb-6 md:mb-0">
            <Icon name="i-carbon-security" class="mr-3 text-blue-600 text-3xl" />
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RBAC 管理系统</span>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors">
              <Icon name="i-mdi-github" class="text-2xl" />
            </a>
            <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors">
              <Icon name="i-mdi-twitter" class="text-2xl" />
            </a>
            <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors">
              <Icon name="i-mdi-linkedin" class="text-2xl" />
            </a>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">关于我们</h3>
            <p class="text-gray-500">RBAC系统是一个基于角色的访问控制系统，提供完善的权限管理和用户认证功能，帮助企业保障数据安全。</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">功能</h3>
            <ul class="space-y-2 text-gray-500">
              <li>
                <NuxtLink to="/features" class="hover:text-blue-600 transition-colors flex items-center">
                  <Icon name="i-ep-user" class="mr-2" />用户管理
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/features" class="hover:text-blue-600 transition-colors flex items-center">
                  <Icon name="i-ep-user-filled" class="mr-2" />角色管理
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/features" class="hover:text-blue-600 transition-colors flex items-center">
                  <Icon name="i-ep-key" class="mr-2" />权限控制
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/features" class="hover:text-blue-600 transition-colors flex items-center">
                  <Icon name="i-ep-data-line" class="mr-2" />活动日志
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">资源</h3>
            <ul class="space-y-2 text-gray-500">
              <li>
                <NuxtLink to="/docs" class="hover:text-blue-600 transition-colors flex items-center">
                  <Icon name="i-ep-document" class="mr-2" />文档
                </NuxtLink>
              </li>
              <li>
                <a href="https://github.com" target="_blank" class="hover:text-blue-600 transition-colors flex items-center">
                  <Icon name="i-mdi-github" class="mr-2" />GitHub
                </a>
              </li>
              <li>
                <NuxtLink to="/examples" class="hover:text-blue-600 transition-colors flex items-center">
                  <Icon name="i-ep-collection" class="mr-2" />示例
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">联系我们</h3>
            <ul class="space-y-2 text-gray-500">
              <li class="flex items-center">
                <Icon name="i-ph-envelope-duotone" class="mr-2" />
                <a href="mailto:contact@example.com" class="hover:text-blue-600 transition-colors">contact@example.com</a>
              </li>
              <li class="flex items-center">
                <Icon name="i-ph-globe-duotone" class="mr-2" />
                <a href="https://example.com" target="_blank" class="hover:text-blue-600 transition-colors">example.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
          <p class="flex items-center justify-center">
            <Icon name="i-ph-copyright-duotone" class="mr-1" />
            RBAC 管理系统 &copy; {{ new Date().getFullYear() }} 版权所有
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn, logout } = useAuth()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

// 监听滚动事件，改变导航栏样式
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  if (window.scrollY > 50) {
    scrolled.value = true
  } else {
    scrolled.value = false
  }
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-in-out forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 