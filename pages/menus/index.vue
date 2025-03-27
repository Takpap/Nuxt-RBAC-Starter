<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">菜单管理</h1>
      <el-button type="primary" @click="openMenuDialog()">
        <div class="flex items-center">
          <Icon name="i-ph-plus-duotone" class="mr-1" />
          新增菜单
        </div>
      </el-button>
    </div>

    <!-- 菜单列表卡片 -->
    <el-card shadow="hover" class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-700 flex items-center">
            <Icon name="i-ph-list-bullets-duotone" class="mr-2 text-blue-500" />
            系统菜单列表
          </h2>
          <div class="flex space-x-2">
            <el-button type="success" plain @click="loadMenus">
              <Icon name="i-ph-arrows-clockwise-duotone" class="mr-1" />
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 菜单树形表格 -->
      <el-table 
        v-loading="loading" 
        :data="menus" 
        row-key="id" 
        border 
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="菜单名称" width="180">
          <template #default="{ row }">
            <div class="flex items-center">
              <Icon v-if="row.icon" :name="row.icon" class="mr-2 text-lg" />
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.hidden" type="info">隐藏</el-tag>
            <el-tag v-else type="success">显示</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="flex space-x-1">
              <el-button size="small" type="primary" @click="openMenuDialog(row)">
                <Icon name="i-ph-pencil-duotone" />
              </el-button>
              <el-button size="small" type="success" @click="addSubMenu(row)">
                <Icon name="i-ph-plus-circle-duotone" />
              </el-button>
              <el-popconfirm 
                title="确认删除该菜单吗？" 
                @confirm="deleteMenu(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-button size="small" type="danger">
                    <Icon name="i-ph-trash-duotone" />
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 菜单表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editMode ? '编辑菜单' : '新增菜单'"
      width="600px"
      destroy-on-close
    >
      <el-form 
        ref="menuFormRef"
        :model="menuForm" 
        :rules="menuRules" 
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="路由路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径，如: /dashboard" />
        </el-form-item>

        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuForm.component" placeholder="组件路径，如: pages/dashboard/index.vue" />
        </el-form-item>

        <el-form-item label="重定向路径" prop="redirect">
          <el-input v-model="menuForm.redirect" placeholder="重定向路径（可选）" />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="图标名称，如: i-ph-house-duotone">
            <template #append>
              <el-button @click="navigateTo('/icons')">
                <Icon name="i-ph-palette-duotone" />
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="父级菜单" prop="parentId">
          <el-select 
            v-model="menuForm.parentId" 
            placeholder="选择父级菜单（可选）"
            clearable
            style="width: 100%"
          >
            <el-option 
              v-for="menu in flatMenus.filter(m => m.id !== menuForm.id)" 
              :key="menu.id" 
              :label="menu.name" 
              :value="menu.id" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" />
        </el-form-item>

        <el-form-item label="菜单状态">
          <el-switch 
            v-model="menuForm.hidden" 
            :active-value="true"
            :inactive-value="false"
            active-text="隐藏"
            inactive-text="显示"
          />
        </el-form-item>

        <el-form-item label="总是显示">
          <el-switch 
            v-model="menuForm.alwaysShow" 
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        
        <el-form-item label="分配角色" prop="roles">
          <el-select 
            v-model="menuForm.roles" 
            placeholder="选择角色（可多选）"
            multiple
            style="width: 100%"
          >
            <el-option 
              v-for="role in roles" 
              :key="role.id" 
              :label="role.name" 
              :value="role.id" 
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveMenu" :loading="saving">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'admin',
})

// 引入响应式API
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

// 获取用户信息和权限
const { hasPermission, getAuthHeaders } = useAuth()

// 检查是否有管理菜单的权限
const canManageMenus = computed(() => {
  return hasPermission('menus', 'read')
})

// 菜单数据
const menus = ref<any[]>([])
const loading = ref(false)
const roles = ref<any[]>([])

// 对话框控制
const dialogVisible = ref(false)
const editMode = ref(false)
const saving = ref(false)
const menuFormRef = ref()

// 菜单表单数据
const menuForm = reactive({
  id: null as number | null,
  name: '',
  path: '',
  component: '',
  redirect: '',
  icon: '',
  parentId: null as number | null,
  sort: 0,
  hidden: false,
  alwaysShow: false,
  roles: [] as number[],
})

