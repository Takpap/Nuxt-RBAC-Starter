// 客户端认证拦截器

// 导入错误类型（与API错误处理插件中相同）
interface ApiError {
  statusCode?: number;
  status?: number;
  message?: string;
  [key: string]: any;
}

export default defineNuxtPlugin(() => {
  const { token, clearAuth } = useAuth()
  const router = useRouter()
  const nuxtApp = useNuxtApp()
  
  // 添加全局默认值 - 仅在客户端执行
  const originalFetch = globalThis.fetch
  
  globalThis.fetch = async (input, init) => {
    // 创建一个新的init对象
    const newInit = { ...init }
    
    // 如果有令牌，添加到请求头
    const authToken = token.value || localStorage.getItem('auth_token')
    if (authToken) {
      newInit.headers = new Headers(newInit.headers || {})
      newInit.headers.set('Authorization', `Bearer ${authToken}`)
    }
    
    try {
      // 调用原始fetch
      const response = await originalFetch(input, newInit)
      
      // 检查响应状态码
      if (response.status === 401) {
        // 清除认证信息
        clearAuth()
        
        // 输出警告日志
        console.warn('登录已过期，请重新登录')
        
        // 如果不是登录页面，才跳转到登录页
        const currentRoute = router.currentRoute.value
        if (currentRoute.path !== '/login') {
          router.push({
            path: '/login',
            query: { redirect: currentRoute.fullPath }
          })
        }
      }
      
      // 克隆响应以便可以多次读取
      return response.clone()
    } catch (error) {
      // 处理网络错误等其他错误
      console.error('请求错误:', error)
      
      // 使用全局错误处理（如果可用）
      if (nuxtApp.$handleApiError) {
        nuxtApp.$handleApiError(error as ApiError, '网络请求失败')
      }
      
      throw error
    }
  }
}) 