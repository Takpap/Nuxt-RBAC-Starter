import { defineEventHandler } from 'h3'
import si from 'systeminformation'

export default defineEventHandler(async () => {
  try {
    return await getSystemStats()
  } catch (error) {
    console.error('获取系统状态失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取系统状态失败'
    })
  }
})

async function getSystemStats() {
  const [cpu, mem, osInfo, time, fsSize, currentLoad] = await Promise.all([
    si.cpu(),
    si.mem(),
    si.osInfo(),
    si.time(),
    si.fsSize(),
    si.currentLoad(),
  ])

  // 计算内存使用率
  const memoryUsage = Math.round((mem.active / mem.total) * 100)
  
  // 计算磁盘使用率（使用主磁盘）
  const mainDisk = fsSize[0]
  const diskUsage = Math.round((mainDisk.used / mainDisk.size) * 100)

  // 返回系统信息
  return {
    os: {
      type: osInfo.platform,
      distro: osInfo.distro,
      release: osInfo.release,
      hostname: osInfo.hostname
    },
    cpu: {
      usage: Math.round(currentLoad.currentLoad),
      model: cpu.manufacturer + ' ' + cpu.brand,
      cores: cpu.cores,
      physicalCores: cpu.physicalCores,
      speed: cpu.speed
    },
    memory: {
      usage: memoryUsage,
      total: formatBytes(mem.total),
      free: formatBytes(mem.free),
      used: formatBytes(mem.active),
      swapUsed: formatBytes(mem.swapused),
      swapTotal: formatBytes(mem.swaptotal)
    },
    disk: {
      usage: diskUsage,
      total: formatBytes(mainDisk.size),
      used: formatBytes(mainDisk.used),
      free: formatBytes(mainDisk.size - mainDisk.used)
    },
    uptime: {
      total: time.uptime,
      formatted: formatUptime(time.uptime)
    },
    time: new Date().toISOString()
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}小时 ${minutes}分钟`
} 