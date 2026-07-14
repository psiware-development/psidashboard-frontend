<script setup lang="ts">
import CollaboratorMonitorCard from '~/components/collaborators/CollaboratorMonitorCard.vue'

usePageTitle('Reporte de horas')

const collaboratorsStatus = useCollaboratorsStatus()
const { loading, error, fetchCollaboratorsStatus } = collaboratorsStatus
const collaborators = collaboratorsStatus.collaborators

onMounted(() => {
  fetchCollaboratorsStatus()
})

const collaboratorEntries = computed(() => {
  if (!collaborators.value) {
    return []
  }
  return Object.entries(collaborators.value).filter(([name, status]) => {
    const isBotKey = name.toLowerCase() === 'psiware ia'
    const isBotName = status.user?.fullname?.toLowerCase() === 'psiware ia'
    return !isBotKey && !isBotName
  })
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <SectionTitle title="Reporte de horas" />
    </div>

    <!-- Error state -->
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-alert-circle"
      title="Error al cargar datos"
      :description="error"
    />

    <!-- Skeleton Loaders -->
    <div
      v-if="loading && collaboratorEntries.length === 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-5"
      >
        <div class="flex items-center gap-3">
          <USkeleton class="w-12 h-12 rounded-full" />
          <div class="space-y-2 flex-1">
            <USkeleton class="h-4 w-3/4" />
            <USkeleton class="h-3 w-1/2" />
          </div>
        </div>
        <USkeleton class="h-40 w-full rounded-xl" />
        <div class="space-y-2">
          <USkeleton class="h-3 w-full" />
          <USkeleton class="h-3 w-full" />
          <USkeleton class="h-3 w-3/4" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="collaboratorEntries.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center space-y-3"
    >
      <UIcon
        name="i-lucide-users"
        class="w-12 h-12 text-neutral-400 dark:text-neutral-600"
      />
      <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
        No se encontraron datos de colaboradores.
      </h3>
    </div>

    <!-- Grid of Collaborator Cards -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <CollaboratorMonitorCard
        v-for="[name, status] in collaboratorEntries"
        :key="name"
        :status="status"
      />
    </div>
  </div>
</template>
