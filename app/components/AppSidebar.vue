<script setup lang="ts">
const isExpanded = defineModel<boolean>('isExpanded', { default: true })
defineProps<{
  isMobile: boolean
}>()

const authStore = useAuthStore()
const isAdmin = computed(() => !!authStore.currentUser?.roleAdmin)
const authenticatedUserId = computed(() => authStore.currentUser?.idUser)

const closeSidebar = () => {
  isExpanded.value = false
}

const logout = async () => {
  authStore.logout()
  await navigateTo('/login')
}
</script>

<template>
  <div>
    <div
      v-if="isExpanded && isMobile"
      class="fixed inset-0 bg-neutral-950/20 backdrop-blur-xs z-40 transition-opacity duration-300"
      @click="closeSidebar"
    />

    <aside
      class="fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 z-40 flex flex-col justify-between overflow-x-hidden"
      :class="[
        isExpanded ? 'w-64' : 'w-16',
        isMobile && !isExpanded ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <div class="flex-1 py-4 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        <AppSidebarLink
          to="/"
          icon="i-lucide-home"
          label="Inicio"
          :is-expanded="isExpanded"
        />

        <AppSidebarLink
          :to="`/user/${authenticatedUserId}/tasks`"
          icon="i-lucide-check-square"
          label="Mis tareas"
          :is-expanded="isExpanded"
        />

        <AppSidebarLink
          :to="`/user/${authenticatedUserId}/resume`"
          icon="i-lucide-file-text"
          label="Mi resumen"
          :is-expanded="isExpanded"
        />

        <AppSidebarLink
          to="/collaborators/monitor"
          icon="i-lucide-clock"
          label="Reporte de horas"
          :is-expanded="isExpanded"
        />

        <div
          v-if="isAdmin"
          class="space-y-1"
        >
          <p
            v-if="isExpanded"
            class="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2"
          >
            Administración
          </p>

          <AppSidebarLink
            to="/admin/users"
            icon="i-lucide-users"
            label="Usuarios"
            :is-expanded="isExpanded"
          />

          <AppSidebarLink
            to="/admin/projects"
            icon="i-lucide-folder-kanban"
            label="Proyectos"
            :is-expanded="isExpanded"
          />

          <AppSidebarLink
            to="/admin/clients"
            icon="i-lucide-handshake"
            label="Clientes"
            :is-expanded="isExpanded"
          />
        </div>
      </div>

      <div class="p-3 border-t border-neutral-200 dark:border-neutral-800">
        <button
          class="flex items-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all duration-200 group py-2.5 w-full"
          :class="isExpanded ? 'px-3 gap-3' : 'justify-center px-0 w-10 mx-auto'"
          @click="logout"
        >
          <UIcon
            name="i-lucide-log-out"
            class="w-5 h-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors"
          />
          <span
            v-if="isExpanded"
            class="text-sm font-medium transition-opacity duration-200"
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  </div>
</template>
