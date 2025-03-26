<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300 mb-4">404</h1>
      <h2 class="text-3xl font-bold text-gray-800 mb-6">页面未找到</h2>
      <p class="text-xl text-gray-600 mb-8">
        您访问的页面不存在或已被移动
      </p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

function goHome() {
  navigateTo('/')
}
</script> 