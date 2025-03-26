import { ref, computed } from 'vue'

interface User {
  id: number
  username: string
  email: string
  name?: string | null
  roleId?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  role?: {
    id: number
    name: string
    permissions?: {
      permissionId: number
      permission?: {
        resource: string
        action: string
      }
    }[]
  }
}

export default function useAuth() {
  const user = useState<User | null>('user', () => null)
  const token = useState<string | null>('auth_token', () => null)
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const permissions = computed(() => {
    if (!user.value?.role?.permissions) return []
    return user.value.role.permissions.map(p => ({
      resource: p.permission?.resource,
      action: p.permission?.action
    }))
  })

  // 注册全局拦截器，为每个请求添加Authorization头
  const nuxtApp = useNuxtApp()
  nuxtApp.hook('app:created', () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        token.value = storedToken
      }
    }
  })

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: { username, password }
      })
      
      if (error.value) {
        throw new Error(error.value.message || '登录失败')
      }
      
      if (data.value && 'token' in data.value && 'user' in data.value) {
        const authToken = data.value.token as string
        token.value = authToken
        user.value = data.value.user as User
        
        // 保存token到localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', authToken)
        }
        
        return true
      }
      return false
    } catch (err) {
      console.error('登录错误:', err)
      return false
    }
  }

  const register = async (userData: { username: string, email: string, password: string, name?: string }) => {
    try {
      const { data, error } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: userData
      })
      
      if (error.value) {
        throw new Error(error.value.message || '注册失败')
      }
      
      return true
    } catch (err) {
      console.error('注册错误:', err)
      return false
    }
  }

  const logout = async () => {
    try {
      await useFetch('/api/auth/logout', {
        method: 'POST',
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : undefined
      })
      
      // 清除本地token
      token.value = null
      user.value = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
      
      navigateTo('/login')
    } catch (err) {
      console.error('退出登录错误:', err)
    }
  }

  const checkAuth = async () => {
    if (!token.value && typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        token.value = storedToken
      }
    }
    
    if (!token.value) {
      return false
    }
    
    try {
      const { data } = await useFetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      if (data.value && typeof data.value === 'object' && 'id' in data.value) {
        user.value = data.value as User
        return true
      }
      
      // 如果请求失败且不是因为网络原因，清除无效token
      clearAuth()
      return false
    } catch (err) {
      console.error('检查认证失败:', err)
      clearAuth()
      return false
    }
  }

  const hasPermission = (resource: string, action: string) => {
    if (!user.value) return false
    
    // 检查权限
    return permissions.value.some(
      p => p.resource === resource && p.action === action
    )
  }
  
  // 获取包含认证头的对象
  const getAuthHeaders = () => {
    return token.value ? { 
      Authorization: `Bearer ${token.value}` 
    } : undefined
  }
  
  // 清除认证数据
  const clearAuth = () => {
    token.value = null
    user.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    permissions,
    login,
    register,
    logout,
    checkAuth,
    hasPermission,
    getAuthHeaders
  }
} 