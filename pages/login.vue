<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <el-card class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold">登录系统</h2>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <div class="flex justify-between items-center mt-4">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <el-link type="primary" href="/forgot-password">忘记密码?</el-link>
        </div>
        
        <el-form-item class="mt-6">
          <el-button
            type="primary"
            native-type="submit"
            class="w-full"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="text-center mt-4">
          <span class="text-gray-600">还没有账号?</span>
          <el-link type="primary" href="/register" class="ml-2">注册</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
  layout: 'default'
})

const { login, checkAuth } = useAuth()
const formRef = ref()
const loading = ref(false)
const rememberMe = ref(false)
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度至少为3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    loading.value = true
    try {
      const success = await login(form.username, form.password)
      if (success) {
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } else {
        ElMessage.error('用户名或密码错误')
      }
    } catch (error) {
      ElMessage.error('登录失败，请稍后重试')
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}

// 如果已经登录，直接跳转到首页
onMounted(async () => {
  const isAuthenticated = await checkAuth()
  if (isAuthenticated) {
    router.push('/dashboard')
  }
})
</script> 