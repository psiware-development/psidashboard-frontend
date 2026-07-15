<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
usePageTitle('Gestión de proyectos')

const {
  loading,
  error,
  projects,
  search,
  filterType,
  filteredProjects,
  fetchProjects
} = useProjectsManagment()

onMounted(() => fetchProjects())

const typeFilterOptions = [
  { label: 'Todos los tipos', value: undefined },
  { label: 'Fijo', value: 'fixed' },
  { label: 'Continuo', value: 'continuos' }
]

const clearFilters = () => {
  search.value = ''
  filterType.value = undefined
}

const hasActiveFilters = computed(() => filterType.value !== undefined)

const projectTypeBadge = (project: typeof filteredProjects.value[number]) => {
  if (project.fixed) return { label: 'Fijo' }
  return { label: 'Continuo' }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <PageHeader
      title="Gestión de proyectos"
      :item-count="projects.length"
      item-label="proyecto"
      action-label="Nuevo proyecto"
      action-icon="i-lucide-folder-plus"
      action-to="/admin/projects/new"
    />

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <ListFilters
      v-model="search"
      search-placeholder="Buscar por proyecto o cliente..."
      :has-active-filters="hasActiveFilters"
      @clear="clearFilters"
    >
      <USelect
        v-model="filterType"
        :items="typeFilterOptions"
        class="min-w-[160px]"
        placeholder="Tipo"
      />
    </ListFilters>

    <ListTable
      :loading="loading"
      :is-empty="filteredProjects.length === 0"
      empty-icon="i-lucide-folder-kanban"
      empty-text="No se encontraron proyectos con esos filtros."
    >
      <template #headers>
        <div class="hidden sm:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-2 border-b border-default bg-neutral-50 dark:bg-neutral-800/40">
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">Proyecto</span>
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">Cliente</span>
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">Tipo</span>
          <span class="text-xs font-semibold text-muted uppercase tracking-wide text-right">Acciones</span>
        </div>
      </template>

      <div
        v-for="project in filteredProjects"
        :key="project.idProject"
        class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      >
        <!-- Proyecto -->
        <div class="flex items-center gap-3">
          <p class="text-sm font-medium text-highlighted">
            {{ project.description }}
          </p>
        </div>

        <!-- Cliente -->
        <div>
          <span
            class="text-sm font-medium"
            :class="project.internal ? 'text-primary' : 'text-highlighted'"
          >
            {{ project.customer.corporateName }}
          </span>
        </div>

        <!-- Tipo -->
        <div class="flex flex-wrap gap-1.5">
          <UBadge
            variant="subtle"
            :label="projectTypeBadge(project).label"
            size="md"
          />
        </div>

        <!-- Acciones -->
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-eye"
            size="sm"
            :to="`/project/${project.idProject}/tracking`"
            aria-label="Ver proyecto"
          />
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-pencil"
            size="sm"
            :to="`/admin/projects/${project.idProject}/edit`"
            aria-label="Editar proyecto"
          />
        </div>
      </div>
    </ListTable>
  </div>
</template>
