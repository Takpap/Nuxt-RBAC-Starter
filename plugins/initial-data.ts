export default defineNuxtPlugin(async () => {
  // 只在客户端运行
  if (typeof window !== 'undefined') {
    const { checkAuth } = useAuth()
    const isAuthLoading = useState('auth_loading', () => true)
    
    try {
      // 初始化加载用户数据
      await checkAuth()
    } catch (error) {
      console.error('初始化数据加载失败:', error)
    } finally {
      // 无论是否成功，都设置加载完成
      isAuthLoading.value = false
    }
  }
}) 