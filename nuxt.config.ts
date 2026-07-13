// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  site: {
    url: 'https://urbanluxury.es',
    name: 'Urban Luxury | Elegancia callejera Redefinida',
    description: 'Tienda de ropa con piezas atemporales de alta calidad',
    defaultLocale: 'es'
  },

  runtimeConfig: {
    sessionPassword: ''
  },

  routeRules: {
    '/': { prerender: true }
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
