<template>
  <div class="min-h-screen flex flex-col">
    <UHeader>
      <template #left>
        <AppSiteLogo />
      </template>

      <template #right>
        <nav class="hidden sm:flex items-center gap-1 mr-2">
          <UButton
            v-if="authStore.currentUser?.idUser"
            color="neutral"
            variant="ghost"
            size="sm"
            label="Tareas"
            :to="`/user/${authStore.currentUser.idUser}/tasks`"
          />
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            label="Mis datos"
            to="/me"
          />
        </nav>
        <span class="text-sm text-muted mr-2">
          {{ authStore.displayName }}
        </span>
        <UButton
          color="neutral"
          variant="ghost"
          label="Salir"
          @click="logout"
        />
      </template>
    </UHeader>

    <UMain class="bg-muted/30">
      <slot />
    </UMain>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const logout = async () => {
  authStore.logout()
  await navigateTo('/login')
}
</script>
