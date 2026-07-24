<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
usePageTitle('Gestión de usuarios')

const {
  loading,
  error,
  users,
  roles,
  search,
  filterRoleId,
  filteredUsers,
  fetchUsers,
  deleteUser
} = useUserManagement()

onMounted(() => fetchUsers())

const roleFilterOptions = computed(() => [
  { label: 'Todos los roles', value: undefined },
  ...roles.value.map(r => ({ label: r.description, value: r.idRole }))
])

type PermissionBadge = { label: string, color: 'warning' | 'neutral' }

const getUserPermissions = (user: { roleAdmin?: boolean, roleSM?: boolean, scrummaster?: boolean, operationsManager?: boolean }): PermissionBadge[] => {
  const badges: PermissionBadge[] = []
  if (user.roleAdmin) badges.push({ label: 'Admin', color: 'warning' })
  if (user.roleSM || user.scrummaster) badges.push({ label: 'SM', color: 'neutral' })
  if (user.operationsManager) badges.push({ label: 'Ops', color: 'neutral' })
  return badges
}

const userToDelete = ref<{ idUser: number, fullname?: string } | null>(null)
const showDeleteConfirm = ref(false)
const deleting = ref(false)

const confirmDelete = (user: { idUser: number, fullname?: string }) => {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!userToDelete.value) return
  deleting.value = true
  await deleteUser(userToDelete.value.idUser)
  deleting.value = false
  showDeleteConfirm.value = false
  userToDelete.value = null
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <PageHeader
      title="Gestión de usuarios"
      :item-count="users.length"
      item-label="usuario"
      action-label="Nuevo usuario"
      action-icon="i-lucide-circle-plus"
      action-to="/admin/users/new"
    />

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <ListFilters
      v-model="search"
      search-placeholder="Buscar por nombre, usuario o email..."
      :has-active-filters="filterRoleId !== undefined"
      @clear="() => { search = ''; filterRoleId = undefined }"
    >
      <USelect
        v-model="filterRoleId"
        :items="roleFilterOptions"
        class="min-w-[180px]"
        placeholder="Filtrar por rol"
      />
    </ListFilters>

    <AppTable
      :data="filteredUsers"
      :columns="[
        {
          accessorKey: 'fullname',
          header: 'Usuario',
          sortFn: (a, b) => (a.fullname ?? a.username).localeCompare(b.fullname ?? b.username, 'es')
        },
        {
          accessorKey: 'mainRole',
          header: 'Rol',
          sortFn: (a, b) => (a.mainRole.description ?? '').localeCompare(b.mainRole.description ?? '', 'es')
        },
        { accessorKey: 'permissions', header: 'Permisos', sortable: false },
        { accessorKey: 'actions', header: 'Acciones', sortable: false, align: 'right' }
      ]"
      :loading="loading"
      empty-icon="i-lucide-users"
      empty-text="No se encontraron usuarios con esos filtros."
    >
      <template #fullname-cell="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="row.original.image"
            :alt="row.original.fullname ?? row.original.username"
            size="md"
          />
          <div>
            <p class="text-sm font-medium text-highlighted">
              {{ row.original.fullname ?? row.original.username }}
            </p>
            <p class="text-xs text-muted">
              {{ row.original.email }}
            </p>
          </div>
        </div>
      </template>

      <template #mainRole-cell="{ row }">
        <span
          v-if="row.original.mainRole.description"
          class="text-sm font-medium text-highlighted"
        >
          {{ row.original.mainRole.description }}
        </span>
        <span
          v-else
          class="text-xs text-muted"
        >Sin rol</span>
      </template>

      <template #permissions-cell="{ row }">
        <div class="flex flex-wrap gap-1.5">
          <template v-if="getUserPermissions(row.original).length">
            <UBadge
              v-for="perm in getUserPermissions(row.original)"
              :key="perm.label"
              :color="perm.color"
              variant="subtle"
              :label="perm.label"
              size="md"
            />
          </template>
          <span
            v-else
            class="text-xs text-muted"
          >—</span>
        </div>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-eye"
            size="sm"
            :to="`/user/${row.original.idUser}/resume`"
            aria-label="Ver perfil"
          />
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-pencil"
            size="sm"
            :to="`/admin/users/${row.original.idUser}/edit`"
            aria-label="Editar usuario"
          />
          <UButton
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            size="sm"
            aria-label="Eliminar usuario"
            @click="confirmDelete(row.original)"
          />
        </div>
      </template>
    </AppTable>

    <UModal
      v-model:open="showDeleteConfirm"
      title="Confirmar eliminación"
    >
      <template #body>
        <p class="text-sm text-muted">
          ¿Estás seguro que querés eliminar al usuario
          <strong class="text-highlighted">{{ userToDelete?.fullname }}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="showDeleteConfirm = false"
          />
          <UButton
            color="error"
            label="Eliminar"
            :loading="deleting"
            @click="handleDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
