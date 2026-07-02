import { publicPages } from '~/utils/publicPages'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const isPublicRoute = publicPages.includes(to.path)

  if (isPublicRoute && to.path !== '/login') {
    return
  }

  if (authStore.accessToken && authStore.isTokenExpired()) {
    authStore.logout()

    if (!isPublicRoute) {
      return navigateTo({
        path: '/login',
        query: { expired: '1', redirect: to.fullPath }
      })
    }
  }

  let isLoggedIn = false

  if (authStore.accessToken && !authStore.isTokenExpired()) {
    if (authStore.currentUser) {
      isLoggedIn = true
    } else {
      isLoggedIn = await authStore.restoreSession()
    }
  }

  if (!isLoggedIn && !isPublicRoute) {
    return navigateTo('/login')
  }

  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
