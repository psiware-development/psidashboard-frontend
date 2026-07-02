export const useExpiredSessionHandler = () => {
  const authStore = useAuthStore()
  const route = useRoute()

  const handleExpiredSession = async () => {
    if (route.path === '/login') {
      return
    }

    authStore.logout()

    await navigateTo({
      path: '/login',
      query: { expired: '1' }
    })
  }

  return {
    handleExpiredSession
  }
}
