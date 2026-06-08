// plugins/api.ts
export default defineNuxtPlugin(() => {

  const { handleExpiredSession } = useExpiredSessionHandler();

  const api = $fetch.create({
    baseURL: '/backend',
    credentials: 'include',
    onRequest({ options }) {
      // En SSR, las cookies del navegador no están disponibles automáticamente.
      // Necesitamos pasar las cookies del request original al backend.
      if (import.meta.server) {
        const headers = useRequestHeaders(['cookie'])
        if (headers.cookie) {
          options.headers = {
            ...options.headers,
            cookie: headers.cookie
          }
        }
      }
    },
    async onResponse({ response }) {
      if (response.status === 401) {
        handleExpiredSession();
      }
    }

  })

  return {
    provide: {
      api
    }
  }
})