<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// 注册 Chart.js 组件
ChartJS.register(ArcElement, Tooltip, Legend)

// 定义 props
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <Doughnut 
    :data="chartData"
    :options="chartOptions"
  />
</template> 