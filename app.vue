<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// 添加全局认证加载状态控制
const isAuthLoading = useState('auth_loading', () => true)

// 在应用初始化时设置为加载中，身份验证检查完成后再设置为false
onMounted(async () => {
  const { checkAuth } = useAuth()
  await checkAuth().finally(() => {
    isAuthLoading.value = false
  })
})
</script>

<style>
/* 全局样式设置 */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 自定义Element Plus主题覆盖 */
:root {
  --el-color-primary: #3b82f6;
  --el-color-success: #10b981;
  --el-color-warning: #f59e0b;
  --el-color-danger: #ef4444;
  --el-color-info: #6b7280;
}

/* 卡片阴影统一 */
.el-card {
  transition: all 0.3s ease;
  border: none;
}

/* 表格样式统一 */
.el-table th {
  background-color: #f9fafb !important;
  font-weight: 600;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

.loading-icon {
  animation: loading-rotate 1s linear infinite;
}
</style>
