<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">角色管理</h1>
      <el-button type="primary" @click="openRoleDialog()">
        <el-icon class="mr-2"><icon name="i-ep-plus" /></el-icon>
        添加角色
      </el-button>
    </div>
    
    <el-card class="mb-4">
      <el-table
        v-loading="loading"
        :data="roles"
        style="width: 100%"
        border
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="权限" width="180">
          <template #default="{ row }">
            <el-popover
              placement="right"
              :width="400"
              trigger="click"
            >
              <template #reference>
                <el-button size="small" type="info">
                  {{ row.permissions ? row.permissions.length : 0 }} 个权限
                </el-button>
              </template>
              
              <el-scrollbar height="300px">
                <el-descriptions border :column="1" size="small">
                  <template v-if="row.permissions && row.permissions.length > 0">
                    <el-descriptions-item 
                      v-for="perm in row.permissions" 
                      :key="perm.id" 
                      :label="perm.name"
                    >
                      {{ perm.resource }}:{{ perm.action }}
                    </el-descriptions-item>
                  </template>
                  <el-empty v-else description="无权限" />
                </el-descriptions>
              </el-scrollbar>
            </el-popover>
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
              <el-button type="primary" size="small" @click="openRoleDialog(row)">
                编辑
              </el-button>
              <el-button 
                type="warning" 
                size="small"
                @click="openPermissionDialog(row)"
              >
                权限
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="openMenuDialog(row)"
              >
                菜单
              </el-button>
              <el-button 
                v-if="row.name !== 'admin' && hasPermission('roles', 'delete')"
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
    </el-card>
    
    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="editingRole.id ? '编辑角色' : '新建角色'"
      width="500px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 权限管理对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      :title="`${editingRole.name || ''} 角色权限管理`"
      width="700px"
    >
      <div v-loading="permissionsLoading">
        <el-alert
          v-if="editingRole.name === 'admin'"
          type="info"
          show-icon
          :closable="false"
          title="管理员角色默认拥有所有权限"
          class="mb-4"
        />
        
        <div class="mb-4 text-right">
          <el-button size="small" type="primary" @click="selectAllPermissions">全选</el-button>
          <el-button size="small" @click="unselectAllPermissions">取消全选</el-button>
        </div>
        
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="selectedPermissions"
          :props="{
            label: 'name',
            children: 'children'
          }"
        />
      </div>
      
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 菜单权限对话框 -->
    <el-dialog
      v-model="menuDialogVisible"
      :title="`${editingRole.name || ''} 角色菜单配置`"
      width="700px"
    >
      <div v-loading="menusLoading">
        <el-alert
          v-if="editingRole.name === 'admin'"
          type="info"
          show-icon
          :closable="false"
          title="管理员角色默认拥有所有菜单权限"
          class="mb-4"
        />
        
        <div class="mb-4 text-right">
          <el-button size="small" type="primary" @click="selectAllMenus">全选</el-button>
          <el-button size="small" @click="unselectAllMenus">取消全选</el-button>
        </div>
        
        <el-tree
          ref="menuTreeRef"
          :data="menuTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="selectedMenus"
          :props="{
            label: 'name',
            children: 'children'
          }"
        >
          <template #default="{ node, data }">
            <div class="flex items-center">
              <Icon v-if="data.icon" :name="data.icon" class="mr-2" />
              <span>{{ node.label }}</span>
              <span v-if="data.path" class="text-gray-500 text-xs ml-2">({{ data.path }})</span>
            </div>
          </template>
        </el-tree>
      </div>
      
      <template #footer>
        <el-button @click="menuDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenus" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormItemRule } from 'element-plus'

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

interface Role {
  id: number
  name: string
  description: string | null
  permissions?: Permission[]
  createdAt?: string
  updatedAt?: string
}

interface Permission {
  id: number
  name: string
  resource: string
  action: string
  description?: string | null
}

const { hasPermission } = useAuth()

