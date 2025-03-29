import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const period = String(query.period || 'hour') // hour, day, week

    // 生成模拟的历史数据
    return generateMockHistoryData(period)
  } catch (error) {
    console.error('获取系统历史数据失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取系统历史数据失败'
    })
  }
})

function generateMockHistoryData(period: string) {
  let dataPoints: number
  let interval: string
  let startTime: Date
  
  // 根据时间段确定数据点数量和间隔
  switch (period) {
    case 'hour':
      dataPoints = 12 // 5分钟一个点
      interval = '5分钟'
      startTime = new Date(Date.now() - 60 * 60 * 1000) // 1小时前
      break
    case 'day':
      dataPoints = 24 // 1小时一个点
      interval = '1小时'
      startTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24小时前
      break
    case 'week':
      dataPoints = 7 // 1天一个点
      interval = '1天'
      startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1周前
      break
    default:
      dataPoints = 12
      interval = '5分钟'
      startTime = new Date(Date.now() - 60 * 60 * 1000)
  }
  
  // 生成时间标签
  const timeLabels = []
  const cpuData = []
  const memoryData = []
  const diskData = []
  const networkRxData = []
  const networkTxData = []
  
  // 生成每个时间点的数据
  for (let i = 0; i < dataPoints; i++) {
    // 计算这个数据点的时间
    const pointTime = new Date(startTime.getTime() + (i * (Date.now() - startTime.getTime()) / dataPoints))
    
    // 格式化时间标签
    let timeLabel
    if (period === 'hour') {
      timeLabel = pointTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (period === 'day') {
      timeLabel = pointTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else {
      timeLabel = pointTime.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    }
    
    timeLabels.push(timeLabel)
    
    // 生成带有一定变化的模拟数据
    const baseCpu = 40
    const baseMemory = 65
    const baseDisk = 50
    const baseNetworkRx = 20
    const baseNetworkTx = 15
    
    // 生成波动的数据趋势
    const cpuWave = Math.sin(i / 2) * 20 + (Math.random() * 10 - 5)
    const memoryWave = Math.sin(i / 3) * 10 + (Math.random() * 6 - 3)
    const diskWave = (i / dataPoints) * 3 + (Math.random() * 4 - 2)
    const networkRxWave = Math.sin(i / 1.5) * 15 + (Math.random() * 8 - 4)
    const networkTxWave = Math.cos(i / 2) * 10 + (Math.random() * 6 - 3)
    
    // 数据随机波动，但保持在合理范围内
    cpuData.push(Math.min(Math.max(baseCpu + cpuWave, 5), 95))
    memoryData.push(Math.min(Math.max(baseMemory + memoryWave, 40), 90))
    diskData.push(Math.min(Math.max(baseDisk + diskWave, 40), 80))
    networkRxData.push(Math.min(Math.max(baseNetworkRx + networkRxWave, 5), 50))
    networkTxData.push(Math.min(Math.max(baseNetworkTx + networkTxWave, 5), 40))
  }
  
  return {
    period,
    interval,
    labels: timeLabels,
    datasets: {
      cpu: cpuData.map(value => Math.round(value)),
      memory: memoryData.map(value => Math.round(value)),
      disk: diskData.map(value => Math.round(value)),
      networkRx: networkRxData.map(value => Math.round(value)),
      networkTx: networkTxData.map(value => Math.round(value))
    }
  }
} 