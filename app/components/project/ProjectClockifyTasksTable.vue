<script setup lang="ts">
import type { ProjectTaskRow } from '~/types/project'
import type { AppTableColumn } from '~/components/AppTable.vue'

defineProps<{
  rows: ProjectTaskRow[]
  loading?: boolean
}>()

const columns: AppTableColumn<ProjectTaskRow>[] = [
  { accessorKey: 'taigaRef', header: 'Taiga' },
  { accessorKey: 'description', header: 'Descripción (Clockify)' },
  {
    accessorKey: 'user',
    header: 'Usuario',
    sortFn: (a, b) => (a.user?.fullname ?? '').localeCompare(b.user?.fullname ?? '', 'es')
  },
  { accessorKey: 'classification', header: 'Clasificación' },
  { accessorKey: 'date', header: 'Fecha' },
  { accessorKey: 'hours', header: 'Horas' },
  { accessorKey: 'needRefinement', header: 'Estado' }
]
</script>

<template>
  <AppTable
    :data="rows"
    :columns="columns"
    :loading="loading"
    empty-icon="i-lucide-clock"
    empty-text="No hay registros de Clockify para este proyecto."
  >
    <template #taigaRef-cell="{ row }">
      <a
        v-if="row.original.taigaLink"
        :href="row.original.taigaLink"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-primary hover:underline"
      >
        {{ row.original.taigaRef }}
      </a>
      <span v-else>{{ row.original.taigaRef }}</span>
    </template>

    <template #user-cell="{ row }">
      <div
        v-if="row.original.user"
        class="flex items-center gap-2"
      >
        <UAvatar
          :src="row.original.user.image"
          :alt="row.original.user.fullname"
          size="xs"
        />
        <span>{{ row.original.user.fullname }}</span>
      </div>
      <span v-else>-</span>
    </template>

    <template #needRefinement-cell="{ row }">
      <UIcon
        :name="row.original.needRefinement ? 'i-lucide-alert-circle' : 'i-lucide-check-circle-2'"
        :class="row.original.needRefinement ? 'text-warning' : 'text-success'"
        class="size-5 mx-auto"
      />
    </template>
  </AppTable>
</template>
