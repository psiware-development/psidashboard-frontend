import type { User, UserMainRole, UserFormPayload } from '~/types/user'

export type { User as AdminUser, UserFormPayload as AdminUserFormPayload }

function toUserApiPayload(payload: UserFormPayload, isUpdate: boolean) {
  return {
    username: payload.username,
    fullname: payload.fullname,
    email: payload.email,
    // On create always send password; on update only when the field was filled.
    ...(isUpdate
      ? (payload.password ? { password: payload.password, passwordConfirm: payload.password } : {})
      : { password: payload.password }),
    id_role: payload.idRole,
    id_taiga_user: payload.idTaigaUser || null,
    git_hub_login: payload.gitHubLogin || null,
    role_sm: payload.roleSM ?? false,
    role_admin: payload.roleAdmin ?? false
  }
}

export const useUserManagement = () => {
  const filterRoleId = ref<number | undefined>()

  const list = useList<User>({
    endpoints: {
      list: '/users/active',
      item: '/users',
      create: '/users'
    },
    idField: 'idUser',
    filterFn: (u, search) => {
      const matchesSearch = !search
        || u.fullname?.toLowerCase().includes(search.toLowerCase()) === true
        || u.username?.toLowerCase().includes(search.toLowerCase()) === true
        || u.email?.toLowerCase().includes(search.toLowerCase()) === true

      const matchesRole = filterRoleId.value === undefined
        || u.mainRole?.idRole === filterRoleId.value

      return matchesSearch && matchesRole
    },
    messages: {
      fetchError: 'No se pudo cargar el listado de usuarios.',
      createSuccess: 'Usuario creado correctamente.',
      createError: 'Error al crear el usuario.',
      updateSuccess: 'Usuario actualizado correctamente.',
      updateError: 'Error al actualizar el usuario.',
      deleteSuccess: 'Usuario eliminado.',
      deleteError: 'Error al eliminar el usuario.'
    }
  })

  const roles = computed<UserMainRole[]>(() => {
    const seen = new Set<number>()
    const result: UserMainRole[] = []
    for (const u of list.items.value) {
      if (u.mainRole && !seen.has(u.mainRole.idRole)) {
        seen.add(u.mainRole.idRole)
        result.push({ idRole: u.mainRole.idRole, description: u.mainRole.description || '' })
      }
    }
    return result.sort((a, b) => (a.description || '').localeCompare(b.description || ''))
  })

  const createUser = (payload: UserFormPayload) =>
    list.create(toUserApiPayload(payload, false))

  const updateUser = (id: number, payload: UserFormPayload) =>
    list.update(id, toUserApiPayload(payload, true))

  return {
    loading: list.loading,
    saving: list.saving,
    error: list.error,
    users: list.items,
    roles,
    search: list.search,
    filterRoleId,
    filteredUsers: list.filteredItems,
    fetchUsers: list.fetch,
    fetchUser: list.fetchOne,
    createUser,
    updateUser,
    deleteUser: list.remove
  }
}
