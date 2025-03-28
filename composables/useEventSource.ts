export function useEventSource() {
  // 创建 EventSource 函数
  function createEventSource(url: string, options: {
    onMessage?: (event: MessageEvent) => void;
    onOpen?: (event: Event) => void;
    onError?: (event: Event) => void;
  } = {}) {
    if (typeof window === 'undefined') {
      // 在服务器端返回一个模拟对象
      return {
        close: () => {}
      }
    }
    
    // 创建 EventSource 实例
    const eventSource = new EventSource(url)
    
    // 添加事件监听器
    if (options.onMessage) {
      eventSource.onmessage = options.onMessage
    }
    
    if (options.onOpen) {
      eventSource.onopen = options.onOpen
    }
    
    if (options.onError) {
      eventSource.onerror = options.onError
    }
    
    // 返回 EventSource 实例
    return eventSource
  }
  
  return {
    createEventSource
  }
} 