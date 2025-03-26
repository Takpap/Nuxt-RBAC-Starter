<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">权限管理</h1>
      <el-button type="primary" @click="openPermissionDialog()">
        <el-icon class="mr-2"><icon name="i-ep-plus" /></el-icon>
        添加权限
      </el-button>
    </div>
    
    <el-card class="mb-4">
      <div class="mb-4 flex items-center gap-4">
        <el-input
          v-model="searchQuery"
          placeholder="搜索权限"
          class="w-64"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><icon name="i-ep-search" /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="resourceFilter" placeholder="按资源筛选" class="w-40" clearable @change="handleSearch">
          <el-option
            v-for="resource in resources"
            :key="resource"
            :label="resource"
            :value="resource"
          />
        </el-select>
        
        <el-select v-model="actionFilter" placeholder="按动作筛选" class="w-40" clearable @change="handleSearch">
          <el-option
            v-for="action in actions"
            :key="action"
            :label="action"
            :value="action"
          />
        </el-select>
      </div>
      
      <el-table
        v-loading="loading"
        :data="filteredPermissions"
        style="width: 100%"
        border
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="权限名称" />
        <el-table-column prop="resource" label="资源" width="150" />
        <el-table-column prop="action" label="动作" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="openPermissionDialog(row)">
                编辑
              </el-button>
              <el-button 
                v-if="hasPermission('permissions', 'delete')"
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
    
    <!-- 权限表单对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      :title="editingPermission.id ? '编辑权限' : '新建权限'"
      width="500px"
    >
      <el-form
        ref="permissionFormRef"
        :model="permissionForm"
        :rules="permissionFormRules"
        label-width="100px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name" placeholder="请输入权限名称" />
        </el-form-item>
        
        <el-form-item label="资源" prop="resource">
          <el-input v-model="permissionForm.resource" placeholder="请输入资源名称" />
          <small class="text-gray-500 mt-1 block">例如：users, roles</small>
        </el-form-item>
        
        <el-form-item label="动作" prop="action">
          <el-select v-model="permissionForm.action" placeholder="请选择动作" class="w-full">
            <el-option label="create (创建)" value="create" />
            <el-option label="read (读取)" value="read" />
            <el-option label="update (更新)" value="update" />
            <el-option label="delete (删除)" value="delete" />
            <el-option label="manage (管理)" value="manage" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="permissionForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入权限描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormItemRule } from 'element-plus'

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

interface Permission {
  id: number
  name: string
  resource: string
  action: string
  description: string | null
  createdAt?: string
  updatedAt?: string
}

const { hasPermission } = useAuth()

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索和筛选
const searchQuery = ref('')
const resourceFilter = ref('')
const actionFilter = ref('')

// 权限数据
const permissions = ref<Permission[]>([])
const filteredPermissions = computed(() => {
  let result = [...permissions.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(permission => 
      permission.name.toLowerCase().includes(query) || 
      permission.resource.toLowerCase().includes(query) ||
      permission.action.toLowerCase().includes(query) ||
      (permission.description && permission.description.toLowerCase().includes(query))
    )
  }
  
  // 资源过滤
  if (resourceFilter.value) {
    result = result.filter(permission => permission.resource === resourceFilter.value)
  }
  
  // 动作过滤
  if (actionFilter.value) {
    result = result.filter(permission => permission.action === actionFilter.value)
  }
  
  return result
})

// 资源和动作列表（用于筛选）
const resources = computed(() => {
  const resourceSet = new Set(permissions.value.map(p => p.resource))
  return Array.from(resourceSet)
})

const actions = computed(() => {
  const actionSet = new Set(permissions.value.map(p => p.action))
  return Array.from(actionSet)
})

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 权限表单相关
const permissionDialogVisible = ref(false)
const permissionFormRef = ref()
const editingPermission = ref<Partial<Permission>>({})
const permissionForm = reactive({
  id: null as number | null,
  name: '',
  resource: '',
  action: '',
  description: ''
})

// 表单验证规则
const permissionFormRules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, message: '权限名称长度至少为2个字符', trigger: 'blur' }
  ],
  resource: [
    { required: true, message: '请输入资源名称', trigger: 'blur' },
    { min: 2, message: '资源名称长度至少为2个字符', trigger: 'blur' }
  ],
  action: [
    { required: true, message: '请选择动作', trigger: 'change' }
  ]
} as Record<string, FormItemRule[]>

// 获取权限列表
const fetchPermissions = async () => {
  loading.value = true
  try {
    const { data } = await useFetch('/api/permissions', {
      params: {
        page: currentPage.value,
        limit: pageSize.value
      }
    })
    
    if (data.value) {
      permissions.value = data.value as Permission[]
      // 假设分页信息在响应中
      total.value = permissions.value.length
    }
  } catch (err) {
    ElMessage.error('获取权限列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 分页操作
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchPermissions()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchPermissions()
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchPermissions()
}

// 打开权限对话框
const openPermissionDialog = (permission: Permission | null = null) => {
  if (permission) {
    editingPermission.value = permission
    Object.assign(permissionForm, { 
      id: permission.id,
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description || ''
    })
  } else {
    editingPermission.value = {}
    Object.assign(permissionForm, { 
      id: null,
      name: '',
      resource: '',
      action: '',
      description: ''
    })
  }
  permissionDialogVisible.value = true
}

// 保存权限
const savePermission = async () => {
  if (!permissionFormRef.value) return
  
  await permissionFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    submitting.value = true
    try {
      const permissionData = {
        name: permissionForm.name,
        resource: permissionForm.resource,
        action: permissionForm.action,
        description: permissionForm.description || undefined
      }
      
      if (editingPermission.value.id) {
        // 更新权限
        const { error } = await useFetch(`/api/permissions/${editingPermission.value.id}`, {
          method: 'POST',
          body: { ...permissionData, _method: 'PUT' }
        })
        
        if (error.value) {
          throw new Error(error.value.message || '更新权限失败')
        }
        
        ElMessage.success('权限更新成功')
      } else {
        // 创建权限
        const { error } = await useFetch('/api/permissions', {
          method: 'POST',
          body: permissionData
        })
        
        if (error.value) {
          throw new Error(error.value.message || '创建权限失败')
        }
        
        ElMessage.success('权限创建成功')
      }
      
      permissionDialogVisible.value = false
      fetchPermissions()
    } catch (error: any) {
      ElMessage.error(error?.message || '操作失败，请稍后重试')
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}

// 确认删除
const confirmDelete = (permission: Permission) => {
  ElMessageBox.confirm(
    `确定要删除权限 "${permission.name}" 吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const { error } = await useFetch(`/api/permissions/${permission.id}`, {
        method: 'POST',
        body: { _method: 'DELETE' }
      })
      
      if (error.value) {
        throw new Error(error.value.message || '删除权限失败')
      }
      
      ElMessage.success('权限已删除')
      fetchPermissions()
    } catch (error: any) {
      ElMessage.error(error?.message || '删除失败，请稍后重试')
      console.error(error)
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 初始化
onMounted(() => {
  fetchPermissions()
})
</script> 