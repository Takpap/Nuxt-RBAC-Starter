<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="mb-4">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">系统概览</h3>
              <el-button type="primary" size="small" text>刷新</el-button>
            </div>
          </template>
          
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <div class="flex items-center">
                  <el-icon class="text-blue-500 text-2xl mr-3"><icon name="i-ep-user" /></el-icon>
                  <div>
                    <div class="text-sm text-gray-500">用户总数</div>
                    <div class="text-xl font-bold">{{ stats.users }}</div>
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="bg-green-50 p-4 rounded-lg mb-4">
                <div class="flex items-center">
                  <el-icon class="text-green-500 text-2xl mr-3"><icon name="i-ep-user-filled" /></el-icon>
                  <div>
                    <div class="text-sm text-gray-500">角色总数</div>
                    <div class="text-xl font-bold">{{ stats.roles }}</div>
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="bg-purple-50 p-4 rounded-lg mb-4">
                <div class="flex items-center">
                  <el-icon class="text-purple-500 text-2xl mr-3"><icon name="i-ep-key" /></el-icon>
                  <div>
                    <div class="text-sm text-gray-500">权限总数</div>
                    <div class="text-xl font-bold">{{ stats.permissions }}</div>
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <div class="bg-orange-50 p-4 rounded-lg mb-4">
                <div class="flex items-center">
                  <el-icon class="text-orange-500 text-2xl mr-3"><icon name="i-ep-timer" /></el-icon>
                  <div>
                    <div class="text-sm text-gray-500">活跃会话</div>
                    <div class="text-xl font-bold">{{ stats.sessions }}</div>
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
        <el-card class="mb-4">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">最近活动</h3>
              <el-button type="primary" size="small" text>查看全部</el-button>
            </div>
          </template>
          
          <el-empty v-if="activities.length === 0" description="暂无活动记录"></el-empty>
          
          <el-timeline v-else>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.time"
              :type="activity.type"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="8">
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">系统信息</h3>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item label="当前用户">{{ user?.username }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ user?.role?.name }}</el-descriptions-item>
            <el-descriptions-item label="操作系统">{{ systemInfo.os }}</el-descriptions-item>
            <el-descriptions-item label="服务器时间">{{ systemInfo.time }}</el-descriptions-item>
            <el-descriptions-item label="API 版本">{{ systemInfo.version }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { user } = useAuth()

// 模拟统计数据
const stats = reactive({
  users: 0,
  roles: 0,
  permissions: 0,
  sessions: 0
})

// 模拟活动数据
interface Activity {
  time: string
  type: 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined
  content: string
}

const activities = ref<Activity[]>([])

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

// 初始化
onMounted(() => {
  fetchStats()
  // 更新系统时间
  setInterval(() => {
    systemInfo.time = new Date().toLocaleString()
  }, 1000)
})
</script> 