export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoggedIn, checkAuth } = useAuth()
  const isAuthLoading = useState('auth_loading')
  
  // 如果认证正在加载中，不进行任何重定向
  if (isAuthLoading.value) {
    return
  }
  
  await checkAuth()
  
  if (isLoggedIn.value) {
    return navigateTo('/dashboard')
  }
}) 