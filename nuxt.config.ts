// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

const apiBaseUrl = process.env.API_BASE_URL || 'https://psi-rest-services.onrender.com'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    'nuxt-lucide-icons'
  ],

  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700]
    },
    families: [
      { name: 'Kanit', provider: 'google' }
    ]
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiBaseUrl,
    public: {
      appTitlePrefix: 'PSI Dashboard'
    }
  },

  compatibilityDate: '2025-01-15',
  vite: {
    server: {
      allowedHosts: ['localhost:3001']
    }
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  nitro: {
    routeRules: {
      '/backend/**': { proxy: `${apiBaseUrl}/**` }
    }
  }
})
