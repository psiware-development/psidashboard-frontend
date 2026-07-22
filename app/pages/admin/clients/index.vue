<script setup lang="ts">
definePageMeta({ roles: ['admin'] })
usePageTitle('Gestión de clientes')

const {
  loading,
  error,
  clients,
  search,
  filterActive,
  filteredClients,
  fetchClients
} = useClientsManagment()

onMounted(() => fetchClients())

const statusFilterOptions = [
  { label: 'Todos los estados', value: undefined },
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
]
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <PageHeader
      title="Gestión de clientes"
      :item-count="clients.length"
      item-label="cliente"
      action-label="Nuevo cliente"
      action-icon="i-lucide-circle-plus"
      action-to="/admin/clients/new"
    />

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <ListFilters
      v-model="search"
      search-placeholder="Buscar por nombre..."
      :has-active-filters="filterActive !== undefined"
      @clear="() => { search = ''; filterActive = undefined }"
    >
      <USelect
        v-model="filterActive"
        :items="statusFilterOptions"
        class="min-w-[180px]"
        placeholder="Filtrar por estado"
      />
    </ListFilters>

    <AppTable
      :data="filteredClients"
      :columns="[
        { accessorKey: 'corporateName', header: 'Cliente' },
        { accessorKey: 'active', header: 'Estado' },
        { accessorKey: 'actions', header: 'Acciones', sortable: false, align: 'right' }
      ]"
      :loading="loading"
      empty-icon="i-lucide-building-2"
      empty-text="No se encontraron clientes con esos filtros."
    >
      <template #corporateName-cell="{ row }">
        <p class="text-sm font-medium text-highlighted">
          {{ row.original.corporateName }}
        </p>
      </template>

      <template #active-cell="{ row }">
        <UBadge
          :color="row.original.active ? 'success' : 'neutral'"
          variant="subtle"
          :label="row.original.active ? 'Activo' : 'Inactivo'"
          size="md"
        />
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-pencil"
            size="sm"
            :to="`/admin/clients/${row.original.idCustomer}/edit`"
            aria-label="Editar cliente"
          />
        </div>
      </template>
    </AppTable>
  </div>
</template>
