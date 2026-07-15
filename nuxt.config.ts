// https://nuxt.com/docs/api/configuration/nuxt-config
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

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiBaseUrl,
    public: {
      appTitlePrefix: 'PSI Dashboard',
      tokenExpirationKey: process.env.TOKEN_EXPIRATION_KEY || 'psidashboard_token_expiration'
    }
  },

  compatibilityDate: '2025-01-15',
  nitro: {
    routeRules: {
      '/backend/**': { proxy: `${apiBaseUrl}/**` }
    }
  },
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

  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700]
    },
    families: [
      { name: 'Kanit', provider: 'google' }
    ]
  }
})
