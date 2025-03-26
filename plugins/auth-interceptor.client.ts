// 客户端认证拦截器
export default defineNuxtPlugin(() => {
  const { token } = useAuth()
  
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
    
    // 调用原始fetch
    return originalFetch(input, newInit)
  }
}) 