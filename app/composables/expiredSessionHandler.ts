export const useExpiredSessionHandler = () => {
  const store = useAuthStore()
  const handleExpiredSession = async () => {
    await store.logout()
    navigateTo('/login')
  }

  return {
    handleExpiredSession
  }
}
