<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-10">
      <el-skeleton style="width: 100%" animated>
        <template #template>
          <el-skeleton-item variant="p" style="width: 100%; height: 300px" />
        </template>
      </el-skeleton>
    </div>
    
    <div v-else>
      <!-- 实时数据和时间选择 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">查看统计周期:</span>
          <el-radio-group v-model="selectedPeriod" size="small" @change="fetchHistoryData">
            <el-radio-button label="hour">小时</el-radio-button>
            <el-radio-button label="day">天</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
          </el-radio-group>
        </div>
        
        <div class="text-sm text-gray-500 flex items-center">
          <Icon name="i-ic-baseline-access-time" class="mr-1 text-gray-400" />
          <span>最近更新: {{ formatTime }}</span>
        </div>
      </div>
      
      <!-- 系统资源图表 -->
      <div class="bg-white rounded-lg p-4 shadow mb-4 h-80">
        <h4 class="text-sm font-semibold text-gray-700 mb-3">系统资源使用率</h4>
        <client-only>
          <LineChart
            v-if="resourceChartData.labels.length > 0"
            :chart-data="resourceChartData"
            :chart-options="chartOptions"
          />
        </client-only>
      </div>
      
      <!-- 网络使用图表 -->
      <div class="bg-white rounded-lg p-4 shadow h-60">
        <h4 class="text-sm font-semibold text-gray-700 mb-3">网络流量 (Mbps)</h4>
        <client-only>
          <LineChart
            v-if="networkChartData.labels.length > 0"
            :chart-data="networkChartData"
            :chart-options="networkChartOptions"
          />
        </client-only>
      </div>
      
      <!-- 实时状态卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <el-card shadow="hover" class="relative overflow-hidden">
          <div class="absolute right-0 top-0 bg-red-50 w-20 h-20 rounded-bl-full flex items-start justify-end pr-2 pt-2">
            <Icon name="i-mdi-cpu-64-bit" class="text-red-500 text-2xl" />
          </div>
          <div class="mt-2">
            <div class="text-sm font-medium text-gray-500 mb-1">CPU 使用率</div>
            <div class="flex items-end">
              <div class="text-3xl font-bold text-gray-800">{{ realtimeStats.cpu }}%</div>
              <div class="text-xs ml-2 mb-1" :class="getTrendClass(cpuTrend)">
                <Icon :name="getTrendIcon(cpuTrend)" class="mr-1" />
                {{ Math.abs(cpuTrend) }}%
              </div>
            </div>
            <el-progress :percentage="realtimeStats.cpu" :color="getProgressColor(realtimeStats.cpu)" :stroke-width="8" />
          </div>
        </el-card>
        
        <el-card shadow="hover" class="relative overflow-hidden">
          <div class="absolute right-0 top-0 bg-blue-50 w-20 h-20 rounded-bl-full flex items-start justify-end pr-2 pt-2">
            <Icon name="i-mdi-memory" class="text-blue-500 text-2xl" />
          </div>
          <div class="mt-2">
            <div class="text-sm font-medium text-gray-500 mb-1">内存使用率</div>
            <div class="flex items-end">
              <div class="text-3xl font-bold text-gray-800">{{ realtimeStats.memory }}%</div>
              <div class="text-xs ml-2 mb-1" :class="getTrendClass(memoryTrend)">
                <Icon :name="getTrendIcon(memoryTrend)" class="mr-1" />
                {{ Math.abs(memoryTrend) }}%
              </div>
            </div>
            <el-progress :percentage="realtimeStats.memory" :color="getProgressColor(realtimeStats.memory)" :stroke-width="8" />
          </div>
        </el-card>
        
        <el-card shadow="hover" class="relative overflow-hidden">
          <div class="absolute right-0 top-0 bg-green-50 w-20 h-20 rounded-bl-full flex items-start justify-end pr-2 pt-2">
            <Icon name="i-mdi-harddisk" class="text-green-500 text-2xl" />
          </div>
          <div class="mt-2">
            <div class="text-sm font-medium text-gray-500 mb-1">磁盘使用率</div>
            <div class="flex items-end">
              <div class="text-3xl font-bold text-gray-800">{{ realtimeStats.disk }}%</div>
              <div class="text-xs ml-2 mb-1" :class="getTrendClass(diskTrend)">
                <Icon :name="getTrendIcon(diskTrend)" class="mr-1" />
                {{ Math.abs(diskTrend) }}%
              </div>
            </div>
            <el-progress :percentage="realtimeStats.disk" :color="getProgressColor(realtimeStats.disk)" :stroke-width="8" />
          </div>
        </el-card>
        
        <el-card shadow="hover" class="relative overflow-hidden">
          <div class="absolute right-0 top-0 bg-purple-50 w-20 h-20 rounded-bl-full flex items-start justify-end pr-2 pt-2">
            <Icon name="i-mdi-swap-horizontal" class="text-purple-500 text-2xl" />
          </div>
          <div class="mt-2">
            <div class="text-sm font-medium text-gray-500 mb-1">网络流量</div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <div class="text-xs text-gray-500">下载</div>
                <div class="text-xl font-bold text-gray-800">{{ networkStats.rx_sec }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500">上传</div>
                <div class="text-xl font-bold text-gray-800">{{ networkStats.tx_sec }}</div>
              </div>
            </div>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>总接收: {{ networkStats.rx_bytes }}</span>
              <span>总发送: {{ networkStats.tx_bytes }}</span>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 进程与会话信息 -->
      <el-card shadow="hover" class="mt-4">
        <template #header>
          <div class="flex items-center">
            <Icon name="i-carbon-task" class="text-indigo-500 mr-2" />
            <span class="text-sm font-medium">系统进程</span>
          </div>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs text-gray-500 mb-1">总进程数</div>
            <div class="text-xl font-bold text-gray-800">{{ processStats.total || 'N/A' }}</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs text-gray-500 mb-1">运行中</div>
            <div class="text-xl font-bold text-green-600">{{ processStats.running || 'N/A' }}</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs text-gray-500 mb-1">阻塞</div>
            <div class="text-xl font-bold text-orange-500">{{ processStats.blocked || 'N/A' }}</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-xs text-gray-500 mb-1">休眠</div>
            <div class="text-xl font-bold text-blue-500">{{ processStats.sleeping || 'N/A' }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const loading = ref(true)
const selectedPeriod = ref('hour')
const lastUpdated = ref(new Date())
const pollingInterval = ref<NodeJS.Timeout | null>(null)

// 实时数据
const realtimeStats = reactive({
  cpu: 0,
  memory: 0,
  disk: 0
})

// 网络统计
const networkStats = reactive({
  rx_bytes: '0 B',
  tx_bytes: '0 B',
  rx_sec: '0 B/s',
  tx_sec: '0 B/s',
  interface: ''
})

// 进程统计
const processStats = reactive({
  total: 0,
  running: 0,
  blocked: 0,
  sleeping: 0
})

// 上一次的读数用于计算趋势
const previousStats = reactive({
  cpu: 0,
  memory: 0,
  disk: 0
})

// 历史数据
const historyData = reactive({
  labels: [] as string[],
  datasets: {
    cpu: [] as number[],
    memory: [] as number[],
    disk: [] as number[],
    networkRx: [] as number[],
    networkTx: [] as number[]
  }
})

// 计算趋势值
const cpuTrend = computed(() => realtimeStats.cpu - previousStats.cpu)
const memoryTrend = computed(() => realtimeStats.memory - previousStats.memory)
const diskTrend = computed(() => realtimeStats.disk - previousStats.disk)

// 格式化最后更新时间
const formatTime = computed(() => {
  return lastUpdated.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

// 系统资源图表数据
const resourceChartData = computed(() => {
  return {
    labels: historyData.labels,
    datasets: [
      {
        label: 'CPU',
        data: historyData.datasets.cpu,
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: '内存',
        data: historyData.datasets.memory,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: '磁盘',
        data: historyData.datasets.disk,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }
    ]
  }
})

// 网络图表数据
const networkChartData = computed(() => {
  return {
    labels: historyData.labels,
    datasets: [
      {
        label: '下载',
        data: historyData.datasets.networkRx,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: '上传',
        data: historyData.datasets.networkTx,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }
    ]
  }
})

// 图表配置
const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value: number) => value + '%'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.dataset.label}: ${context.parsed.y}%`
      }
    }
  }
})

// 网络图表配置
const networkChartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => value + ' Mbps'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.dataset.label}: ${context.parsed.y} Mbps`
      }
    }
  }
})

