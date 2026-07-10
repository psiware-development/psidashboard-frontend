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
  filterActive,
  filteredUsers,
  fetchUsers,
  deleteUser
} = useAdminUsers()

onMounted(() => fetchUsers())

const roleFilterOptions = computed(() => [
  { label: 'Todos los roles', value: undefined },
  ...roles.value.map(r => ({ label: r.description, value: r.idRole }))
])

const activeFilterOptions = [
  { label: 'Todos', value: undefined },
  { label: 'Activos', value: true },
  { label: 'Inactivos', value: false }
]

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
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <SectionTitle title="Gestión de usuarios" />
        <p class="text-sm text-muted mt-1">
          {{ users.length }} usuario{{ users.length !== 1 ? 's' : '' }} registrado{{ users.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-circle-plus"
        label="Nuevo usuario"
        to="/admin/users/new"
      />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <UCard>
      <div class="flex flex-wrap gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Buscar por nombre, usuario o email..."
          class="flex-1 min-w-[220px]"
        />

        <USelect
          v-model="filterRoleId"
          :items="roleFilterOptions"
          class="min-w-[180px]"
          placeholder="Filtrar por rol"
        />

        <USelect
          v-model="filterActive"
          :items="activeFilterOptions"
          class="min-w-[140px]"
          placeholder="Estado"
        />

        <UButton
          v-if="search || filterRoleId !== undefined || filterActive !== undefined"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          label="Limpiar"
          @click="() => { search = ''; filterRoleId = undefined; filterActive = undefined }"
        />
      </div>
    </UCard>

    <UCard :ui="{ body: 'p-0' }">
      <!-- Loading skeleton -->
      <div
        v-if="loading"
        class="divide-y divide-default"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="flex items-center gap-4 px-6 py-4"
        >
          <USkeleton class="w-10 h-10 rounded-full flex-shrink-0" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-4 w-40" />
            <USkeleton class="h-3 w-56" />
          </div>
          <USkeleton class="h-6 w-24 rounded-full" />
          <USkeleton class="h-8 w-8" />
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filteredUsers.length === 0"
        class="flex flex-col items-center justify-center py-16 gap-3"
      >
        <UIcon
          name="i-lucide-users"
          class="w-10 h-10 text-neutral-300 dark:text-neutral-600"
        />
        <p class="text-sm text-muted">
          {{ search || filterRoleId !== undefined || filterActive !== undefined
            ? 'No se encontraron usuarios con esos filtros.'
            : 'No hay usuarios registrados.' }}
        </p>
      </div>

      <!-- Column headers + User rows -->
      <div v-else>
        <div class="hidden sm:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-2 border-b border-default bg-neutral-50 dark:bg-neutral-800/40">
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">Usuario</span>
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">Rol</span>
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">Permisos</span>
          <span class="text-xs font-semibold text-muted uppercase tracking-wide text-right">Acciones</span>
        </div>

        <div class="divide-y divide-default">
          <div
            v-for="user in filteredUsers"
            :key="user.idUser"
            class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <!-- Avatar + name -->
            <div class="flex items-center gap-3">
              <UAvatar
                :src="user.image"
                :alt="user.fullname ?? user.username"
                size="md"
              />
              <div>
                <p class="text-sm font-medium text-highlighted">
                  {{ user.fullname ?? user.username }}
                </p>
                <p class="text-xs text-muted">
                  {{ user.email }}
                </p>
              </div>
            </div>

            <!-- Role -->
            <div>
              <span
                v-if="user.mainRole?.description"
                class="text-sm font-medium text-highlighted"
              >
                {{ user.mainRole.description }}
              </span>
              <span
                v-else
                class="text-xs text-muted"
              >Sin rol</span>
            </div>

            <!-- Permissions badges -->
            <div class="flex flex-wrap gap-1.5">
              <template v-if="getUserPermissions(user).length">
                <UBadge
                  v-for="perm in getUserPermissions(user)"
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

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-eye"
                size="sm"
                :to="`/user/${user.idUser}/resume`"
                aria-label="Ver perfil"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-pencil"
                size="sm"
                :to="`/admin/users/${user.idUser}/edit`"
                aria-label="Editar usuario"
              />
              <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                size="sm"
                aria-label="Eliminar usuario"
                @click="confirmDelete(user)"
              />
            </div>
          </div>
        </div>
      </div>
    </UCard>

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
