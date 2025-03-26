<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">个人中心</h1>
    
    <el-row :gutter="20">
      <el-col :xs="24" :md="8">
        <el-card class="mb-4">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium">个人信息</h3>
              <el-button type="primary" plain size="small" @click="isEditing = true" v-if="!isEditing">
                编辑资料
              </el-button>
            </div>
          </template>
          
          <div class="flex justify-center mb-6">
            <el-avatar :size="100" class="border-4 border-gray-100">
              {{ userInitials }}
            </el-avatar>
          </div>
          
          <el-form v-if="isEditing" ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username" placeholder="请输入用户名" disabled />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱" disabled />
            </el-form-item>
            
            <el-form-item label="姓名" prop="name">
              <el-input v-model="profileForm.name" placeholder="请输入姓名" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveProfile" :loading="submitting">保存</el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
          
          <el-descriptions v-else direction="vertical" :column="1" border>
            <el-descriptions-item label="用户名">{{ user?.username }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ user?.email }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ user?.name || '未设置' }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ user?.role?.name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatDate(user?.createdAt) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :md="16">
        <el-card class="mb-4">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium">修改密码</h3>
            </div>
          </template>
          
          <el-form 
            ref="passwordFormRef" 
            :model="passwordForm" 
            :rules="passwordRules" 
            label-width="120px"
          >
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input 
                v-model="passwordForm.currentPassword" 
                type="password" 
                placeholder="请输入当前密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input 
                v-model="passwordForm.newPassword" 
                type="password" 
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="changePassword" :loading="changingPassword">
                修改密码
              </el-button>
              <el-button @click="resetPasswordForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium">我的权限</h3>
            </div>
          </template>
          
          <el-empty v-if="!user?.role?.permissions || user.role.permissions.length === 0" description="暂无权限" />
          
          <el-table v-else :data="permissions" style="width: 100%">
            <el-table-column prop="name" label="权限名称" />
            <el-table-column prop="resource" label="资源" width="150" />
            <el-table-column prop="action" label="动作" width="120" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { user, checkAuth } = useAuth()

// 用户头像显示首字母
const userInitials = computed(() => {
  if (!user.value) return '?'
  
  if (user.value.name) {
    return user.value.name.charAt(0).toUpperCase()
  }
  
  return user.value.username.charAt(0).toUpperCase()
})

// 用户的权限列表
const permissions = computed(() => {
  if (!user.value?.role?.permissions) return []
  return user.value.role.permissions.map(p => p.permission)
})

// 个人资料编辑
const isEditing = ref(false)
const submitting = ref(false)
const profileFormRef = ref()
const profileForm = reactive({
  username: '',
  email: '',
  name: ''
})

const profileRules = {
  name: [
    { max: 50, message: '姓名长度不能超过50个字符', trigger: 'blur' }
  ]
}

// 密码修改
const passwordFormRef = ref()
const changingPassword = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证密码一致性
const validatePass = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
}

// 日期格式化
const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

// 初始化个人资料表单
const initProfileForm = () => {
  if (!user.value) return
  
  profileForm.username = user.value.username
  profileForm.email = user.value.email
  profileForm.name = user.value.name || ''
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  initProfileForm()
}

// 保存个人资料
const saveProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    submitting.value = true
    try {
      await useFetch('/api/users/profile', {
        method: 'PUT',
        body: {
          name: profileForm.name
        }
      })
      
      ElMessage.success('个人资料已更新')
      await checkAuth() // 刷新用户信息
      isEditing.value = false
    } catch (error) {
      ElMessage.error('更新失败，请稍后重试')
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}

// 重置密码表单
const resetPasswordForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 修改密码
const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    changingPassword.value = true
    try {
      await useFetch('/api/users/password', {
        method: 'PUT',
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }
      })
      
      ElMessage.success('密码已修改')
      resetPasswordForm()
    } catch (error) {
      ElMessage.error('密码修改失败，请检查当前密码是否正确')
      console.error(error)
    } finally {
      changingPassword.value = false
    }
  })
}

// 初始化
onMounted(() => {
  initProfileForm()
})

// 监听用户信息变化
watch(() => user.value, () => {
  initProfileForm()
}, { deep: true })
</script> 