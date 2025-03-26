<template>
  <div>
    <el-card class="mb-4 shadow-sm">
      <template #header>
        <div class="flex items-center">
          <Icon name="i-ph-palette-duotone" class="mr-2 text-blue-500 text-xl" />
          <h1 class="text-xl font-bold">图标库</h1>
        </div>
      </template>
      
      <div class="mb-4">
        <p>该系统使用 <el-link href="https://nuxt.com/modules/icon" target="_blank" type="primary">@nuxt/icon</el-link> 模块，提供超过200,000个来自 <el-link href="https://icones.js.org/" target="_blank" type="primary">Iconify</el-link> 的图标。</p>
        <p class="mt-2">使用方法: <code>&lt;Icon name="图标名称" /&gt;</code></p>
        <p class="mt-1">其中图标名称格式为: <code>i-[集合名称]-[图标名称]</code>，例如：<code>i-ph-user-duotone</code></p>
        <p class="mt-2">您可以在下方查看常用图标，并可以直接点击复制图标名称。</p>
      </div>
      
      <ui-icons-display />
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script> 