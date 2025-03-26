<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <el-button type="primary" @click="openUserDialog()">
        <el-icon class="mr-2"><icon name="i-ep-plus" /></el-icon>
        添加用户
      </el-button>
    </div>
    
    <el-card class="mb-4">
      <div class="mb-4 flex items-center gap-4">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名或邮箱"
          class="w-64"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><icon name="i-ep-search" /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="roleFilter" placeholder="按角色筛选" class="w-40" clearable @change="handleSearch">
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
        
        <el-select v-model="statusFilter" placeholder="状态" class="w-32" clearable @change="handleSearch">
          <el-option label="活跃" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </div>
      
      <el-table
        v-loading="loading"
        :data="filteredUsers"
        style="width: 100%"
        border
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="role.name" label="角色" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="openUserDialog(row)">
                编辑
              </el-button>
              <el-button 
                :type="row.isActive ? 'danger' : 'success'" 
                size="small"
                @click="toggleUserStatus(row)"
              >
                {{ row.isActive ? '禁用' : '启用' }}
              </el-button>
              <el-button 
                v-if="hasPermission('users', 'delete')"
                type="danger" 
                size="small"
                @click="confirmDelete(row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="mt-4 flex justify-center">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="editingUser.id ? '编辑用户' : '新建用户'"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="userForm.roleId" placeholder="请选择角色" class="w-full">
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item v-if="!editingUser.id" label="密码" prop="password">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item v-if="!editingUser.id" label="确认密码" prop="confirmPassword">
          <el-input
            v-model="userForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-switch
            v-model="userForm.isActive"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormItemRule } from 'element-plus'

definePageMeta({
  middleware: ['auth'],
})

interface User {
  id: number
  username: string
  email: string
  name?: string | null
  roleId: number
  isActive: boolean
  createdAt: string
  role?: {
    id: number
    name: string
  }
}

interface Role {
  id: number
  name: string
  description?: string
}

const { hasPermission } = useAuth()

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索和筛选
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

// 用户数据
const users = ref<User[]>([])
const filteredUsers = computed(() => {
  let result = [...users.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) ||
      (user.name && user.name.toLowerCase().includes(query))
    )
  }
  
  // 角色过滤
  if (roleFilter.value) {
    result = result.filter(user => user.roleId === roleFilter.value)
  }
  
  // 状态过滤
  if (statusFilter.value !== '') {
    result = result.filter(user => user.isActive === statusFilter.value)
  }
  
  return result
})

// 角色列表
const roles = ref<Role[]>([])

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 用户表单相关
const userDialogVisible = ref(false)
const userFormRef = ref()
const editingUser = ref<Partial<User>>({})
const userForm = reactive({
  id: null as number | null,
  username: '',
  email: '',
  name: '',
  roleId: null as number | null,
  password: '',
  confirmPassword: '',
  isActive: true
})

// 表单验证规则
const validatePass = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== userForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度至少为3个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
} as Record<string, FormItemRule[]>

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const { data } = await useFetch('/api/users', {
      params: {
        page: currentPage.value,
        limit: pageSize.value
      }
    })
    if (data.value && 'users' in data.value) {
      users.value = data.value.users as User[]
      total.value = data.value.pagination?.total || 0
    }
  } catch (err) {
    ElMessage.error('获取用户列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const fetchRoles = async () => {
  try {
    const { data } = await useFetch('/api/roles')
    if (data.value) {
      roles.value = data.value as Role[]
    }
  } catch (err) {
    ElMessage.error('获取角色列表失败')
    console.error(err)
  }
}

// 分页操作
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchUsers()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchUsers()
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

// 打开用户对话框
const openUserDialog = (user: User | null = null) => {
  if (user) {
    editingUser.value = user
    Object.assign(userForm, { 
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name || '',
      roleId: user.roleId,
      isActive: user.isActive,
      password: '',
      confirmPassword: ''
    })
  } else {
    editingUser.value = {}
    Object.assign(userForm, { 
      id: null,
      username: '',
      email: '',
      name: '',
      roleId: null,
      password: '',
      confirmPassword: '',
      isActive: true
    })
  }
  userDialogVisible.value = true
}

// 保存用户
const saveUser = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    submitting.value = true
    try {
      const userData: any = {
        username: userForm.username,
        email: userForm.email,
        name: userForm.name || undefined,
        roleId: userForm.roleId,
        isActive: userForm.isActive
      }
      
      // 新建用户时添加密码
      if (!editingUser.value.id) {
        userData.password = userForm.password
      }
      
      if (editingUser.value.id) {
        // 更新用户
        await useFetch(`/api/users/${editingUser.value.id}`, {
          method: 'PUT',
          body: userData
        })
        ElMessage.success('用户更新成功')
      } else {
        // 创建用户
        await useFetch('/api/users', {
          method: 'POST',
          body: userData
        })
        ElMessage.success('用户创建成功')
      }
      
      userDialogVisible.value = false
      fetchUsers()
    } catch (error) {
      ElMessage.error('操作失败，请稍后重试')
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}

// 切换用户状态
const toggleUserStatus = async (user: User) => {
  try {
    await useFetch(`/api/users/${user.id}/status`, {
      method: 'PATCH',
      body: {
        isActive: !user.isActive
      }
    })
    ElMessage.success(`用户已${user.isActive ? '禁用' : '启用'}`)
    fetchUsers()
  } catch (error) {
    ElMessage.error('操作失败，请稍后重试')
    console.error(error)
  }
}

// 确认删除
const confirmDelete = (user: User) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.username}" 吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await useFetch(`/api/users/${user.id}`, {
        method: 'DELETE'
      })
      ElMessage.success('用户已删除')
      fetchUsers()
    } catch (error) {
      ElMessage.error('删除失败，请稍后重试')
      console.error(error)
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 初始化
onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script> 