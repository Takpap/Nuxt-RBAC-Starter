// API错误类型定义
export interface ApiError {
  statusCode?: number;
  status?: number;
  message?: string;
  [key: string]: any;
}

// API错误处理结果
export interface ApiErrorResult {
  statusCode?: number;
  message: string;
  error: ApiError;
}

// 扩展 Nuxt 全局类型
declare module '#app' {
  interface NuxtApp {
    $handleApiError?: (error: ApiError, defaultMessage?: string) => ApiErrorResult;
  }
}

// 导出空对象，使其成为一个模块
export {}; 