<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
usePageTitle('Gestión de proyectos')

const {
  loading,
  error,
  projects,
  search,
  filterActive,
  filteredProjects,
  fetchProjects
} = useProjectsManagment()

onMounted(() => fetchProjects())

const activeFilterOptions = [
  { label: 'Todos', value: undefined },
  { label: 'Activos', value: true },
  { label: 'Inactivos', value: false }
]
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

    <!-- ── Filters ─────────────────────────────────────────────────────── -->
    <ListFilters
      v-model="search"
      search-placeholder="Buscar por nombre o descripción..."
      :has-active-filters="filterActive !== undefined"
      @clear="() => { search = ''; filterActive = undefined }"
    >
      <USelect
        v-model="filterActive"
        :items="activeFilterOptions"
        class="min-w-[140px]"
        placeholder="Estado"
      />
    </ListFilters>

    <!-- ── Table ───────────────────────────────────────────────────────── -->
    <ListTable
      :loading="loading"
      :is-empty="filteredProjects.length === 0"
      empty-icon="i-lucide-folder-kanban"
      empty-text="No se encontraron proyectos con esos filtros."
    >
      <div
        v-for="project in filteredProjects"
        :key="project.idProject"
        class="flex flex-wrap items-center gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      >
        <!-- Icon + name -->
        <div class="flex items-center gap-3 flex-1 min-w-[200px]">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-folder-kanban"
              class="w-5 h-5 text-primary"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-highlighted">
              {{ project.name }}
            </p>
            <p
              v-if="project.description"
              class="text-xs text-muted line-clamp-1"
            >
              {{ project.description }}
            </p>
            <p
              v-if="project.slug"
              class="text-xs text-muted font-mono"
            >
              /{{ project.slug }}
            </p>
          </div>
        </div>

        <!-- Taiga integration -->
        <div class="min-w-[100px]">
          <span
            v-if="project.idTaigaProject"
            class="flex items-center gap-1 text-xs text-muted"
          >
            <UIcon
              name="i-lucide-git-branch"
              class="w-3.5 h-3.5"
            />
            Taiga #{{ project.idTaigaProject }}
          </span>
        </div>

        <!-- Estado badge -->
        <UBadge
          :color="project.active ? 'success' : 'neutral'"
          variant="subtle"
          :label="project.active ? 'Activo' : 'Inactivo'"
          size="sm"
        />

        <!-- Actions -->
        <div class="flex items-center gap-2 ml-auto">
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
