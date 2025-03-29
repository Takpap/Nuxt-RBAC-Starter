<template>
  <div>
    <!-- 顶部统计卡片组 -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <el-card class="shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-t-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500 font-medium mb-1">用户总数</div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.users }}</div>
            <div class="mt-1 text-xs text-gray-500">较上周 <span class="text-green-500 font-medium">+{{ userGrowth }}%</span></div>
          </div>
          <div class="bg-blue-50 p-3 rounded-full">
            <Icon name="i-ph-users-duotone" class="text-blue-500 text-4xl" />
          </div>
        </div>
      </el-card>
            
      <el-card class="shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-t-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500 font-medium mb-1">角色总数</div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.roles }}</div>
            <div class="mt-1 text-xs text-gray-500">本月新增 <span class="text-green-500 font-medium">{{ newRolesCount }}</span></div>
          </div>
          <div class="bg-green-50 p-3 rounded-full">
            <Icon name="i-carbon-user-role" class="text-green-500 text-4xl" />
          </div>
        </div>
      </el-card>
            
      <el-card class="shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-t-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500 font-medium mb-1">权限总数</div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.permissions }}</div>
            <div class="mt-1 text-xs text-gray-500">活跃使用 <span class="text-blue-500 font-medium">{{ activePermissionsPct }}%</span></div>
          </div>
          <div class="bg-purple-50 p-3 rounded-full">
            <Icon name="i-solar-key-bold-duotone" class="text-purple-500 text-4xl" />
          </div>
        </div>
      </el-card>
            
      <el-card class="shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-t-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500 font-medium mb-1">活跃会话</div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.sessions }}</div>
            <div class="mt-1 text-xs text-gray-500">今日登录 <span class="text-orange-500 font-medium">{{ todaysLoginsCount }}</span></div>
          </div>
          <div class="bg-orange-50 p-3 rounded-full">
            <Icon name="i-clarity-clock-solid" class="text-orange-500 text-4xl" />
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 系统监控图表区域 -->
    <el-card class="mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-700 flex items-center">
            <Icon name="i-mdi-chart-line" class="mr-2 text-indigo-500 text-xl" />
            系统监控
          </h3>
          <el-button-group>
            <el-tooltip content="展开全屏查看" placement="top">
              <el-button type="info" size="small" text class="hover:bg-gray-50 px-3 py-1 rounded-md">
                <Icon name="i-mdi-arrow-expand-all" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="刷新数据" placement="top">
              <el-button type="primary" size="small" text class="hover:bg-blue-50 px-3 py-1 rounded-md" @click="refreshData">
                <Icon name="i-tabler-refresh" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </template>
      
      <SystemMonitor />
    </el-card>
    
    <el-row :gutter="20">
      <!-- 左侧面板 -->
      <el-col :xs="24" :lg="16">
        <!-- 最近活动 -->
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
        
        <!-- 最新用户 -->
        <el-card class="mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-700 flex items-center">
                <Icon name="i-ph-user-circle-duotone" class="mr-2 text-blue-500 text-xl" />
                最新用户
              </h3>
              <el-button type="primary" size="small" text class="hover:bg-blue-50 px-3 py-1 rounded-md" @click="navigateTo('/users')">
                <Icon name="i-lucide-users" class="mr-1" />
                管理用户
              </el-button>
            </div>
          </template>
          
          <el-table :data="recentUsers" stripe style="width: 100%" v-loading="loadingUsers">
            <el-table-column prop="username" label="用户名" min-width="120">
              <template #default="scope">
                <div class="flex items-center">
                  <el-avatar :size="24" class="mr-2">{{ scope.row.username.charAt(0).toUpperCase() }}</el-avatar>
                  <span>{{ scope.row.username }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="180" />
            <el-table-column prop="role.name" label="角色" width="120">
              <template #default="scope">
                <el-tag size="small" type="success">{{ scope.row.role?.name || '未分配' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180">
              <template #default="scope">
                {{ new Date(scope.row.createdAt).toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <!-- 右侧面板 -->
      <el-col :xs="24" :lg="8">
        <!-- 系统信息 -->
        <el-card class="shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
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
            <el-descriptions-item label="CPU型号" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-mdi-cpu-64-bit" class="mr-2 text-gray-600" />
                {{ systemInfo.cpu?.model || '未知' }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="CPU架构" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-mdi-laptop" class="mr-2 text-gray-600" />
                {{ systemInfo.os_arch?.arch || '未知' }} | {{ systemInfo.cpu?.cores || 0 }} 核心
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="内存容量" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-mdi-memory" class="mr-2 text-gray-600" />
                {{ systemInfo.memory?.total || '未知' }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item v-if="systemInfo.gpu && systemInfo.gpu.length > 0" label="显卡" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-mdi-expansion-card" class="mr-2 text-gray-600" />
                {{ systemInfo.gpu[0]?.model || '未知' }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="系统设备" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-tabler-devices" class="mr-2 text-gray-600" />
                {{ systemInfo.system?.manufacturer || '未知' }} {{ systemInfo.system?.model || '' }}
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
            <el-descriptions-item label="运行时间" label-class-name="bg-gray-50 font-medium">
              <div class="flex items-center">
                <Icon name="i-mdi-timer-outline" class="mr-2 text-gray-600" />
                <span>{{ systemUptime }}</span>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        
        <!-- 用户分布 -->
        <el-card class="shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-700 flex items-center">
                <Icon name="i-ph-users-three-duotone" class="mr-2 text-blue-500 text-xl" />
                用户分布
              </h3>
            </div>
          </template>
          
          <ActiveUsersDashboard />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import SystemMonitor from '~/components/SystemMonitor.vue'
import ActiveUsersDashboard from '~/components/ActiveUsersDashboard.vue'

definePageMeta({
  layout: 'admin'
})

const { user } = useAuth()

// 统计数据
const stats = reactive({
  users: 0,
  roles: 0,
  permissions: 0,
  sessions: 0
})

// 额外的统计指标
const userGrowth = ref(7.5)
const newRolesCount = ref(3)
const activePermissionsPct = ref(68)
const todaysLoginsCount = ref(18)
const systemUptime = ref('')

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

// 用户数据接口
interface User {
  id: number
  username: string
  email: string
  name?: string | null
  createdAt: string | Date
  isActive: boolean
  role?: {
    id: number
    name: string
  }
}

const activities = ref<Activity[]>([])
const recentUsers = ref<User[]>([])
const loadingUsers = ref(false)


// 模拟系统信息
interface SystemInfo {
  os: string;
  cpu?: {
    model?: string;
    cores?: number;
    physicalCores?: number;
    speed?: string;
    arch?: string;
  };
  gpu?: Array<{
    model?: string;
    vendor?: string;
    vram?: string;
    driver?: string;
  }>;
  memory?: {
    total?: string;
    free?: string;
    used?: string;
  };
  system?: {
    manufacturer?: string;
    model?: string;
  };
  os_arch?: {
    arch?: string;
    type?: string;
    platform?: string;
    release?: string;
  };
  time: string;
  version: string;
}

const systemInfo = reactive<SystemInfo>({
  os: 'Linux',
  cpu: undefined,
  gpu: undefined,
  memory: undefined,
  system: undefined,
  os_arch: undefined,
  time: new Date().toLocaleString(),
  version: 'v1.0.0'
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

// 获取进度条颜色
const getProgressColor = (value: number) => {
  if (value >= 80) return '#ef4444'
  if (value >= 60) return '#f97316'
  return '#10b981'
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

// 获取最新用户
const fetchRecentUsers = async () => {
  try {
    loadingUsers.value = true
    const { data } = await useFetch('/api/users', {
      query: { 
        limit: 5,
        sort: 'createdAt:desc'
      }
    })
    
    if (data.value) {
      // 确保正确访问数据结构，并进行类型转换
      const userData = data.value.users || (Array.isArray(data.value) ? data.value : [])
      recentUsers.value = userData as unknown as User[]
    }
  } catch (err) {
    console.error('获取最新用户失败', err)
  } finally {
    loadingUsers.value = false
  }
}

// 获取系统信息
const fetchSystemInfo = async () => {
  try {
    const { data } = await useFetch('/api/system/info')
    
    if (data.value) {
      systemInfo.os = data.value.os.type + ' ' + data.value.os.release
      systemInfo.version = data.value.version
      systemInfo.time = new Date(data.value.time).toLocaleString()
      
      // 填充新增的系统信息
      systemInfo.cpu = data.value.cpu
      systemInfo.gpu = data.value.gpu
      systemInfo.memory = data.value.memory
      systemInfo.system = data.value.system
      systemInfo.os_arch = data.value.os

      // 获取系统运行时间
      const systemData = data.value
      if (systemData.uptime) {
        systemUptime.value = systemData.uptime.formatted || '未知'
      }
    }
  } catch (err) {
    console.error('获取系统信息失败', err)
  }
}

// 刷新数据
const refreshData = async () => {
  await Promise.all([
    fetchStats(),
    fetchRecentActivities(),
    fetchRecentUsers(),
    fetchSystemInfo()
  ])
  
  ElMessage.success('数据已刷新')
}

// 初始化
onMounted(async () => {
  if (typeof window !== 'undefined') {
    await nextTick()
    await refreshData();
  }
  
  // 更新系统时间
  setInterval(() => {
    systemInfo.time = new Date().toLocaleString()
  }, 1000)
})
</script> 