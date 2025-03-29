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
  const [cpu, mem, osInfo, time, fsSize, currentLoad, network, processes] = await Promise.all([
    si.cpu(),
    si.mem(),
    si.osInfo(),
    si.time(),
    si.fsSize(),
    si.currentLoad(),
    si.networkStats(),
    si.processes(),
  ])

  // 计算内存使用率
  const memoryUsage = Math.round((mem.active / mem.total) * 100)
  
  // 计算磁盘使用率（使用主磁盘）
  const mainDisk = fsSize[0]
  const diskUsage = Math.round((mainDisk.used / mainDisk.size) * 100)

  // 获取主网络接口
  const mainNetwork = network.find(net => net.operstate === 'up') || network[0]

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
    network: mainNetwork ? {
      interface: mainNetwork.iface,
      rx_bytes: formatBytes(mainNetwork.rx_bytes),
      tx_bytes: formatBytes(mainNetwork.tx_bytes),
      rx_sec: formatBytes(mainNetwork.rx_sec) + '/s',
      tx_sec: formatBytes(mainNetwork.tx_sec) + '/s'
    } : null,
    processes: {
      total: processes.all,
      running: processes.running,
      blocked: processes.blocked,
      sleeping: processes.sleeping
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
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) {
    return `${days}天 ${hours}小时 ${minutes}分钟`
  }
  
  return `${hours}小时 ${minutes}分钟`
} 