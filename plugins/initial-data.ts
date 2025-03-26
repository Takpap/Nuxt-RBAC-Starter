export default defineNuxtPlugin(async () => {
  // 只在客户端运行
  if (typeof window !== 'undefined') {
    const { checkAuth } = useAuth()
    
    try {
      // 初始化加载用户数据
      await checkAuth()
    } catch (error) {
      console.error('初始化数据加载失败:', error)
    }
  }
}) 