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
  fetchProjects,
  deleteProject,
  deleting
} = useProjectsManagment()

onMounted(() => fetchProjects())

const typeFilterOptions = [
  { label: 'Todos los tipos', value: undefined },
  { label: 'Fixed', value: 1 },
  { label: 'Continuo', value: 2 },
  { label: 'Interno', value: 3 }
]

const clearFilters = () => {
  search.value = ''
  filterType.value = undefined
}

const hasActiveFilters = computed(() => filterType.value !== undefined)

const projectTypeBadge = (project: typeof filteredProjects.value[number]) => {
  if (project.projectType === 1) return { label: 'Fixed', color: 'warning' as const }
  if (project.projectType === 3) return { label: 'Interno', color: 'primary' as const }
  return { label: 'Continuo', color: 'neutral' as const }
}

const projectToDelete = ref<{ idProject: number, description: string } | null>(null)
const showDeleteConfirm = ref(false)

const confirmDelete = (project: { idProject: number, description: string }) => {
  projectToDelete.value = project
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!projectToDelete.value) return
  await deleteProject(projectToDelete.value.idProject)
  showDeleteConfirm.value = false
  projectToDelete.value = null
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

    <AppTable
      :data="filteredProjects"
      :columns="[
        { accessorKey: 'description', header: 'Proyecto' },
        {
          accessorKey: 'customer',
          header: 'Cliente',
          sortFn: (a, b) => (a.customer?.corporateName ?? '').localeCompare(b.customer?.corporateName ?? '', 'es')
        },
        {
          accessorKey: 'projectType',
          header: 'Tipo',
          sortFn: (a, b) => projectTypeBadge(a).label.localeCompare(projectTypeBadge(b).label, 'es')
        },
        { accessorKey: 'actions', header: 'Acciones', sortable: false, align: 'right' }
      ]"
      :loading="loading"
      empty-icon="i-lucide-folder-kanban"
      empty-text="No se encontraron proyectos con esos filtros."
    >
      <template #description-cell="{ row }">
        <p class="text-sm font-medium text-highlighted">
          {{ row.original.description }}
        </p>
      </template>

      <template #customer-cell="{ row }">
        <span
          class="text-sm font-medium"
          :class="row.original.internal ? 'text-primary' : 'text-highlighted'"
        >
          {{ row.original.customer?.corporateName ?? '—' }}
        </span>
      </template>

      <template #projectType-cell="{ row }">
        <div class="flex flex-wrap gap-1.5">
          <UBadge
            variant="subtle"
            :color="projectTypeBadge(row.original).color"
            :label="projectTypeBadge(row.original).label"
            size="md"
          />
        </div>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-eye"
            size="sm"
            :to="`/project/${row.original.idProject}/tracking`"
            aria-label="Ver proyecto"
          />
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-pencil"
            size="sm"
            :to="`/admin/projects/${row.original.idProject}/edit`"
            aria-label="Editar proyecto"
          />
          <UButton
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            size="sm"
            aria-label="Eliminar proyecto"
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
          ¿Estás seguro que querés eliminar el proyecto
          <strong class="text-highlighted">{{ projectToDelete?.description }}</strong>?
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
