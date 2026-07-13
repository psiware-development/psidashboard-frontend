import type { User, UserMainRole, UserFormPayload } from '~/types/user'

export type { User as AdminUser, UserFormPayload as AdminUserFormPayload }

export const useUserManagement = () => {
  const { $api } = useNuxtApp()
  const toast = useToast()

  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const users = ref<User[]>([])

  // Roles derivados de los usuarios cargados
  const roles = computed<UserMainRole[]>(() => {
    const seen = new Set<number>()
    const result: UserMainRole[] = []
    for (const u of users.value) {
      if (u.mainRole && !seen.has(u.mainRole.idRole)) {
        seen.add(u.mainRole.idRole)
        result.push({ idRole: u.mainRole.idRole, description: u.mainRole.description || '' })
      }
    }
    return result.sort((a, b) => (a.description || '').localeCompare(b.description || ''))
  })

  const search = ref('')
  const filterRoleId = ref<number | undefined>()

  const filteredUsers = computed(() => {
    return users.value.filter((u) => {
      const matchesSearch = !search.value
        || u.fullname?.toLowerCase().includes(search.value.toLowerCase())
        || u.username?.toLowerCase().includes(search.value.toLowerCase())
        || u.email?.toLowerCase().includes(search.value.toLowerCase())

      const matchesRole = filterRoleId.value === undefined
        || u.mainRole?.idRole === filterRoleId.value

      return matchesSearch && matchesRole
    })
  })

  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $api<User[]>('/users/active')
      users.value = response || []
    } catch {
      error.value = 'No se pudo cargar el listado de usuarios.'
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id: number): Promise<User | null> => {
    try {
      return await $api<User>(`/users/${id}`)
    } catch {
      return null
    }
  }

  const createUser = async (payload: UserFormPayload): Promise<boolean> => {
    saving.value = true
    try {
      await $api('/users', {
        method: 'POST',
        body: {
          username: payload.username,
          fullname: payload.fullname,
          email: payload.email,
          password: payload.password,
          id_role: payload.idRole,
          id_taiga_user: payload.idTaigaUser || null,
          git_hub_login: payload.gitHubLogin || null,
          role_sm: payload.roleSM ?? false,
          role_admin: payload.roleAdmin ?? false
        }
      })
      toast.add({ title: 'Usuario creado correctamente', color: 'success' })
      return true
    } catch {
      toast.add({ title: 'Error al crear el usuario', color: 'error' })
      return false
    } finally {
      saving.value = false
    }
  }

  const updateUser = async (id: number, payload: UserFormPayload): Promise<boolean> => {
    saving.value = true
    try {
      await $api(`/users/${id}`, {
        method: 'PATCH',
        body: {
          username: payload.username,
          fullname: payload.fullname,
          email: payload.email,
          ...(payload.password ? { password: payload.password, passwordConfirm: payload.password } : {}),
          id_role: payload.idRole,
          id_taiga_user: payload.idTaigaUser || null,
          git_hub_login: payload.gitHubLogin || null,
          role_sm: payload.roleSM ?? false,
          role_admin: payload.roleAdmin ?? false
        }
      })
      toast.add({ title: 'Usuario actualizado correctamente', color: 'success' })
      return true
    } catch {
      toast.add({ title: 'Error al actualizar el usuario', color: 'error' })
      return false
    } finally {
      saving.value = false
    }
  }

  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      await $api(`/users/${id}`, { method: 'DELETE' })
      users.value = users.value.filter(u => u.idUser !== id)
      toast.add({ title: 'Usuario eliminado', color: 'success' })
      return true
    } catch {
      toast.add({ title: 'Error al eliminar el usuario', color: 'error' })
      return false
    }
  }

  return {
    loading,
    saving,
    error,
    users,
    roles,
    search,
    filterRoleId,
    filteredUsers,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser
  }
}