// 获取趋势图标和颜色
function getTrendIcon(value: number) {
  if (value > 0) return 'i-mdi-arrow-up-thin'
  if (value < 0) return 'i-mdi-arrow-down-thin'
  return 'i-mdi-minus'
}

function getTrendClass(value: number) {
  if (value > 0) return 'text-red-500'
  if (value < 0) return 'text-green-500'
  return 'text-gray-500'
}

// 获取进度条颜色
function getProgressColor(value: number) {
  if (value >= 80) return '#f87171'
  if (value >= 60) return '#fb923c'
  return '#34d399'
}

// 获取历史数据
async function fetchHistoryData() {
  try {
    loading.value = true
    const { data } = await useFetch(`/api/system/history?period=${selectedPeriod.value}`)
    
    if (data.value) {
      historyData.labels = data.value.labels
      historyData.datasets.cpu = data.value.datasets.cpu
      historyData.datasets.memory = data.value.datasets.memory
      historyData.datasets.disk = data.value.datasets.disk
      
      // 新增网络数据
      if (data.value.datasets.networkRx && data.value.datasets.networkTx) {
        historyData.datasets.networkRx = data.value.datasets.networkRx
        historyData.datasets.networkTx = data.value.datasets.networkTx
      }
    }
  } catch (error) {
    console.error('获取历史数据失败:', error)
    ElMessage.error('获取历史数据失败')
  } finally {
    loading.value = false
  }
}

