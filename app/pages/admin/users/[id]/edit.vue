<script setup lang="ts">
definePageMeta({ roles: ['admin'] })

const route = useRoute()
const userId = computed(() => Number(route.params.id))

const { saving, roles, fetchUsers, fetchUser, updateUser } = useUserManagement()

const loadingUser = ref(true)
const user = ref<Awaited<ReturnType<typeof fetchUser>>>(null)

onMounted(async () => {
  await fetchUsers()
  user.value = await fetchUser(userId.value)
  loadingUser.value = false

  if (user.value) {
    usePageTitle(`Editar — ${user.value.fullname ?? user.value.username}`)
  }
})

const initialData = computed(() => {
  if (!user.value) return undefined
  return {
    username: user.value.username,
    fullname: user.value.fullname ?? '',
    email: user.value.email ?? '',
    idRole: user.value.mainRole?.idRole,
    idTaigaUser: user.value.idTaigaUser,
    gitHubLogin: user.value.gitHubLogin,
    roleSM: user.value.roleSM ?? user.value.scrummaster ?? false,
    roleAdmin: user.value.roleAdmin ?? false
  }
})

const handleSubmit = async (payload: Parameters<typeof updateUser>[1]) => {
  const ok = await updateUser(userId.value, payload)
  if (ok) {
    await navigateTo('/admin/users')
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[800px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <div class="flex items-center gap-3">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        to="/admin/users"
        aria-label="Volver al listado"
      />
      <SectionTitle title="Editar usuario" />
    </div>

    <!-- Loading -->
    <UCard v-if="loadingUser">
      <div class="space-y-4">
        <USkeleton class="h-10" />
        <USkeleton class="h-10" />
        <USkeleton class="h-10" />
        <USkeleton class="h-10" />
      </div>
    </UCard>

    <!-- Not found -->
    <UAlert
      v-else-if="!user"
      color="error"
      variant="subtle"
      title="Usuario no encontrado"
      description="No se encontró un usuario con ese ID."
    />

    <!-- Form -->
    <UCard v-else>
      <UserForm
        mode="edit"
        :saving="saving"
        :roles="roles"
        :initial-data="initialData ?? undefined"
        @submit="handleSubmit"
        @cancel="navigateTo('/admin/users')"
      />
    </UCard>
  </div>
</template>
