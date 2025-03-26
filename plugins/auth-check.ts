export default defineNuxtPlugin(async () => {
  // 只在客户端运行
  if (typeof window !== 'undefined') {
    const { checkAuth, token } = useAuth()
    
    // 从localStorage中恢复token
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken && !token.value) {
      token.value = storedToken
      await checkAuth()
    }
  }
}) 