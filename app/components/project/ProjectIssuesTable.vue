<script setup lang="ts">
import type { ProjectIssueRow } from '~/types/project'
import type { AppTableColumn } from '~/components/AppTable.vue'

defineProps<{
  rows: ProjectIssueRow[]
  loading?: boolean
}>()

const columns: AppTableColumn<ProjectIssueRow>[] = [
  { accessorKey: 'issue', header: 'Issue' },
  { accessorKey: 'description', header: 'Descripción' },
  { accessorKey: 'realHours', header: 'Horas Declaradas' },
  {
    accessorKey: 'user',
    header: 'Usuario Asignado',
    sortFn: (a, b) => (a.user?.fullname ?? '').localeCompare(b.user?.fullname ?? '', 'es')
  }
]
</script>

<template>
  <AppTable
    :data="rows"
    :columns="columns"
    :loading="loading"
    empty-icon="i-lucide-bug"
    empty-text="No hay issues registradas."
  >
    <template #issue-cell="{ row }">
      <a
        v-if="row.original.link"
        :href="row.original.link"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-primary hover:underline"
      >
        {{ row.original.issue }}
      </a>
      <span v-else>{{ row.original.issue }}</span>
    </template>

    <template #description-cell="{ row }">
      <span class="line-clamp-2">{{ row.original.description }}</span>
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
  </AppTable>
</template>