// 角色数据
const roles = ref<Role[]>([])
const loading = ref(false)
const submitting = ref(false)

// 角色表单相关
const roleDialogVisible = ref(false)
const roleFormRef = ref()
const editingRole = ref<Partial<Role>>({})
const roleForm = reactive({
  id: null as number | null,
  name: '',
  description: ''
})

// 权限相关
const permissionDialogVisible = ref(false)
const permissionsLoading = ref(false)
const permissionTreeRef = ref()
const permissionTree = ref<any[]>([])
const allPermissions = ref<Permission[]>([])
const selectedPermissions = ref<number[]>([])

// 菜单相关
const menuDialogVisible = ref(false)
const menusLoading = ref(false)
const menuTreeRef = ref()
const menuTree = ref<any[]>([])
const selectedMenus = ref<number[]>([])

// 表单验证规则
const roleFormRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, message: '角色名称长度至少为2个字符', trigger: 'blur' }
  ]
} as Record<string, FormItemRule[]>

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 获取角色列表
const fetchRoles = async () => {
  loading.value = true
  try {
    const { data } = await useFetch('/api/roles', {
      params: {
        include: 'permissions'
      }
    })
    if (data.value) {
      roles.value = data.value as Role[]
    }
  } catch (err) {
    ElMessage.error('获取角色列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 获取所有权限
const fetchPermissions = async () => {
  permissionsLoading.value = true
  try {
    const { data } = await useFetch('/api/permissions')
    if (data.value) {
      allPermissions.value = data.value as Permission[]
    
      // 将权限数据组织成树形结构
      const resourceMap = new Map()
      
      // 按资源分组
      allPermissions.value.forEach(permission => {
        const resource = permission.resource
        if (!resourceMap.has(resource)) {
          resourceMap.set(resource, {
            id: `resource-${resource}`,
            name: `${resource} 资源`,
            children: []
          })
        }
        
        resourceMap.get(resource).children.push({
          id: permission.id,
          name: `${permission.name} (${permission.action})`,
          resource: permission.resource,
          action: permission.action
        })
      })
      
      permissionTree.value = Array.from(resourceMap.values())
    }
  } catch (err) {
    ElMessage.error('获取权限列表失败')
    console.error(err)
  } finally {
    permissionsLoading.value = false
  }
}

// 打开角色对话框
const openRoleDialog = (role: Role | null = null) => {
  if (role) {
    editingRole.value = role
    Object.assign(roleForm, { 
      id: role.id,
      name: role.name,
      description: role.description || ''
    })
  } else {
    editingRole.value = {}
    Object.assign(roleForm, { 
      id: null,
      name: '',
      description: ''
    })
  }
  roleDialogVisible.value = true
}

// 保存角色
const saveRole = async () => {
  if (!roleFormRef.value) return
  
  await roleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    submitting.value = true
    try {
      const roleData = {
        name: roleForm.name,
        description: roleForm.description || undefined
      }
      
      if (editingRole.value.id) {
        // 更新角色
        const { data, error } = await useFetch(`/api/roles/${editingRole.value.id}`, {
          method: 'PUT',
          body: roleData
        })
        
        if (error.value) {
          throw new Error(error.value.message || '更新角色失败')
        }
        
        ElMessage.success('角色更新成功')
      } else {
        // 创建角色
        const { data, error } = await useFetch('/api/roles', {
          method: 'POST',
          body: roleData
        })
        
        if (error.value) {
          throw new Error(error.value.message || '创建角色失败')
        }
        
        ElMessage.success('角色创建成功')
      }
      
      roleDialogVisible.value = false
      fetchRoles()
    } catch (error: any) {
      ElMessage.error(error?.message || '操作失败，请稍后重试')
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}

// 确认删除
const confirmDelete = (role: Role) => {
  ElMessageBox.confirm(
    `确定要删除角色 "${role.name}" 吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const { error } = await useFetch(`/api/roles/${role.id}`, {
        method: 'DELETE'
      })
      
      if (error.value) {
        throw new Error(error.value.message || '删除角色失败')
      }
      
      ElMessage.success('角色已删除')
      fetchRoles()
    } catch (error: any) {
      ElMessage.error(error?.message || '删除失败，请稍后重试')
      console.error(error)
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 打开权限管理对话框
const openPermissionDialog = async (role: Role) => {
  editingRole.value = role
  
  // 初始化选中的权限
  selectedPermissions.value = role.permissions 
    ? role.permissions.map(p => p.id) 
    : []
  
  await fetchPermissions()
  permissionDialogVisible.value = true
}

// 全选权限
const selectAllPermissions = () => {
  if (!permissionTreeRef.value) return
  
  const allPermIds = allPermissions.value.map(p => p.id)
  permissionTreeRef.value.setCheckedKeys(allPermIds)
}

// 取消全选
const unselectAllPermissions = () => {
  if (!permissionTreeRef.value) return
  permissionTreeRef.value.setCheckedKeys([])
}

// 保存权限设置
const savePermissions = async () => {
  if (!permissionTreeRef.value) return
  
  submitting.value = true
  try {
    // 获取选中的权限ID
    const checkedKeys = permissionTreeRef.value.getCheckedKeys()
    const permissionIds = checkedKeys.filter((id: any) => typeof id === 'number')
    
    // 保存到API
    const { error } = await useFetch(`/api/roles/${editingRole.value.id}/permissions`, {
      method: 'PUT',
      body: {
        permissionIds
      }
    })
    
    if (error.value) {
      throw new Error(error.value.message || '保存权限失败')
    }
    
    ElMessage.success('权限设置已保存')
    permissionDialogVisible.value = false
    fetchRoles()
  } catch (error: any) {
    ElMessage.error(error?.message || '保存权限失败，请稍后重试')
    console.error(error)
  } finally {
    submitting.value = false
  }
}

// 获取角色关联的菜单
const fetchRoleMenus = async (roleId: number) => {
  menusLoading.value = true
  try {
    // 获取所有菜单
    const { data: menusData } = await useFetch('/api/menus')
    if (menusData.value && menusData.value.menus) {
      menuTree.value = menusData.value.menus
    }

    // 获取角色关联的菜单ID
    const { data: roleMenusData } = await useFetch(`/api/roles/${roleId}/menus`)
    if (roleMenusData.value && roleMenusData.value.menuIds) {
      selectedMenus.value = roleMenusData.value.menuIds
    }
  } catch (err) {
    ElMessage.error('获取菜单数据失败')
    console.error(err)
  } finally {
    menusLoading.value = false
  }
}

// 打开菜单配置对话框
const openMenuDialog = (role: Role) => {
  editingRole.value = role
  menuDialogVisible.value = true
  fetchRoleMenus(role.id)
}

// 全选菜单
const selectAllMenus = () => {
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedNodes(menuTree.value)
  }
}

// 取消全选菜单
const unselectAllMenus = () => {
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([])
  }
}

// 保存角色菜单配置
const saveMenus = async () => {
  if (!editingRole.value.id) return
  
  submitting.value = true
  try {
    // 获取选中的菜单ID
    const checkedMenus = menuTreeRef.value.getCheckedKeys()
    const halfCheckedMenus = menuTreeRef.value.getHalfCheckedKeys()
    const menuIds = [...checkedMenus, ...halfCheckedMenus]
    
    // 保存角色菜单配置
    const { data, error } = await useFetch(`/api/roles/${editingRole.value.id}/menus`, {
      method: 'POST',
      body: { menuIds }
    })
    
    if (error.value) {
      throw new Error(error.value.message || '保存菜单配置失败')
    }
    
    ElMessage.success('菜单配置已保存')
    menuDialogVisible.value = false
    fetchRoles()
  } catch (err: any) {
    ElMessage.error(err.message || '保存菜单配置失败')
  } finally {
    submitting.value = false
  }
}

// 初始化
onMounted(() => {
  fetchRoles()
})
</script> 