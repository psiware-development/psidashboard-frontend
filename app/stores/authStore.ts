export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => {
    const user = ref<any | null>(null)

    return {
      user,
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    userRoles: (state) => {
      let returnValue : UserRoles[];
      if (!state.user) {
        return returnValue = [];
      }

      returnValue = state.user.userRoles.map((u) => u.role);
      return returnValue;
    },
  },
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    async fetchUser() {
      try {
        const { $api } = useNuxtApp();
        const data = await $api('/api/users/me');
        this.user = (data as { data: any }).data; // ajusta según la estructura de respuesta
        return true;
      } catch (error) {
        this.user = null;
        return false;
      }
    },
    async logout() {
      try {
        const { $api } = useNuxtApp();
        await $api('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        // Ignorar errores del backend, igual limpiamos el estado local
      }
      this.user = null;
    }
  },
})