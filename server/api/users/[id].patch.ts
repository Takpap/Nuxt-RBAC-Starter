import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~/server/utils/prisma'
import { hashPassword } from '~/server/utils/auth'
import { logActivity } from '~/server/utils/logger'

export default defineEventHandler(async (event) => {
  const userId = Number(event.context.params?.id)
  
  if (!userId || isNaN(userId)) {
    throw createError({
      statusCode: 400,
      message: '无效的用户ID',
    })
  }
  
  // 检查用户是否存在
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  })
  
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: '用户不存在',
    })
  }
  
  const body = await readBody(event)
  const data: any = {}
  
  // 只更新提供的字段
  if (body.email !== undefined) data.email = body.email
  if (body.name !== undefined) data.name = body.name
  if (body.isActive !== undefined) data.isActive = body.isActive
  if (body.roleId !== undefined) data.roleId = body.roleId
  
  // 如果提供了密码，对其进行加密
  if (body.password) {
    data.password = await hashPassword(body.password)
  }
  
  // 检查邮箱是否被其他用户使用
  if (data.email) {
    const emailUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    
    if (emailUser && emailUser.id !== userId) {
      throw createError({
        statusCode: 400,
        message: '该邮箱已被使用',
      })
    }
  }
  
  // 更新用户
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        role: true,
      },
    })
    
    // 记录用户更新活动
    const changes = Object.keys(data)
      .filter(key => key !== 'password')
      .map(key => `${key}: ${data[key]}`)
      .join(', ')
    
    // 记录更新用户活动
    await logActivity({
      event,
      action: 'update',
      resourceType: 'user',
      resourceId: userId.toString(),
      description: `更新用户 ${existingUser.username}${changes ? ` (${changes})` : ''}`,
      targetUserId: userId,
    })
    
    // 如果角色变更，额外记录一条活动
    if (data.roleId && data.roleId !== existingUser.roleId) {
      const oldRoleName = existingUser.role?.name || '未知角色'
      const newRoleName = updatedUser.role?.name || '未知角色'
      
      await logActivity({
        event,
        action: 'assign_role',
        resourceType: 'user',
        resourceId: userId.toString(),
        description: `用户 ${existingUser.username} 的角色从 "${oldRoleName}" 变更为 "${newRoleName}"`,
        targetUserId: userId,
        roleId: data.roleId,
      })
    }
    
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      isActive: updatedUser.isActive,
      role: {
        id: updatedUser.role.id,
        name: updatedUser.role.name,
      },
    }
  } catch (error) {
    console.error('更新用户失败:', error)
    throw createError({
      statusCode: 500,
      message: '更新用户失败',
    })
  }
}) 