<template>
  <div>
    <h2 class="text-xl font-bold mb-4">图标展示</h2>
    
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-2">常用图标集</h3>
      <div class="p-4 bg-white rounded-lg shadow">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="(icon, index) in commonIcons" :key="index" class="flex flex-col items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors" @click="copyIconName(icon.name)">
            <Icon :name="icon.name" class="text-2xl mb-2 text-gray-700" />
            <span class="text-xs text-gray-500 break-all text-center">{{ icon.name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-2">图标分类展示</h3>
      <el-tabs>
        <el-tab-pane label="用户相关">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            <div v-for="(icon, index) in userIcons" :key="index" class="flex flex-col items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors" @click="copyIconName(icon.name)">
              <Icon :name="icon.name" class="text-2xl mb-2 text-gray-700" />
              <span class="text-xs text-gray-500 break-all text-center">{{ icon.name }}</span>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="安全相关">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            <div v-for="(icon, index) in securityIcons" :key="index" class="flex flex-col items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors" @click="copyIconName(icon.name)">
              <Icon :name="icon.name" class="text-2xl mb-2 text-gray-700" />
              <span class="text-xs text-gray-500 break-all text-center">{{ icon.name }}</span>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="界面元素">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            <div v-for="(icon, index) in uiIcons" :key="index" class="flex flex-col items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors" @click="copyIconName(icon.name)">
              <Icon :name="icon.name" class="text-2xl mb-2 text-gray-700" />
              <span class="text-xs text-gray-500 break-all text-center">{{ icon.name }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-2">自定义图标</h3>
      <div class="flex flex-col space-y-4">
        <el-input v-model="customIconName" placeholder="输入图标名称 (例如: i-ph-user-duotone)" />
        <div v-if="customIconName" class="p-6 bg-white rounded-lg shadow-sm flex items-center justify-center">
          <div class="flex flex-col items-center">
            <Icon :name="customIconName" class="text-4xl mb-2" />
            <span class="text-sm text-gray-500">{{ customIconName }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <el-dialog v-model="dialogVisible" title="图标复制成功" width="300px">
      <p>图标名称已复制到剪贴板：</p>
      <pre class="p-2 bg-gray-100 rounded mt-2">{{ copiedIconName }}</pre>
      <p class="mt-3 text-sm text-gray-600">使用方法:</p>
      <pre class="p-2 bg-gray-100 rounded mt-1">&lt;Icon name="{{ copiedIconName }}" /&gt;</pre>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
const customIconName = ref('')
const dialogVisible = ref(false)
const copiedIconName = ref('')

// 常用图标
const commonIcons = [
  { name: 'i-ph-user-duotone' },
  { name: 'i-mdi-home' },
  { name: 'i-tabler-settings' },
  { name: 'i-ph-gear-duotone' },
  { name: 'i-carbon-dashboard' },
  { name: 'i-bx-menu' },
  { name: 'i-ph-list-duotone' },
  { name: 'i-tabler-logout' },
  { name: 'i-uil-search' },
  { name: 'i-ph-plus-duotone' },
  { name: 'i-ph-minus-duotone' },
  { name: 'i-ph-x-duotone' },
  { name: 'i-clarity-success-standard-solid' },
]

// 用户相关图标
const userIcons = [
  { name: 'i-ph-user-duotone' },
  { name: 'i-ph-users-duotone' },
  { name: 'i-ph-user-circle-duotone' },
  { name: 'i-ph-user-plus-duotone' },
  { name: 'i-ph-user-minus-duotone' },
  { name: 'i-ph-user-switch-duotone' },
  { name: 'i-mdi-account' },
  { name: 'i-mdi-account-group' },
  { name: 'i-carbon-user-avatar' },
  { name: 'i-carbon-user-role' },
  { name: 'i-carbon-user-admin' },
  { name: 'i-tabler-user-check' },
]

// 安全相关图标
const securityIcons = [
  { name: 'i-ph-lock-duotone' },
  { name: 'i-ph-lock-open-duotone' },
  { name: 'i-ph-key-duotone' },
  { name: 'i-ph-shield-duotone' },
  { name: 'i-ph-shield-check-duotone' },
  { name: 'i-ph-shield-warning-duotone' },
  { name: 'i-carbon-security' },
  { name: 'i-mdi-security' },
  { name: 'i-tabler-shield-lock' },
  { name: 'i-tabler-eye' },
  { name: 'i-tabler-eye-off' },
  { name: 'i-carbon-password' },
]

// 界面元素图标
const uiIcons = [
  { name: 'i-ph-check-duotone' },
  { name: 'i-ph-x-duotone' },
  { name: 'i-ph-plus-duotone' },
  { name: 'i-ph-minus-duotone' },
  { name: 'i-ph-arrow-right-duotone' },
  { name: 'i-ph-arrow-left-duotone' },
  { name: 'i-ph-arrow-up-duotone' },
  { name: 'i-ph-arrow-down-duotone' },
  { name: 'i-ph-caret-right-duotone' },
  { name: 'i-ph-caret-left-duotone' },
  { name: 'i-ph-caret-up-duotone' },
  { name: 'i-ph-caret-down-duotone' },
]

// 复制图标名称到剪贴板
const copyIconName = (name: string) => {
  navigator.clipboard.writeText(name)
  copiedIconName.value = name
  dialogVisible.value = true
}
</script> 