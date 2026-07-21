import { jwtDecode } from 'jwt-decode'
import type { User, UserRole, UserStatusResponse } from '~/types/user'

function buildUserRoles(user: User): UserRole[] {
  const roles: UserRole[] = [{ id: 0, role: 'user' }]

  if (user.roleSM) {
    roles.push({ id: 0, role: 'sm' })
  }

  if (user.roleAdmin || user.admin) {
    roles.push({ id: 0, role: 'admin' })
  }

  return roles
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('psidashboard_access_token')
    const user = useCookie<User | null>('psidashboard_current_user')
    const expiration = useCookie<number | null>(config.public.tokenExpirationKey)

    return {
      accessToken: token.value || null,
      currentUser: user.value || null,
      tokenExpiration: expiration.value || null
    }
  },
  getters: {
    isLoggedIn: state => !!state.currentUser && !!state.accessToken,
    userRoles: (state): UserRoles[] => {
      if (!state.currentUser?.roles) {
        return []
      }

      return state.currentUser.roles
        .map(role => role.role as UserRoles)
        .filter(role => Object.values(UserRoles).includes(role))
    },
    displayName: (state) => {
      if (!state.currentUser) {
        return ''
      }

      return state.currentUser.fullname || state.currentUser.username
    }
  },
  actions: {
    isTokenExpired() {
      if (!this.tokenExpiration) {
        return true
      }

      const bufferSeconds = 60
      return this.tokenExpiration - bufferSeconds < Date.now() / 1000
    },
    setSession(token: string, user: User) {
      const decoded = jwtDecode<{ exp: number }>(token)

      this.accessToken = token
      this.currentUser = {
        ...user,
        roles: buildUserRoles(user)
      }
      this.tokenExpiration = decoded.exp

      const maxAge = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000))

      const config = useRuntimeConfig()
      const tokenCookie = useCookie<string | null>('psidashboard_access_token', { maxAge })
      const userCookie = useCookie<User | null>('psidashboard_current_user', { maxAge })
      const expirationCookie = useCookie<number | null>(config.public.tokenExpirationKey, { maxAge })

      tokenCookie.value = token
      userCookie.value = this.currentUser
      expirationCookie.value = decoded.exp
    },
    clearSession() {
      this.accessToken = null
      this.currentUser = null
      this.tokenExpiration = null

      const config = useRuntimeConfig()
      const tokenCookie = useCookie<string | null>('psidashboard_access_token')
      const userCookie = useCookie<User | null>('psidashboard_current_user')
      const expirationCookie = useCookie<number | null>(config.public.tokenExpirationKey)

      tokenCookie.value = null
      userCookie.value = null
      expirationCookie.value = null
    },
    async login(username: string, password: string) {
      const { $api } = useNuxtApp()

      const token = await $api<string>('/users/login', {
        method: 'POST',
        body: { username, password }
      })

      const status = await $api<UserStatusResponse>('/users/me/status', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      this.setSession(token, status.me)
    },

    async restoreSession() {
      if (!this.accessToken || this.isTokenExpired()) {
        this.clearSession()
        return false
      }

      if (this.currentUser) {
        return true
      }

      try {
        const { $api } = useNuxtApp()
        const response = await $api<{ data: { user: User } }>('/users/me')
        const user = response.data.user

        this.currentUser = {
          ...user,
          roles: buildUserRoles(user)
        }

        const maxAge = Math.max(0, (this.tokenExpiration || 0) - Math.floor(Date.now() / 1000))
        const userCookie = useCookie<User | null>('psidashboard_current_user', { maxAge })
        userCookie.value = this.currentUser

        return true
      } catch {
        this.clearSession()
        return false
      }
    },
    logout() {
      this.clearSession()
    }
  }
})