// 表单验证规则
const menuRules = reactive({
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ]
})

// 加载菜单数据
const loadMenus = async () => {
  loading.value = true
  try {
    const { data } = await useFetch('/api/menus', {
      headers: getAuthHeaders()
    })
    if (data.value && data.value.menus) {
      menus.value = data.value.menus
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载菜单失败')
  } finally {
    loading.value = false
  }
}

// 加载角色列表
const loadRoles = async () => {
  try {
    const { data } = await useFetch('/api/roles', {
      headers: getAuthHeaders()
    })
    if (data.value && Array.isArray(data.value.roles)) {
      roles.value = data.value.roles
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载角色失败')
  }
}

// 计算扁平化的菜单列表，用于父级菜单选择
const flatMenus = computed(() => {
  const flattenMenus = (items: any[], result: any[] = []) => {
    items.forEach(item => {
      result.push(item)
      if (item.children && item.children.length > 0) {
        flattenMenus(item.children, result)
      }
    })
    return result
  }
  return flattenMenus(menus.value)
})

// 打开菜单对话框
const openMenuDialog = (row?: any) => {
  editMode.value = !!row
  if (row) {
    // 编辑模式
    Object.assign(menuForm, {
      id: row.id,
      name: row.name,
      path: row.path,
      component: row.component,
      redirect: row.redirect,
      icon: row.icon,
      parentId: row.parentId,
      sort: row.sort,
      hidden: row.hidden,
      alwaysShow: row.alwaysShow,
      roles: []
    })
    
    // 加载菜单的角色关联
    loadMenuRoles(row.id)
  } else {
    // 新增模式
    Object.assign(menuForm, {
      id: null,
      name: '',
      path: '',
      component: '',
      redirect: '',
      icon: '',
      parentId: null,
      sort: 0,
      hidden: false,
      alwaysShow: false,
      roles: []
    })
  }
  dialogVisible.value = true
}

// 加载菜单角色关联
const loadMenuRoles = async (menuId: number) => {
  try {
    // 这个API端点需要开发，获取菜单关联的角色列表
    const { data } = await useFetch(`/api/menus/${menuId}/roles`, {
      headers: getAuthHeaders()
    })
    if (data.value && Array.isArray(data.value.roleIds)) {
      menuForm.roles = data.value.roleIds
    }
  } catch (error) {
    console.error('加载菜单角色关联失败:', error)
  }
}

// 添加子菜单
const addSubMenu = (row: any) => {
  editMode.value = false
  Object.assign(menuForm, {
    id: null,
    name: '',
    path: '',
    component: '',
    redirect: '',
    icon: '',
    parentId: row.id,
    sort: 0,
    hidden: false,
    alwaysShow: false,
    roles: []
  })
  dialogVisible.value = true
}

// 保存菜单
const saveMenu = async () => {
  if (!menuFormRef.value) return
  
  await menuFormRef.value.validate(async (valid) => {
    if (valid) {
      saving.value = true
      try {
        const url = editMode.value ? `/api/menus/${menuForm.id}` : '/api/menus'
        const method = editMode.value ? 'PATCH' : 'POST'
        
        const { data, error } = await useFetch(url, {
          method,
          body: menuForm,
          headers: getAuthHeaders()
        })
        
        if (error.value) {
          throw new Error(error.value.message || '保存菜单失败')
        }
        
        ElNotification({
          title: '成功',
          message: editMode.value ? '菜单更新成功' : '菜单创建成功',
          type: 'success'
        })
        
        dialogVisible.value = false
        loadMenus()
      } catch (error: any) {
        ElMessage.error(error.message || '保存菜单失败')
      } finally {
        saving.value = false
      }
    }
  })
}

// 删除菜单
const deleteMenu = async (id: number) => {
  try {
    const { data, error } = await useFetch(`/api/menus/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    if (error.value) {
      throw new Error(error.value.message || '删除菜单失败')
    }
    
    ElNotification({
      title: '成功',
      message: '菜单删除成功',
      type: 'success'
    })
    
    loadMenus()
  } catch (error: any) {
    ElMessage.error(error.message || '删除菜单失败')
  }
}

// 初始化
onMounted(() => {
  loadMenus()
  loadRoles()
})
</script> 