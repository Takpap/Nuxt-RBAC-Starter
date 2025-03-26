// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/icon',
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
    'dayjs-nuxt'
  ],

  icon: {
    serverBundle: {
      remote: 'jsdelivr' // 'unpkg' or 'github-raw', or a custom function
    }
  }
})
