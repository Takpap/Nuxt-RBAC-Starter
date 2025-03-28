<template>
  <div>
    <div class="flex justify-between mb-4">
      <h3 class="text-base font-medium text-gray-700">活跃用户统计</h3>
      <el-select v-model="selectedPeriod" size="small" class="w-24">
        <el-option label="今日" value="today" />
        <el-option label="本周" value="week" />
        <el-option label="本月" value="month" />
      </el-select>
    </div>
    
    <client-only>
      <div class="h-60">
        <DoughnutChart
          :chart-data="chartData"
          :chart-options="chartOptions"
        />
      </div>
    </client-only>
    
    <div class="mt-4 space-y-2">
      <div v-for="(item, index) in userData" :key="index" class="flex items-center justify-between p-2 border-b border-gray-100">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: colors[index] }"></div>
          <span class="text-sm text-gray-700">{{ item.role }}</span>
        </div>
        <div class="text-sm font-medium">{{ item.count }} 人</div>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex justify-between text-sm text-gray-500">
        <span>总活跃用户</span>
        <span class="font-semibold text-gray-700">{{ totalUsers }} 人</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 选择的时间段
const selectedPeriod = ref('today')

// 图表颜色
const colors = [
  '#3B82F6', // 蓝色
  '#10B981', // 绿色
  '#8B5CF6', // 紫色
  '#F59E0B', // 橙色
  '#EF4444', // 红色
  '#6B7280', // 灰色
]

// 模拟用户数据 - 在实际应用中应该从API获取
const userData = ref([
  { role: '管理员', count: 3 },
  { role: '普通用户', count: 24 },
  { role: '编辑', count: 8 },
  { role: '访客', count: 15 },
])

// 计算总用户数
const totalUsers = computed(() => {
  return userData.value.reduce((sum, item) => sum + item.count, 0)
})

// 生成图表数据
const chartData = computed(() => {
  return {
    labels: userData.value.map(item => item.role),
    datasets: [
      {
        data: userData.value.map(item => item.count),
        backgroundColor: colors.slice(0, userData.value.length),
        borderWidth: 0,
        borderRadius: 5,
        cutout: '65%',
        hoverOffset: 10
      }
    ]
  }
})

// 图表配置
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          const percentage = Math.round((value / totalUsers.value) * 100)
          return `${label}: ${value} 人 (${percentage}%)`
        }
      }
    }
  }
}

// 根据选择的时间段加载数据
const loadData = async () => {
  try {
    const { data } = await useFetch(`/api/users/active?period=${selectedPeriod.value}`)
    
    if (data.value && data.value.data) {
      userData.value = data.value.data
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    ElMessage.error('获取用户数据失败')
  }
}

// 监听时间段变化
watch(selectedPeriod, () => {
  loadData()
})

// 组件加载时获取数据
onMounted(() => {
  loadData()
})
</script> 