// 获取实时系统状态
async function fetchRealtimeStats() {
  try {
    const { data } = await useFetch('/api/system/stats')
    if (data.value) {
      // 保存前一个状态以计算趋势
      previousStats.cpu = realtimeStats.cpu
      previousStats.memory = realtimeStats.memory
      previousStats.disk = realtimeStats.disk
      
      // 更新实时状态
      realtimeStats.cpu = data.value.cpu.usage
      realtimeStats.memory = data.value.memory.usage
      realtimeStats.disk = data.value.disk.usage
      
      // 更新网络统计
      if (data.value.network) {
        networkStats.rx_bytes = data.value.network.rx_bytes
        networkStats.tx_bytes = data.value.network.tx_bytes
        networkStats.rx_sec = data.value.network.rx_sec
        networkStats.tx_sec = data.value.network.tx_sec
        networkStats.interface = data.value.network.interface
      }
      
      // 更新进程统计
      if (data.value.processes) {
        processStats.total = data.value.processes.total
        processStats.running = data.value.processes.running
        processStats.blocked = data.value.processes.blocked
        processStats.sleeping = data.value.processes.sleeping
      }
      
      lastUpdated.value = new Date()
    }
  } catch (error) {
    console.error('获取系统状态失败:', error)
  }
}

// 初始化轮询
function initPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  
  // 立即获取一次数据
  fetchRealtimeStats()
  
  // 设置轮询间隔
  pollingInterval.value = setInterval(fetchRealtimeStats, 5000)
}

// 生命周期钩子
onMounted(async () => {
  // 获取初始系统信息
  try {
    const { data } = await useFetch('/api/system/info')
    if (data.value) {
      realtimeStats.cpu = data.value.stats.cpu
      realtimeStats.memory = data.value.stats.memory
      realtimeStats.disk = data.value.stats.disk
      
      // 复制初始值到上一个状态
      previousStats.cpu = realtimeStats.cpu
      previousStats.memory = realtimeStats.memory
      previousStats.disk = realtimeStats.disk
    }
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
  
  // 获取历史数据
  await fetchHistoryData()
  
  // 初始化轮询
  initPolling()
  
  loading.value = false
})

// 组件卸载时清除轮询
onUnmounted(() => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
})
</script>

<style scoped>
.el-progress-bar__inner {
  transition: width 0.5s ease;
}
</style> 