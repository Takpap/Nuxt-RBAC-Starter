<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <el-card class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold">注册账号</h2>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item class="mt-6">
          <el-button
            type="primary"
            native-type="submit"
            class="w-full"
            :loading="loading"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="text-center mt-4">
          <span class="text-gray-600">已有账号?</span>
          <el-link type="primary" href="/login" class="ml-2">登录</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { FormItemRule } from 'element-plus'

definePageMeta({
  layout: false,
  middleware: ['guest']
})

const { register, login } = useAuth()
const formRef = ref()
const loading = ref(false)
const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  name: '',
  password: '',
  confirmPassword: ''
})

const validatePass = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度至少为3个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
} as Record<string, FormItemRule[]>

const handleRegister = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    loading.value = true
    try {
      const success = await register({
        username: form.username,
        email: form.email,
        password: form.password,
        name: form.name || undefined
      })
      
      if (success) {
        ElMessage.success('注册成功')
        
        // 注册成功后自动登录
        await login(form.username, form.password)
        router.push('/dashboard')
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '注册失败，请稍后重试')
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}
</script> 