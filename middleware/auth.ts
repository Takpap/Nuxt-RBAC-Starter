export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoggedIn, checkAuth, token } = useAuth()
  
  // 如果已经登录，无需再次检查
  if (isLoggedIn.value) {
    return
  }
  
  // 如果有token但未登录，尝试检查认证
  if (token.value) {
    const isAuthenticated = await checkAuth()
    if (isAuthenticated) {
      return
    }
  }
  
  // 未认证则跳转到登录页
  return navigateTo('/login')
}) 