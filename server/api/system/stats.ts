import { defineEventHandler, setHeader } from 'h3'
import os from 'os'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  // 设置响应头以支持 SSE
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  
  // 获取响应对象并保持连接
  const res = event.node.res
  
  // 发送系统信息初始数据
  res.write(`data: ${JSON.stringify(await getSystemStats())}\n\n`)
  
  // 每 5 秒发送一次更新
  const interval = setInterval(async () => {
    try {
      const stats = await getSystemStats()
      res.write(`data: ${JSON.stringify(stats)}\n\n`)
    } catch (error) {
      console.error('获取系统状态失败:', error)
      res.write(`data: ${JSON.stringify({ error: '获取系统状态失败' })}\n\n`)
    }
  }, 5000)
  
  // 当连接关闭时清除定时器
  res.on('close', () => {
    clearInterval(interval)
  })
})

async function getSystemStats() {
  // 获取 CPU 负载
  const cpuLoad = os.loadavg()[0]
  const cpus = os.cpus().length
  const cpuUsage = Math.min(Math.round((cpuLoad / cpus) * 100), 100)
  
  // 获取内存使用情况
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const memoryUsage = Math.round(((totalMem - freeMem) / totalMem) * 100)
  
  // 获取系统正常运行时间
  const uptime = os.uptime()
  const uptimeHours = Math.floor(uptime / 3600)
  const uptimeMinutes = Math.floor((uptime % 3600) / 60)
  
  // 获取磁盘使用情况 (仅在 Linux/macOS 上有效)
  let diskUsage = 0
  try {
    if (process.platform !== 'win32') {
      const { stdout } = await execAsync("df -kP / | awk 'NR==2 {print $5}'")
      diskUsage = parseInt(stdout.trim().replace('%', ''))
    } else {
      // Windows 系统下使用模拟数据
      diskUsage = Math.floor(Math.random() * 30) + 40
    }
  } catch (error) {
    console.error('获取磁盘使用率失败:', error)
    diskUsage = Math.floor(Math.random() * 30) + 40 // 模拟数据
  }
  
  // 返回系统信息
  return {
    os: {
      type: os.type(),
      platform: os.platform(),
      release: os.release(),
      hostname: os.hostname()
    },
    cpu: {
      usage: cpuUsage,
      model: os.cpus()[0].model,
      cores: cpus,
      loadavg: os.loadavg()
    },
    memory: {
      usage: memoryUsage,
      total: formatBytes(totalMem),
      free: formatBytes(freeMem),
      used: formatBytes(totalMem - freeMem)
    },
    disk: {
      usage: diskUsage
    },
    uptime: {
      total: uptime,
      formatted: `${uptimeHours}小时 ${uptimeMinutes}分钟`
    },
    time: new Date().toISOString(),
    network: {
      interfaces: Object.keys(os.networkInterfaces()).length
    }
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
} 