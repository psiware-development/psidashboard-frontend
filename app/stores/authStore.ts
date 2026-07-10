import { jwtDecode } from 'jwt-decode'
import type { User, UserRole, UserStatusResponse, SignupResponse } from '~/types/user'

const TOKEN_EXPIRATION_KEY = 'psidashboard_expiration_token_session'

function buildUserRoles(user: User): UserRole[] {
  const roles: UserRole[] = [{ role: 'user' }]

  if (user.roleSM) {
    roles.push({ role: 'sm' })
  }

  if (user.roleAdmin || user.admin) {
    roles.push({ role: 'admin' })
  }

  return roles
}

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => ({
    accessToken: null as string | null,
    currentUser: null as User | null,
    tokenExpiration: null as number | null
  }),
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

      return this.tokenExpiration < Date.now() / 1000
    },
    setSession(token: string, user: User) {
      const decoded = jwtDecode<{ exp: number }>(token)

      this.accessToken = token
      this.currentUser = {
        ...user,
        roles: buildUserRoles(user)
      }
      this.tokenExpiration = decoded.exp

      if (import.meta.client) {
        localStorage.setItem(TOKEN_EXPIRATION_KEY, String(decoded.exp))
      }
    },
    clearSession() {
      this.accessToken = null
      this.currentUser = null
      this.tokenExpiration = null

      if (import.meta.client) {
        localStorage.removeItem(TOKEN_EXPIRATION_KEY)
      }
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
    async register(payload: {
      username: string
      email: string
      password: string
      passwordConfirm: string
    }) {
      const { $api } = useNuxtApp()

      const response = await $api<SignupResponse>('/users/signup', {
        method: 'POST',
        body: payload
      })

      this.setSession(response.token, {
        ...response.data.user,
        roles: buildUserRoles(response.data.user)
      })
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
