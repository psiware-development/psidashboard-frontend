export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const { handleExpiredSession } = useExpiredSessionHandler()

  const api = $fetch.create({
    baseURL: '/backend',
    onRequest({ options }) {
      if (authStore.accessToken) {
        const headers = new Headers(options.headers as HeadersInit | undefined)
        headers.set('Authorization', `Bearer ${authStore.accessToken}`)
        options.headers = headers
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await handleExpiredSession()
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
