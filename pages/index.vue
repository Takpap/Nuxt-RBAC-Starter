<template>
  <div class="overflow-hidden">
    <!-- 英雄区域 -->
    <section class="relative bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-20 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-[url('/background-pattern.svg')] bg-repeat opacity-20"></div>
        <div class="absolute -right-24 -top-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        <div class="absolute -left-24 -bottom-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <div class="lg:w-1/2 text-center lg:text-left">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              全新一代RBAC<br>权限管理系统
            </h1>
            <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in animation-delay-200">
              提供企业级权限管理、用户认证与授权的完整解决方案，让您的系统安全无忧。
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in animation-delay-400">
              <el-button type="primary" size="large" class="text-lg px-8 py-3 rounded-full" @click="navigateTo('/login')">
                <el-icon class="mr-2"><Icon name="i-ep-key" /></el-icon>
                立即体验
              </el-button>
              <el-button type="info" size="large" class="text-lg px-8 py-3 rounded-full" plain @click="navigateTo('/register')">
                <el-icon class="mr-2"><Icon name="i-ep-user-filled" /></el-icon>
                创建账户
              </el-button>
            </div>
          </div>
          <div class="lg:w-1/2 rounded-xl shadow-2xl overflow-hidden animate-float">
            <img src="/dashboard-screenshot.png" alt="系统截图" class="w-full h-auto" onerror="this.src='https://via.placeholder.com/800x500?text=RBAC+Dashboard'">
          </div>
        </div>
        
        <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <el-icon class="text-white text-3xl animate-bounce"><Icon name="i-ep-arrow-down-bold" /></el-icon>
        </div>
      </div>
    </section>
    
    <!-- 合作伙伴 -->
    <section class="py-10 bg-gray-50">
      <div class="container mx-auto px-6">
        <p class="text-center text-gray-500 mb-8">受到各大企业的信赖</p>
        <div class="flex flex-wrap justify-center items-center gap-12 opacity-50">
          <img src="https://via.placeholder.com/120x40?text=Partner+1" alt="合作伙伴" class="h-8">
          <img src="https://via.placeholder.com/120x40?text=Partner+2" alt="合作伙伴" class="h-8">
          <img src="https://via.placeholder.com/120x40?text=Partner+3" alt="合作伙伴" class="h-8">
          <img src="https://via.placeholder.com/120x40?text=Partner+4" alt="合作伙伴" class="h-8">
          <img src="https://via.placeholder.com/120x40?text=Partner+5" alt="合作伙伴" class="h-8">
        </div>
      </div>
    </section>
    
    <!-- 主要功能 -->
    <section class="py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">核心功能</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            我们的RBAC系统提供全面的权限管理解决方案，满足您的所有安全需求
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <el-card class="feature-card transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
            <template #header>
              <div class="flex items-center">
                <el-icon class="text-blue-500 text-3xl mr-3"><Icon name="i-ep-user" /></el-icon>
                <h3 class="text-xl font-semibold">用户管理</h3>
              </div>
            </template>
            <div class="text-gray-600">
              <p>全面的用户账户管理，支持：</p>
              <ul class="mt-2 space-y-1 list-disc pl-5">
                <li>用户创建与删除</li>
                <li>账户状态控制</li>
                <li>密码策略管理</li>
                <li>用户信息编辑</li>
                <li>登录历史记录</li>
              </ul>
            </div>
          </el-card>
          
          <el-card class="feature-card transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
            <template #header>
              <div class="flex items-center">
                <el-icon class="text-green-500 text-3xl mr-3"><Icon name="i-ep-user-filled" /></el-icon>
                <h3 class="text-xl font-semibold">角色管理</h3>
              </div>
            </template>
            <div class="text-gray-600">
              <p>灵活的角色定义与管理：</p>
              <ul class="mt-2 space-y-1 list-disc pl-5">
                <li>自定义角色创建</li>
                <li>角色继承支持</li>
                <li>角色权限分配</li>
                <li>角色用户分配</li>
                <li>角色层级管理</li>
              </ul>
            </div>
          </el-card>
          
          <el-card class="feature-card transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
            <template #header>
              <div class="flex items-center">
                <el-icon class="text-purple-500 text-3xl mr-3"><Icon name="i-ep-key" /></el-icon>
                <h3 class="text-xl font-semibold">权限控制</h3>
              </div>
            </template>
            <div class="text-gray-600">
              <p>细粒度的权限管理体系：</p>
              <ul class="mt-2 space-y-1 list-disc pl-5">
                <li>资源访问控制</li>
                <li>操作权限管理</li>
                <li>数据过滤控制</li>
                <li>API权限设置</li>
                <li>权限组合与拆分</li>
              </ul>
            </div>
          </el-card>
          
          <el-card class="feature-card transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
            <template #header>
              <div class="flex items-center">
                <el-icon class="text-orange-500 text-3xl mr-3"><Icon name="i-ep-data-line" /></el-icon>
                <h3 class="text-xl font-semibold">活动日志</h3>
              </div>
            </template>
            <div class="text-gray-600">
              <p>全面的审计与日志记录：</p>
              <ul class="mt-2 space-y-1 list-disc pl-5">
                <li>用户操作追踪</li>
                <li>权限变更日志</li>
                <li>登录活动记录</li>
                <li>操作审计功能</li>
                <li>异常行为检测</li>
              </ul>
            </div>
          </el-card>
        </div>
      </div>
    </section>
    
    <!-- 统计数据 -->
    <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-blue-600 mb-2">
              <el-statistic :value="9800" format=",">
                <template #suffix>+</template>
              </el-statistic>
            </div>
            <p class="text-gray-600">活跃用户</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-green-600 mb-2">
              <el-statistic :value="150" format=",">
                <template #suffix>+</template>
              </el-statistic>
            </div>
            <p class="text-gray-600">企业客户</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-purple-600 mb-2">
              <el-statistic :value="99.9" :precision="1">
                <template #suffix>%</template>
              </el-statistic>
            </div>
            <p class="text-gray-600">系统可用率</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-orange-600 mb-2">
              <el-statistic :value="24" :precision="0">
                <template #suffix>/7</template>
              </el-statistic>
            </div>
            <p class="text-gray-600">全天候支持</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 工作流程 -->
    <section class="py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">简单高效的工作流程</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            从系统配置到权限分配，我们的RBAC系统让权限管理变得简单
          </p>
        </div>
        
        <el-timeline>
          <el-timeline-item timestamp="第一步" placement="top" type="primary">
            <el-card>
              <h3 class="text-xl font-bold mb-2 text-blue-600">用户与角色设置</h3>
              <p class="text-gray-600">创建用户账户并分配相应的角色，简化权限管理流程</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="第二步" placement="top" type="success">
            <el-card>
              <h3 class="text-xl font-bold mb-2 text-green-600">权限定义</h3>
              <p class="text-gray-600">定义具体的权限项，控制对系统资源的访问和操作能力</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="第三步" placement="top" type="warning">
            <el-card>
              <h3 class="text-xl font-bold mb-2 text-orange-600">角色分配权限</h3>
              <p class="text-gray-600">为角色分配适当的权限，实现批量权限管理</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="第四步" placement="top" type="danger">
            <el-card>
              <h3 class="text-xl font-bold mb-2 text-red-600">审计与监控</h3>
              <p class="text-gray-600">监控用户活动和系统操作，确保权限使用合规</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </section>
    
    <!-- 用户评价 -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">用户评价</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            了解我们的客户如何评价RBAC系统
          </p>
        </div>
        
        <el-carousel :interval="5000" height="320px">
          <el-carousel-item v-for="(feedback, index) in userFeedback" :key="index">
            <div class="h-full flex items-center justify-center">
              <div class="bg-white p-8 rounded-xl shadow-lg max-w-3xl">
                <div class="text-yellow-400 flex mb-4">
                  <el-icon v-for="i in 5" :key="i" class="text-xl"><Icon name="i-ep-star-filled" /></el-icon>
                </div>
                <p class="text-gray-700 text-lg italic mb-6">{{ feedback.comment }}</p>
                <div class="flex items-center">
                  <img :src="feedback.avatar" :alt="feedback.name" class="w-12 h-12 rounded-full mr-4">
                  <div>
                    <h4 class="font-bold text-gray-800">{{ feedback.name }}</h4>
                    <p class="text-gray-500">{{ feedback.position }}, {{ feedback.company }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>
    
    <!-- 常见问题 -->
    <section class="py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">常见问题</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            了解关于RBAC系统的常见问题和解答
          </p>
        </div>
        
        <div class="max-w-3xl mx-auto">
          <el-collapse>
            <el-collapse-item title="什么是RBAC系统？" name="1">
              <div class="text-gray-600 p-4">
                RBAC（基于角色的访问控制）是一种通过角色来管理用户权限的安全机制。用户被分配一个或多个角色，而权限则分配给角色，这样可以简化权限管理流程。
              </div>
            </el-collapse-item>
            <el-collapse-item title="RBAC系统适合哪些企业使用？" name="2">
              <div class="text-gray-600 p-4">
                RBAC系统适合各种规模的企业，特别是具有复杂组织结构和多级权限需求的中大型企业。对于需要严格控制数据访问和操作权限的行业，如金融、医疗、政府等，RBAC系统尤为适用。
              </div>
            </el-collapse-item>
            <el-collapse-item title="如何开始使用RBAC系统？" name="3">
              <div class="text-gray-600 p-4">
                开始使用RBAC系统非常简单。首先，注册一个账户，然后按照指引设置角色和权限。我们提供了详细的文档和教程，帮助您快速上手。如有需要，我们的技术支持团队随时为您提供帮助。
              </div>
            </el-collapse-item>
            <el-collapse-item title="RBAC系统如何保障数据安全？" name="4">
              <div class="text-gray-600 p-4">
                我们的RBAC系统通过多重安全机制保障数据安全，包括细粒度的权限控制、操作审计、异常检测等。系统采用加密传输和存储，定期进行安全更新，确保您的数据安全无虞。
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </section>
    
    <!-- 行动召唤 -->
    <section class="py-20 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">准备好开始使用RBAC系统了吗？</h2>
        <p class="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
          立即注册，体验全新一代的权限管理解决方案，保障您的系统安全。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <el-button type="primary" size="large" class="text-lg px-8 py-3 rounded-full bg-white text-blue-600 hover:bg-gray-100" @click="navigateTo('/register')">
            免费注册
          </el-button>
          <el-button type="info" size="large" class="text-lg px-8 py-3 rounded-full" plain @click="navigateTo('/docs')">
            查看文档
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home'
})

// 用户评价数据
const userFeedback = [
  {
    comment: "RBAC系统极大地简化了我们的权限管理流程。界面直观，配置简单，让我们的安全团队工作效率提升了50%以上。",
    name: "张明",
    position: "IT安全总监",
    company: "科技创新集团",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    comment: "作为一家金融机构，安全对我们至关重要。这个RBAC系统提供了我们所需的所有功能，帮助我们轻松满足合规要求。",
    name: "李雪",
    position: "首席信息官",
    company: "诚信银行",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    comment: "系统的审计功能非常强大，让我们能够追踪每一个操作，大大提高了我们的安全水平和问题排查能力。",
    name: "王强",
    position: "系统管理员",
    company: "未来科技",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg"
  }
];

// 如果已经登录，直接跳转到仪表盘
onMounted(async () => {
  const { checkAuth } = useAuth()
  const isAuthenticated = await checkAuth()
  if (isAuthenticated) {
    navigateTo('/dashboard')
  }
})
</script>

<style scoped>
/* 淡入动画 */
.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 悬浮动画 */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* 特性卡片样式 */
.feature-card {
  height: 100%;
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-8px);
}
</style> 