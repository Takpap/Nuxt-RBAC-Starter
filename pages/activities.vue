<template>
  <div>
    <el-card class="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold flex items-center">
            <Icon name="i-ph-activity-duotone" class="mr-2 text-blue-500" />
            系统活动日志
          </h1>
          <div class="flex items-center">
            <el-button type="primary" size="small" @click="refreshData">
              <Icon name="i-tabler-refresh" class="mr-1" />
              刷新
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="mb-4">
        <el-form :inline="true" :model="filterForm" class="flex flex-wrap gap-2">
          <el-form-item label="活动类型">
            <el-select v-model="filterForm.action" placeholder="所有类型" clearable>
              <el-option v-for="(label, value) in actionTypes" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="资源类型">
            <el-select v-model="filterForm.resourceType" placeholder="所有资源" clearable>
              <el-option v-for="(label, value) in resourceTypes" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="用户">
            <el-select v-model="filterForm.userId" placeholder="所有用户" clearable filterable>
              <el-option label="所有用户" :value="null" />
              <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="searchActivities">
              <Icon name="i-ph-magnifying-glass" class="mr-1" />
              搜索
            </el-button>
            <el-button @click="resetFilter">
              <Icon name="i-ph-eraser" class="mr-1" />
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table
        v-loading="loading"
        :data="activities"
        border
        style="width: 100%"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="操作类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTagType(row.action)" effect="light" size="small">
              <div class="flex items-center">
                <Icon :name="getActivityIcon(row.action)" class="mr-1" />
                {{ actionTypes[row.action] || row.action }}
              </div>
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="资源类型" width="120">
          <template #default="{ row }">
            <el-tag type="info" effect="plain" size="small">
              {{ resourceTypes[row.resourceType] || row.resourceType }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="描述" min-width="300">
          <template #default="{ row }">
            <div class="text-sm">{{ row.description }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="用户" width="150">
          <template #default="{ row }">
            <div v-if="row.user" class="flex items-center">
              <el-avatar :size="24" class="mr-2" />
              <span>{{ row.user.username }}</span>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        
        <el-table-column label="IP地址" width="150" prop="ipAddress">
          <template #default="{ row }">
            <span>{{ row.ipAddress || '-' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="时间" width="180">
          <template #default="{ row }">
            <div class="flex items-center">
              <Icon name="i-ph-clock" class="mr-1 text-gray-500" />
              <span>{{ new Date(row.createdAt).toLocaleString() }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="flex justify-center mt-4">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

// 活动类型
const actionTypes = {
  'login': '登录',
  'logout': '登出',
  'create': '创建',
  'update': '更新',
  'delete': '删除',
  'assign_role': '分配角色',
}

// 资源类型
const resourceTypes = {
  'user': '用户',
  'role': '角色',
  'permission': '权限',
}

// 过滤表单
const filterForm = reactive({
  action: null as string | null,
  resourceType: null as string | null,
  userId: null as number | null,
})

// 表格数据和加载状态
const activities = ref([])
const loading = ref(false)
const users = ref([])

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

// 获取活动类型对应的图标
const getActivityIcon = (action: string) => {
  switch(action) {
    case 'create': return 'i-ph-plus-circle-duotone'
    case 'update': return 'i-ph-pencil-duotone'
    case 'delete': return 'i-ph-trash-duotone'
    case 'login': return 'i-ph-sign-in-duotone'
    case 'logout': return 'i-ph-sign-out-duotone'
    case 'assign_role': return 'i-ph-user-switch-duotone'
    default: return 'i-ph-circle-duotone'
  }
}

// 获取标签类型
const getTagType = (action: string): '' | 'success' | 'warning' | 'danger' | 'info' => {
  switch(action) {
    case 'create': return 'success'
    case 'update': return ''
    case 'delete': return 'danger'
    case 'login': return 'info'
    case 'logout': return 'info'
    case 'assign_role': return 'warning'
    default: return 'info'
  }
}

// 获取活动数据
const fetchActivities = async () => {
  loading.value = true
  try {
    const query: any = {
      page: pagination.page,
      limit: pagination.limit,
    }
    
    // 添加过滤条件
    if (filterForm.action) query.action = filterForm.action
    if (filterForm.resourceType) query.resourceType = filterForm.resourceType
    if (filterForm.userId) query.userId = filterForm.userId
    
    const { data } = await useFetch('/api/activities', {
      query,
    })
    
    if (data.value) {
      activities.value = data.value.activities
      pagination.total = data.value.pagination.total
    }
  } catch (error) {
    console.error('获取活动数据失败:', error)
    ElMessage.error('获取活动数据失败')
  } finally {
    loading.value = false
  }
}

// 获取用户列表，用于过滤器
const fetchUsers = async () => {
  try {
    const { data } = await useFetch('/api/users')
    if (data.value) {
      users.value = data.value.users
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
  }
}

// 刷新数据
const refreshData = () => {
  fetchActivities()
}

// 搜索活动
const searchActivities = () => {
  pagination.page = 1 // 重置为第一页
  fetchActivities()
}

// 重置过滤条件
const resetFilter = () => {
  filterForm.action = null
  filterForm.resourceType = null
  filterForm.userId = null
  pagination.page = 1
  fetchActivities()
}

// 处理每页显示数量变化
const handleSizeChange = (size: number) => {
  pagination.limit = size
  fetchActivities()
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchActivities()
}

// 初始化
onMounted(() => {
  fetchActivities()
  fetchUsers()
})
</script> 