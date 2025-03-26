<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-700 flex items-center">
                <Icon name="i-mdi-view-dashboard" class="mr-2 text-blue-500 text-xl" />
                系统概览
              </h3>
              <el-button type="primary" size="small" text class="hover:bg-blue-50 px-3 py-1 rounded-md" @click="refreshData">
                <Icon name="i-tabler-refresh" class="mr-1" />
                刷新
              </el-button>
            </div>
          </template>
          
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mb-4 shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-blue-500">
                <div class="flex items-center">
                  <Icon name="i-ph-users-duotone" class="text-blue-500 text-3xl mr-3" />
                  <div>
                    <div class="text-sm text-gray-500 font-medium">用户总数</div>
                    <div class="text-2xl font-bold text-gray-800">{{ stats.users }}</div>
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mb-4 shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500">
                <div class="flex items-center">
                  <Icon name="i-carbon-user-role" class="text-green-500 text-3xl mr-3" />
                  <div>
                    <div class="text-sm text-gray-500 font-medium">角色总数</div>
                    <div class="text-2xl font-bold text-gray-800">{{ stats.roles }}</div>
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg mb-4 shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-purple-500">
                <div class="flex items-center">
                  <Icon name="i-solar-key-bold-duotone" class="text-purple-500 text-3xl mr-3" />
                  <div>
                    <div class="text-sm text-gray-500 font-medium">权限总数</div>
                    <div class="text-2xl font-bold text-gray-800">{{ stats.permissions }}</div>
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg mb-4 shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-orange-500">
                <div class="flex items-center">
                  <Icon name="i-clarity-clock-solid" class="text-orange-500 text-3xl mr-3" />
                  <div>
                    <div class="text-sm text-gray-500 font-medium">活跃会话</div>
                    <div class="text-2xl font-bold text-gray-800">{{ stats.sessions }}</div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <el-card class="mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-700 flex items-center">
                <Icon name="i-majesticons-clock-line" class="mr-2 text-green-500 text-xl" />
                最近活动
              </h3>
              <el-button type="success" size="small" text class="hover:bg-green-50 px-3 py-1 rounded-md" @click="navigateTo('/activities')">
                <Icon name="i-lucide-list" class="mr-1" />
                查看全部
              </el-button>
            </div>
          </template>
          
          <el-empty v-if="activities.length === 0" description="暂无活动记录" :image-size="120">
            <template #image>
              <Icon name="i-ant-design-inbox-outlined" class="text-gray-300 text-6xl" />
            </template>
          </el-empty>
          
          <div v-else class="overflow-hidden">
            <el-timeline>
              <el-timeline-item
                v-for="activity in activities"
                :key="activity.id"
                :timestamp="formatDate(activity.createdAt)"
                :type="getActivityType(activity.action)"
              >
                <div class="flex items-center">
                  <Icon :name="getActivityIcon(activity.action)" class="mr-2" />
                  <div>
                    <p class="text-gray-700 font-medium mb-1">{{ activity.description }}</p>
                    <div class="flex items-center text-xs text-gray-500">
                      <span v-if="activity.user" class="mr-2">
                        <el-tag size="small" class="mr-1" effect="plain">
                          {{ activity.user.username }}
                        </el-tag>
                      </span>
                      <span class="mr-2">{{ activity.resourceType }}</span>
                      <Icon name="i-ph-clock-duotone" class="mr-1" />
                      <span>{{ new Date(activity.createdAt).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="8">
        <el-card class="shadow-sm hover:shadow-md transition-shadow duration-300">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-700 flex items-center">
                <Icon name="i-bx-info-circle" class="mr-2 text-purple-500 text-xl" />
                系统信息
              </h3>
            </div>
          </template>
          
          <el-descriptions :column="1" border size="large" class="w-full">
            <el-descriptions-item label="当前用户" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <el-avatar :size="24" class="mr-2" />
                <span class="font-medium text-gray-800">{{ user?.username }}</span>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="角色" label-class-name="bg-gray-50 font-medium">
              <el-tag size="small" type="success">{{ user?.role?.name || '未分配' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="操作系统" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-tabler-device-desktop" class="mr-2 text-gray-600" />
                {{ systemInfo.os }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="服务器时间" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-uil-clock" class="mr-2 text-gray-600" />
                {{ systemInfo.time }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="API 版本" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-mdi-api" class="mr-2 text-gray-600" />
                <el-tag size="small" type="info">{{ systemInfo.version }}</el-tag>
              </div>
            </el-descriptions-item>
          </el-descriptions>
          
          <div class="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Icon name="i-ph-chart-line-duotone" class="mr-1 text-blue-500" />
              系统状态
            </h4>
            <div class="space-y-2">
              <div>
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>CPU使用率</span>
                  <span>{{ systemStats.cpu }}%</span>
                </div>
                <el-progress :percentage="systemStats.cpu" :stroke-width="8" status="success" />
              </div>
              <div>
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>内存使用率</span>
                  <span>{{ systemStats.memory }}%</span>
                </div>
                <el-progress :percentage="systemStats.memory" :stroke-width="8" status="warning" />
              </div>
              <div>
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>磁盘使用率</span>
                  <span>{{ systemStats.disk }}%</span>
                </div>
                <el-progress :percentage="systemStats.disk" :stroke-width="8" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

const { user } = useAuth()

// 模拟统计数据
const stats = reactive({
  users: 0,
  roles: 0,
  permissions: 0,
  sessions: 0
})

// 活动数据接口
interface Activity {
  id: number
  action: string
  description: string
  createdAt: string
  resourceType: string
  user?: {
    id: number
    username: string
    name?: string
  }
}

const activities = ref<Activity[]>([])

// 系统状态数据
const systemStats = reactive({
  cpu: 42,
  memory: 68,
  disk: 53
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

// 获取活动类型对应的样式
const getActivityType = (action: string): 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined => {
  switch(action) {
    case 'create': return 'success'
    case 'update': return 'primary'
    case 'delete': return 'danger'
    case 'login': return 'info'
    case 'logout': return 'info'
    case 'assign_role': return 'warning'
    default: return 'info'
  }
}

// 格式化日期函数
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    // 今天，显示时间
    return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    // 昨天
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays < 7) {
    // 一周内，显示星期几
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return `星期${days[date.getDay()]} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  } else {
    // 一周前，显示完整日期
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + 
           ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
}

// 模拟系统信息
const systemInfo = reactive({
  os: 'Linux',
  time: new Date().toLocaleString(),
  version: 'v1.0.0'
})

// 获取统计数据
const fetchStats = async () => {
  try {
    // 在这里调用API获取数据
    const [usersRes, rolesRes, permissionsRes, sessionsRes] = await Promise.all([
      useFetch('/api/users/count'),
      useFetch('/api/roles/count'),
      useFetch('/api/permissions/count'),
      useFetch('/api/sessions/count')
    ])
    
    stats.users = usersRes.data.value?.count || 0
    stats.roles = rolesRes.data.value?.count || 0
    stats.permissions = permissionsRes.data.value?.count || 0
    stats.sessions = sessionsRes.data.value?.count || 0
  } catch (err) {
    console.error('获取统计数据失败', err)
  }
}

// 获取最近活动
const fetchRecentActivities = async () => {
  try {
    const { data } = await useFetch('/api/activities/recent', {
      query: { limit: 5 }
    })
    
    if (data.value) {
      activities.value = data.value as Activity[]
    }
  } catch (err) {
    console.error('获取最近活动失败', err)
  }
}

// 刷新数据
const refreshData = async () => {
  await Promise.all([
    fetchStats(),
    fetchRecentActivities()
  ])
  
  ElMessage.success('数据已刷新')
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchRecentActivities()
  
  // 更新系统时间
  setInterval(() => {
    systemInfo.time = new Date().toLocaleString()
  }, 1000)
})
</script> 