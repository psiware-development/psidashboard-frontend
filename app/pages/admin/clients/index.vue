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

    <ListTable
      :loading="loading"
      :is-empty="filteredClients.length === 0"
      empty-icon="i-lucide-building-2"
      empty-text="No se encontraron clientes con esos filtros."
    >
      <template #headers>
        <div class="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-2 border-b border-default bg-neutral-50 dark:bg-neutral-800/40">
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">Cliente</span>
          <span class="text-xs font-semibold text-muted uppercase tracking-wide">Estado</span>
          <span class="text-xs font-semibold text-muted uppercase tracking-wide text-right">Acciones</span>
        </div>
      </template>

      <div
        v-for="client in filteredClients"
        :key="client.idCustomer"
        class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      >
        <!-- Nombre -->
        <div class="flex items-center gap-3">
          <p class="text-sm font-medium text-highlighted">
            {{ client.corporateName }}
          </p>
        </div>

        <!-- Estado -->
        <div>
          <UBadge
            :color="client.active ? 'success' : 'neutral'"
            variant="subtle"
            :label="client.active ? 'Activo' : 'Inactivo'"
            size="md"
          />
        </div>

        <!-- Acciones -->
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-pencil"
            size="sm"
            :to="`/admin/clients/${client.idCustomer}/edit`"
            aria-label="Editar cliente"
          />
        </div>
      </div>
    </ListTable>
  </div>
</template>
